const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
connectDb();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.send("Test route works");
});

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
