"use strict";
const { sanitizeEntity } = require("strapi-utils");

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
};
