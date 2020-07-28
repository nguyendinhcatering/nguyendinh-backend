"use strict";
const { sanitizeEntity } = require("strapi-utils");
const _ = require("lodash");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  getPageByUrl: async (ctx) => {
    if (!ctx.request.query || !ctx.request.query.url) {
      return null;
    }

    let entities = await strapi.services.page.find({});

    return entities
      .filter(
        (entity) => _.get(entity, "metadata.menu.url") === ctx.request.query.url
      )
      .map((entity) => sanitizeEntity(entity, { model: strapi.models.page }));
  },
};
