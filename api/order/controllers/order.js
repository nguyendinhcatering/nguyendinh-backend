"use strict";
const { renderEditorData } = require("../../../utils/blocksToMarkup");
const { formatNumber } = require("../../../utils/formatNumber");

const { sanitizeEntity, parseMultipartData } = require("strapi-utils");
const _ = require("lodash");
const moment = require("moment");
require("moment/locale/vi");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const sendMail = async (entityOrId) => {
  let entity = entityOrId;
  if (typeof entityOrId === "number") {
    entity = await strapi.services.order.findOne({ id: entityOrId });
  }

  const orderMasterData = await strapi.services["order-data"].find();
  const siteOptions = await strapi.services["site-generic-data"].find();

  const orderDateTime = moment.utc(
    entity.orderDate.split("T")[0] + "T" + entity.orderTime + "Z"
  );

  const orderDate = `${moment(orderDateTime).format("L")} (${_.capitalize(
    moment(orderDateTime).format("dddd")
  )})`;
  const orderTime = moment(orderDateTime).format("hh:mm A");

  await strapi.services.mail.send({
    template: "order",
    smtpOptions: {
      to: entity.email,
      cc: siteOptions.adminEmail,
    },
    variables: {
      id: `ND${_.padStart(entity.id, 6, "0")}`,
      title: entity.title,
      fullName: entity.fullName,
      orderType: entity.orderType,
      email: entity.email,
      phone: entity.phone,
      alternativePhone: entity.alternativePhone,
      note: entity.note,
      orderData: {
        quantity: entity.orderData.quantity,
        presetItems: entity.orderData.presetItems.map((presetItem) => ({
          ...presetItem,
          price: formatNumber(presetItem.price),
        })),
        unitPrice: formatNumber(entity.orderData.unitPrice),
        totalPrice: formatNumber(
          entity.orderData.unitPrice * entity.orderData.quantity
        ),
      },
      orderDate,
      orderTime,
      responsibility: renderEditorData(orderMasterData.responsibility),
    },
  });
};

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

    sendMail(entity);

    return sanitizeEntity(entity, { model: strapi.models.order });
  },
  async resendMail(ctx) {
    sendMail(ctx.request.body);
  },
};
