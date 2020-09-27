"use strict";
const _ = require("lodash");
const axios = require("axios");
const { formatNumber } = require("../../../utils/formatNumber");
const moment = require("moment");
require("moment/locale/vi");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendViaSendgrid = async (payload) => {
  const message = {
    from: payload.from,
    replyTo: payload.from,
    to: payload.to,
    cc: payload.cc,
    templateId: payload.templateId,
    dynamicTemplateData: payload.dynamicTemplateData,
  };

  return sgMail.send(message);
};

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  send: async (ctx) => {
    try {
      await axios.post(`${process.env.MAILER_URL}/`, ctx);

      return "Successfully sent email";
    } catch (err) {
      return "Cannot send email";
    }
  },
  sendViaSendgrid: async (payload) => {
    try {
      await sendViaSendgrid(payload);

      return "Successfully sent email";
    } catch (err) {
      console.error(err);

      return "Cannot send email";
    }
  },
  sendContactUs: async (ctx) => {
    {
      const siteOptions = await strapi.services["site-generic-data"].find();

      try {
        await sendViaSendgrid({
          templateId: "d-2719b91003364a43a0737f130dd3ae7e",
          from: siteOptions.adminEmail,
          replyTo: ctx.request.body.email,
          to: siteOptions.adminEmail,
          dynamicTemplateData: {
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
    }
  },
  sendOrder: async (entityOrId) => {
    let entity = entityOrId;
    if (typeof entityOrId === "number") {
      entity = await strapi.services.order.findOne({ id: entityOrId });
    }

    const siteOptions = await strapi.services["site-generic-data"].find();

    const orderDate = moment(entity.orderDate);

    const orderDateString = `${orderDate.format("L")} (${_.capitalize(
      moment(orderDate).format("dddd")
    )})`;
    const orderTimeString = orderDate.format("hh:mm A");

    await sendViaSendgrid({
      templateId: "d-5a560a536950497ca69b74838b3d50fa",
      from: siteOptions.adminEmail,
      replyTo: siteOptions.adminEmail,
      to: entity.email,
      cc: siteOptions.adminEmail,
      dynamicTemplateData: {
        id: `ND${_.padStart(entity.id, 6, "0")}`,
        title: entity.title,
        fullName: entity.fullName,
        orderType: entity.orderType,
        email: entity.email,
        phone: entity.phone,
        address: entity.address,
        paymentMethod: entity.paymentMethod,
        alternativePhone: entity.alternativePhone,
        note: entity.note,
        orderData: {
          unit: entity.orderData.meta.unit,
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
        orderDate: orderDateString,
        orderTime: orderTimeString,
      },
    });
  },
};
