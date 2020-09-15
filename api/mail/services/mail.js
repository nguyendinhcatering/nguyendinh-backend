"use strict";
const _ = require("lodash");
const axios = require("axios");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  send: async (ctx) => {
    try {
      await axios.post(`${process.env.MAILER_URL}/`, ctx);

      return "Successfully sent email";
    } catch (err) {
      return "Cannot send email";
    }
  },
};
