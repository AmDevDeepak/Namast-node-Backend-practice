const express = require("express");
const connectToDatabase = require("./config/database.config.js");
const config = require("./config/server.config.js");
const cookieParser = require("cookie-parser");
const { PORT } = config;
const authRouter = require("./routes/auth.routes.js");
const userRouter = require("./routes/user.routes.js");
const profileRouter = require("./routes/profile.routes.js");
const requestRouter = require("./routes/request.routes.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log("Server started successfully...");
  });
});
