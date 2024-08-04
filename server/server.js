const express = require('express');
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieparser = require("cookie-parser");

app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true,
}));

dotenv.config({
    path: "./.env",
});

const route = require("./routes/InfoRoute.routes.js");

app.use('/api/v1', route);

app.listen(8080, () => {
    console.log("listening on", 8080);
});

app.on("error", (error) => {
    console.error('server running error', error);
});
