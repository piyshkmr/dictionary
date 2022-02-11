const express = require("express");
const path = require("path");
const requests = require("requests");
const dotenv = require("dotenv");

const port = process.env.PORT || 3000;

const app = express();

// middlewares
app.use(express.static(`${path.join(__dirname, "../public")}`));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

dotenv.config();

app.post("/", async (req, res) => {
  requests(
    `https://dictionaryapi.com/api/v3/references/learners/json/${req.body.word}?key=${process.env.API}`
  )
    .on("data", (chunk) => {
      const data = JSON.parse(chunk);

      // res.send(data)
      if (typeof data[0] === "string") {
        res.render("index", {
          list: data,
          suggestion: true,
          results: "Did you mean?",
        });
      } else {
        res.render("index", {
          def: data,
          results: data.length + " Results Found!",
        });
      }
    })
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      console.log("end");
    });
});

app.get("/:word", async (req, res) => {
  requests(
    `https://dictionaryapi.com/api/v3/references/learners/json/${req.params.word}?key=${process.env.API}`
  )
    .on("data", (chunk) => {
      const data = JSON.parse(chunk);

      // res.send(data)
      res.render("index", {
        def: data,
        results: data.length + " Results Found!",
      });
    })
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      console.log("end");
    });
});

app.listen(port, () => {
  console.log("running..");
});
