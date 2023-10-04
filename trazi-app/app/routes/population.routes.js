module.exports = app => {
    const populations = require("../controllers/population.controller.js");

    var router = require("express").Router();
  
    // Retrieve a single Tutorial with id
    router.get("/city/:city/state/:state", populations.get);

    // Retrieve a single Tutorial with id
    router.put("/city/:city/state/:state", populations.create);
  
    app.use("/api/population", router);

  };
  