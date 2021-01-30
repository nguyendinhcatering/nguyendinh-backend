"use strict";
const { sanitizeEntity, parseMultipartData } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.inquiry.create(data, { files });
    } else {
      entity = await strapi.services.inquiry.create(ctx.request.body);
    }

    strapi.services["mail"].sendContactUs(entity);

    return sanitizeEntity(entity, { model: strapi.models.inquiry });
  },
};
