import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError } from 'sequelize';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Erro customizado com statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Erros do Sequelize
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      success: false,
      message: 'Registro duplicado',
      fields: err?.fields || null,
      ...(process.env.NODE_ENV === 'development' && { errors: err?.errors })
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos fornecidos',
      errors: err.errors?.map(e => ({ message: e.message, path: e.path, value: e.value })) || null
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      success: false,
      message: 'Violação de integridade referencial',
      ...(err.index && { index: err.index })
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      success: false,
      message: 'Erro de banco de dados',
      ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
    });
  }

  // Erro padrão
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.path} não encontrada`
  });
};
