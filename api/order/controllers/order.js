"use strict";
const { sanitizeEntity, parseMultipartData } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findOne(ctx) {
    const { id } = ctx.params;
    const { secret } = ctx.query;

    if (!secret) {
      ctx.response.status = 400;
      return { error: "bad_request" };
    }

    const entity = await strapi.services.order.findOne({ id });

    if (entity.secret !== secret) {
      ctx.response.status = 401;
      return { error: "unauthorized" };
    }

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.order.create(data, { files });
    } else {
      entity = await strapi.services.order.create(ctx.request.body);
    }

    strapi.services["mail"].sendOrder(entity);

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
  async resendMail(ctx) {
    strapi.services["mail"].sendOrder(ctx.body.orderId);
  },
};
