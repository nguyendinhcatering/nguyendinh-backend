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
      entities = await strapi.services["news-type"].search(ctx.query, []);
    } else {
      entities = await strapi.services["news-type"].find(ctx.query, []);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["news-type"] })
    );
  },

  async findByNewsType(ctx) {
    console.log(ctx.params);
    console.log(ctx.query);
    const entity = await strapi.services["news-type"].findOne(
      {
        id: ctx.params.id,
      },
      []
    );
    entity["news_items"] = await strapi.services["news-item"].find(
      {
        _sort: "updated_at:ASC",
        _where: {
          news_types: ctx.params.id,
          published: true,
        },
        _limit: ctx.query.limit || 100,
        _start: (ctx.query.start || 0) * (ctx.query.limit || 100),
      },
      ["banners"]
    );

    return sanitizeEntity(entity, { model: strapi.models["news-type"] });
  },
};
