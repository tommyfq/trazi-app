require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

// parse various different custom JSON types as JSON
// app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
// app.use(bodyParser.text({ type: 'text/html' }))

app.use(bodyParser.text({ type: 'text/plain' }));
//app.use(express.json())

const db = require("./app/models");

console.log(db.url);

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to trazi application." });
});

require("./app/routes/turorial.routes")(app);
require("./app/routes/population.routes")(app);

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
