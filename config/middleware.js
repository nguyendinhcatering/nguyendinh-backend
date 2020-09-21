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
      level: "debug",
    },
    gzip: {
      enabled: false,
    },
    poweredBy: {
      enabled: false,
    },
    public: {
      maxAge: 60000,
    },
  },
};
