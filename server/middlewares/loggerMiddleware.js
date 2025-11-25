const logger = (req, res, next) => {
  const start = Date.now();

  // Captura informações da requisição
  const requestInfo = {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent')
  };

  // Log quando a resposta finalizar
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    const logMessage = `[${timestamp}] ${requestInfo.method} ${requestInfo.path} - Status: ${res.statusCode} - ${duration}ms - IP: ${requestInfo.ip}`;

    // Colorir output baseado no status code
    if (res.statusCode >= 500) {
      console.error('\x1b[31m%s\x1b[0m', logMessage); // Vermelho
    } else if (res.statusCode >= 400) {
      console.warn('\x1b[33m%s\x1b[0m', logMessage); // Amarelo
    } else if (res.statusCode >= 300) {
      console.log('\x1b[36m%s\x1b[0m', logMessage); // Ciano
    } else {
      console.log('\x1b[32m%s\x1b[0m', logMessage); // Verde
    }
  });

  next();
};

const requestLogger = logger;

module.exports = { logger, requestLogger };
