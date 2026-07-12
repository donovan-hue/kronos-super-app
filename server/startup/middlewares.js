module.exports = function configureMiddlewares(app) {
  // Express
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));

  // Seguridad
  // app.use(xss());
  // app.use(mongoSanitize());

  // Passport
  // app.use(passport.initialize());

  return app;
};
