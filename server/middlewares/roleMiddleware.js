const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Role de usuário não definida'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  };
};

const isAdmin = roleMiddleware('ADMIN');

const isGuide = roleMiddleware('ADMIN', 'GUIDE');

const isUser = roleMiddleware('ADMIN', 'GUIDE', 'USER');

module.exports = { roleMiddleware, isAdmin, isGuide, isUser };
