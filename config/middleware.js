module.exports = {
  load: {
    before: [
      "gzip",
      "poweredBy",
      "logger",
      "favicon",
      "public",
      "responseTime",
    ],
  },
  settings: {
    logger: {
      level: "info",
    },
    gzip: {
      enabled: true,
    },
    poweredBy: {
      enabled: false,
    },
    public: {
      maxAge: 60000,
    },
  },
};
