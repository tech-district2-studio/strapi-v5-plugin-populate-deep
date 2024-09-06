"use strict";
const { getFullPopulateObject } = require("./helpers");

module.exports = ({ strapi }) => {
  strapi.db.lifecycles.subscribe((event) => {
    if (event.action === "beforeFindMany" || event.action === "beforeFindOne") {
      const deepPopulate = event.params?.deeppopulate;
      const defaultDepth =
        strapi.plugin("custom-deep-populate")?.config("defaultDepth") || 5;

      console.log("Custom Plugin: Deep populate param:", deepPopulate); // Debugging

      if (deepPopulate && deepPopulate[0] === "deep") {
        const depth = deepPopulate[1] ?? defaultDepth;
        console.log(
          `Custom Plugin: Applying deep population with depth: ${depth}`
        ); // Debugging
        const modelObject = getFullPopulateObject(event.model.uid, depth, []);
        event.params.populate = modelObject.populate;
        console.log(
          "Custom Plugin: Final populate object:",
          event.params.populate
        ); // Debugging
      }
    }
  });
};
