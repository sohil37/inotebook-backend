const express = require("express");
const connectToMongoDB = require("./db");

connectToMongoDB();

const app = express();
const port = 5000;

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/note"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
