"use strict";
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["news-item"].search(ctx.query);
    } else {
      entities = await strapi.services["news-item"].find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["news-item"] })
    );
  },

  async findByNewsType(ctx) {
    console.log(ctx);
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["news-item"].search(ctx.query);
    } else {
      entities = await strapi.services["news-item"].find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["news-item"] })
    );
  },
};
