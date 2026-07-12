module.exports = function configureSecurity(app, config) {
  app.use(config.cors(config.corsOptions));

  app.use(config.helmet());

  app.use(config.compression());

  app.use(config.morgan('combined'));

  app.use(config.generalLimiter);

  app.use('/api/auth/login', config.authLoginLimiter);

  app.use(config.express.json());

  app.use(config.xss());

  app.use(config.mongoSanitize());

  app.use(config.express.urlencoded({ extended: true }));
};
