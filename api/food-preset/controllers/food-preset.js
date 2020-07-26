"use strict";

const { sanitizeEntity } = require("strapi-utils");
const _ = require("lodash");

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services["food-preset"].search(ctx.query);
    } else {
      entities = await strapi.services["food-preset"].find(ctx.query, [
        "foodPresetType",
        "foodMenuItems",
        "foodMenuItems.foodCategories",
      ]);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["food-preset"] })
    );
  },
};
