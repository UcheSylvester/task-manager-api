const express = require("express");

// running our mongoose file to ensure DB connection
require("./db/mongoose");
const multer = require("multer");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const PORT = process.env.P0RT || 3000;
const app = express();

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1_000_000,
  },

  fileFilter(req, file, cb) {
    const { originalname } = file;
    if (!originalname.match(/\.(doc|docx)$/))
      return cb(new Error("Please upload a word file"));

    cb(undefined, true);
  },
});

app.post("/uploads", upload.single("upload"), (req, res) => {
  res.send();
});

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
