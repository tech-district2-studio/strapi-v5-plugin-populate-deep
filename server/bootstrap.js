"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === "beforeFindMany" || event.action === "beforeFindOne") {
      const deepPopulate = event.params?.deeppopulate;
      const defaultDepth =
        strapi.plugin("strapi-plugin-populate-deep")?.config("defaultDepth") ||
        5;

      if (deepPopulate && deepPopulate[0] === "deep") {
        const depth = deepPopulate[1] ?? defaultDepth;
        const modelObject = getFullPopulateObject(event.model.uid, depth, []);
        event.params.populate = modelObject.populate;
      }
    }
  });
};
