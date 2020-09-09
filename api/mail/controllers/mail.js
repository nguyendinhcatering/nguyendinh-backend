"use strict";
const Axios = require("axios");
const axios = Axios.create({ baseURL: process.env.MAILER_URL });

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  contact: async (ctx) => {
    const siteOptions = await strapi.services["site-generic-data"].find();

    try {
      await strapi.services.mail.send({
        template: "contact-us",
        smtpOptions: {
          to: siteOptions.adminEmail,
        },
        variables: {
          email: ctx.request.body.email,
          name: ctx.request.body.name,
          message: ctx.request.body.message,
          address: ctx.request.body.address,
        },
      });

      ctx.response.status = 200;
      return "Successfully sent email";
    } catch (err) {
      ctx.response.status = 400;
      return "Cannot send email";
    }
  },
};
