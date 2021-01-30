const express = require("express");

const app = express();

const PORT = process.env.P0RT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
  console.log({ req });
  res.send("Testing!");
});

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
