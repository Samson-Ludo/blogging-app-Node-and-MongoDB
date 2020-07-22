const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");

require("dotenv").config();
// Port
const port = 3000;
// init app
const app = express();

// import routes
const index = require("./routes/index");
const articles = require("./routes/articles");
const categories = require("./routes/categories");
const manage = require("./routes/manage");

// View Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Moment

app.locals.moment = require("moment");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Express messages
app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Express validator
app.use(
  expressValidator({
    errorFormatter: (param, msg, value) => {
      const namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

// MongoDB

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use("/", index);
app.use("/articles", articles);
app.use("/categories", categories);
app.use("/manage", manage);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
