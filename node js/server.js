const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express(); // הגדרת app חייבת להיות לפני השימוש בו

app.use(cors());
app.options("*", cors()); // טיפול בבקשות OPTIONS לכל הנתיבים
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// חיבור למסד הנתונים
const dbPass = process.env.DB_PASS;
mongoose
    .connect(dbPass)
    .then(() => console.log("Connected…"))
    .catch((err) => console.log(err));

// הגדרת ה-Routes
const accessoryRouter = require("./Routers/AccessoryRouter");
const orderRouter = require("./Routers/OrderRouter");
const photographyRouter = require("./Routers/PhotographyRouter");
const rentRouter = require("./Routers/RentRouter");
const renterRouter = require("./Routers/RenterRouter");
const userRouter = require("./Routers/UserRouter");
const systemRouter = require("./Routers/SystemRouter");

app.use("/Accessory", accessoryRouter);
app.use("/Order", orderRouter);
app.use("/Photography", photographyRouter);
app.use("/Rent", rentRouter);
app.use("/Renter", renterRouter);
app.use("/User", userRouter);
app.use("/System", systemRouter);
app.use("/uploads", express.static("uploads"));

// הפעלת השרת
app.listen(8080, () => {
    console.log("run...");
});