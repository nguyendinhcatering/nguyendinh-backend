"use strict";
const _ = require("lodash");
const Axios = require("axios");
const axios = Axios.create({ baseURL: process.env.MAILER_URL });

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  send: async (ctx) => {
    try {
      await axios.post("/", ctx);

      return "Successfully sent email";
    } catch (err) {
      return "Cannot send email";
    }
  },
};
