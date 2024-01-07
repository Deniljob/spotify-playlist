const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST",
  })
);

app.use(express.json());

const authenticationRoute = require("./routes/authenticationRoute");

const functionalityRoutes = require("./routes/functionalityRoutes");

app.use("/", authenticationRoute);

app.use("/api/", functionalityRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
