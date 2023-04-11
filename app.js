const express = require("express");
const connectToMongoDB = require("./db");
const cors = require("cors");
connectToMongoDB();

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/note"));

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`);
});
