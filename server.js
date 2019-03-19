var express = require("express"),
  bodyParser = require("body-parser"),
  axios = require("axios"),
  http = require("http"),
  cors = require("cors");

// Init
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 4000;

// Listen
app.listen(() => {
  console.log("--- DataViz Sport - ExpressJS Server ---");
  console.log("Listening on http://localhost:" + port);
});

// GET /
app.get("/", function(req, res) {
  res.send("hello world");
});
