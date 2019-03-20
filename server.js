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
app.listen(port, () => {
  console.log("--- DataViz Sport - ExpressJS Server ---");
  console.log("Listening on http://localhost:" + port);
});

// ----------------------
// ---- API EXPOSURE ----
//-----------------------
// GET ./
app.get("/", function(req, res) {
  console.log("200: /");
  res.send("<a href='/request'>request</a>");
});

// GET ./request
app.get("/request", function(req, res) {
  console.log("[IN] 200: /request");
  articles().then(result => {
    res.send(result);
  });
});

// ----------------------
// ---- HTTP Request ----
//-----------------------
// Domaine
let DOMAIN_URL = "https://api.ozae.com";

// Récupération des articles
articles = async () => {
  var url_to = `${DOMAIN_URL}/gnw/articles?query=trump&key=6c87c95a1fcc4d76bfa6d77cb5cb4d77&date=20180601__20180630`;

  try {
    let res = await axios({
      url: url_to,
      method: "get",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status == 200) console.log("[OUT] Http Request: " + res.status);
    return res.data;
  } catch (error) {
    console.error("[OUT] Http Request: " + res.status + " - " + error);
  }
};
