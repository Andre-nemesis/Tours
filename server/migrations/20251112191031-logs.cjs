'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'logs',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            allowNull: false,
            primaryKey: true,
          },
          table_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          operation: {
            type: Sequelize.STRING, 
            allowNull: false,
          },
          old_data: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          new_data: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION log_user_changes()
        RETURNS TRIGGER AS $$
        BEGIN
          IF (TG_OP = 'INSERT') THEN
            INSERT INTO logs (table_name, operation, new_data, "createdAt")
            VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), now());
            RETURN NEW;
          ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO logs (table_name, operation, old_data, new_data, "createdAt")
            VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), now());
            RETURN NEW;
          ELSIF (TG_OP = 'DELETE') THEN
            INSERT INTO logs (table_name, operation, old_data, "createdAt")
            VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), now());
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TRIGGER users_log_insert
        AFTER INSERT ON users
        FOR EACH ROW EXECUTE FUNCTION log_user_changes();
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TRIGGER users_log_update
        AFTER UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION log_user_changes();
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TRIGGER users_log_delete
        AFTER DELETE ON users
        FOR EACH ROW EXECUTE FUNCTION log_user_changes();
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS users_log_insert ON users;
        DROP TRIGGER IF EXISTS users_log_update ON users;
        DROP TRIGGER IF EXISTS users_log_delete ON users;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS log_user_changes();
      `, { transaction });

      await queryInterface.dropTable('logs', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
