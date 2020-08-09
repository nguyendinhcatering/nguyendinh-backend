"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (!data.secret) {
        data.secret = generateRandomString(8);
      }
    },
    beforeUpdate: async (params, data) => {
      if (!data.secret) {
        data.secret = generateRandomString(8);
      }
    },
  },
};
