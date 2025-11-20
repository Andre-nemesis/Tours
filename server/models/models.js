// src/database/models.js
import sequelize from './sequelize.js';

import Locations from './locations.js';
import Attractions from './attractions.js'
import Views from './views.js';
import Users from './users.js';

const db = {
    Locations: Locations(sequelize),
    Attractions: Attractions(sequelize),
    Views: Views(sequelize),
    Users: Users(sequelize),
    sequelize,        
    Sequelize: sequelize.constructor
};

Object.values(db).forEach(model => {
    if (model && typeof model.registerAssociations === 'function') {
        model.registerAssociations(db);
    }
});

export default db;