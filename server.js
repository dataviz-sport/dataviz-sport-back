// Import
var express = require("express"),
  bodyParser = require("body-parser"),
  axios = require("axios"),
  http = require("http"),
  cors = require("cors"),
  mcache = require("memory-cache");

// Init
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 4000;

// Cache
var cacheNGram = duration => {
  return (req, res, next) => {
    let key =
      "__dataviz__" +
      (req.originalUrl || req.url) +
      (req.params.details != null ? req.params.details : "");
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

var cacheSearch = duration => {
  return (req, res, next) => {
    let key =
      "__dataviz__" +
      (req.originalUrl || req.url) +
      (req.params.keyword != null ? req.params.keyword : "") +
      (req.params.edition != null ? req.params.edition : "");
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

var cacheTrends = duration => {
  return (req, res, next) => {
    let key =
      "__dataviz__" +
      (req.originalUrl || req.url) +
      (req.params.keyword != null ? req.params.keyword : "");
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Listen
app.listen(port, () => {
  console.log("--- DataViz Sport - ExpressJS Server ---");
  console.log("Listening on http://localhost:" + port);
});

// ------------------------------------------------------------------
// ------------------------------ API  ------------------------------
// ------------------------------------------------------------------

// ----- GET ./ -----
app.get("/", (req, res) => {
  console.log("[IN] 200: /");
  res.send("API DataVizSport");
});

// ----- GET ./search -----
app.get(
  "/search/keyword/:keyword/edition/:edition",
  cacheSearch(3600),
  (req, res) => {
    console.log(
      `[IN] 200: /search ${req.params.keyword} ${req.params.edition}`
    );

    var keywordParams, editionParams;
    if (req.params.keyword == "" || req.params.keyword == null)
      keywordParams = "";
    else keywordParams = req.params.keyword;
    if (req.params.edition == "" || req.params.edition == null)
      editionParams = "fr-fr";
    else editionParams = req.params.edition;

    search(keywordParams, editionParams).then(result => {
      res.send(result);
    });
  }
);

// ----- GET ./ngrams -----
app.get("/ngrams/details/:details", cacheNGram(3600), (req, res) => {
  console.log(`[IN] 200: /ngrams ${req.params.details}`);
  var detailsParams = "";
  if (req.params.details == "" || req.params.details == null)
    detailsParams = "";
  else detailsParams = req.params.details;

  ngrams(detailsParams).then(result => {
    res.send(result);
  });
});

// ----- GET ./api/trends -----
app.get("/trends/keyword/:keyword", cacheTrends(3600), (req, res) => {
  console.log(`[IN] 200: /trends ${req.params.keyword}`);
  var keywordParams = "";
  if (req.params.keyword == "" || req.params.keyword == null)
    keywordParams = "";
  else keywordParams = req.params.keyword;
  trends(keywordParams).then(results => {
    res.send(results);
  });
});

// ------------------------------------------------------------------
// -------------------------- HTTP Request --------------------------
// ------------------------------------------------------------------

// Init domaine & key
let DOMAIN_URL = "https://api.ozae.com";
let API_KEY = "6c87c95a1fcc4d76bfa6d77cb5cb4d77";

// ----- Recherche mot clé -----
search = async (keyword, edition) => {
  var url_to = `${DOMAIN_URL}/gnw/articles?query=${keyword}&key=${API_KEY}&edition=${edition}&hours=3&topic=s`;

  try {
    let res = await axios({
      url: url_to,
      method: "get",
      timeout: 200000,
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status == 200) console.log("[OUT] " + res.status + ` : ${url_to}`);
    return res.data;
  } catch (error) {
    console.error(`[OUT] : ERROR at "${url_to}" - ` + error);
    return { error: "timeout" };
  }
};

// ----- Recherche 30 ngrams France -----
ngrams = async bool_details => {
  var url_to = `${DOMAIN_URL}/gnw/ngrams?key=${API_KEY}&hours=3&topic=s&hide_details=${bool_details}&limit=30`;

  try {
    let res = await axios({
      url: url_to,
      method: "get",
      timeout: 200000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.status == 200) console.log("[OUT] " + res.status + ` : ${url_to}`);
    return res.data;
  } catch (error) {
    console.error(`[OUT] : ERROR at "${url_to}" - ` + error);
    return { error: "timeout" };
  }
};

// ----- Tendances sportives -----
trends = async keyword => {
  let url_to = `${DOMAIN_URL}/gnw/articles?key=${API_KEY}&hours=2&topic=s&query=${keyword}`;

  options = {
    fr: {
      url: url_to + "&edition=fr-fr",
      method: "get",
      timeout: 200000,
      headers: { "Content-Type": "application/json" }
    },
    it: {
      url: url_to + "&edition=it-it",
      method: "get",
      timeout: 200000,
      headers: { "Content-Type": "application/json" }
    },
    de: {
      url: url_to + "&edition=de-de",
      method: "get",
      timeout: 200000,
      headers: { "Content-Type": "application/json" }
    },
    uk: {
      url: url_to + "&edition=en-gb",
      method: "get",
      timeout: 200000,
      headers: { "Content-Type": "application/json" }
    },
    es: {
      url: url_to + "&edition=es-es",
      method: "get",
      timeout: 200000,
      headers: { "Content-Type": "application/json" }
    },
    us: {
      url: url_to + "&edition=en-us-ny",
      method: "get",
      timeout: 200000,
      headers: { "Content-Type": "application/json" }
    }
  };

  return await axios
    .all([
      axios.request(options.fr),
      axios.request(options.it),
      axios.request(options.de),
      axios.request(options.uk),
      axios.request(options.es),
      axios.request(options.us)
    ])
    .then(
      axios.spread(function(res_fr, res_it, res_de, res_uk, res_es, res_us) {
        return {
          fr: res_fr.data,
          it: res_it.data,
          de: res_de.data,
          uk: res_uk.data,
          es: res_es.data,
          us: res_us.data
        };
      })
    )
    .catch(error => {
      console.error(`[OUT] : ERROR at "${url_to}" - ` + error);
      return { error: "timeout" };
    });
};

// ------------------------------------------------------------------
// -------------------------- Utils ---------------------------------
// ------------------------------------------------------------------
getTranslation = keyword => {
  switch (keyword) {
    case "football":
      return {
        fr: "football",
        it: "calcio",
        de: "fussball",
        uk: "football",
        es: "futbol",
        us: "soccer"
      };
    case "basketball":
      return {
        fr: "basketball",
        it: "pallacanestro",
        de: "basketball",
        uk: "basketball",
        es: "baloncesto",
        us: "basket"
      };
    case "tennis":
      return {
        fr: "tennis",
        it: "tennis",
        de: "tennis",
        uk: "tennis",
        es: "tenis",
        us: "tennis"
      };
  }
};
