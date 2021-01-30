const express = require("express");

// running our mongoose file to ensure DB connection
require("./db/mongoose");

const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const PORT = process.env.P0RT || 3000;

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
