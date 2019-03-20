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
  console.log("[IN] 200: /");
  res.send("<a href='/request'>request</a>");
});

// GET ./request
app.get("/api/keyword/:keyword", function(req, res) {
  console.log("[IN] 200: /request");
  
  // Requete
  articles("trump").then(result => {
    res.send(result);
  });
});

// ----------------------
// ---- HTTP Request ----
//-----------------------
// Domaine
let DOMAIN_URL = "https://api.ozae.com";
let API_KEY = "6c87c95a1fcc4d76bfa6d77cb5cb4d77";

// Recherche par country
articles = async keyword => {
  var url_to = `${DOMAIN_URL}/gnw/articles?query=${keyword}&key=${API_KEY}&hours=6`;

  try {
    let res = await axios({
      url: url_to,
      method: "get",
      timeout: 100000,
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status == 200) console.log("[OUT] " + res.status + ` : ${url_to}`);
    return res.data;
  } catch (error) {
    console.error(`[OUT] : ERROR at "${url_to}" - ` + error);
  }
};
