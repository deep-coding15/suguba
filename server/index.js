import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDb.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/myList.route.js";
import addressRouter from "./route/address.route.js";
import passport from "./config/passport.js";
import reviewRouter from "./route/reviews.route.js";
import sellerRouter from "./route/seller.route.js";
import orderRouter from "./route/order.route.js";
import newsletterRouter from "./route/newsletter.route.js";
import homeSliderRouter from "./route/homeSlider.route.js";
import hubRouter from "./route/hub.route.js";
import supportRouter from "./route/support.route.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));

app.get("/", (req, res) => {
  res.json({ message: "serveur en marche " + process.env.PORT });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/homeslider", homeSliderRouter);
app.use("/api/hubs", hubRouter);
app.use("/api/support", supportRouter);
app.use(passport.initialize());
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("serveur en marche", process.env.PORT);
  });
});





{/*import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDb.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/myList.route.js";
import addressRouter from "./route/address.route.js";
import passport from "./config/passport.js";
import reviewRouter from "./route/reviews.route.js";
import sellerRouter from "./route/seller.route.js";
import orderRouter from "./route/order.route.js";
import newsletterRouter from "./route/newsletter.route.js";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "serveur en marche " + process.env.PORT,
  });
});
app.use("/api/user",userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/myList",myListRouter)
app.use("/api/address",addressRouter)
app.use("/api/reviews", reviewRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/newsletter", newsletterRouter);


app.use(passport.initialize());
connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("serveur en marche",process.env.PORT);
    })
})*/}