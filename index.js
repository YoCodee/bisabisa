import express from "express";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/AuthRoute.js";
import userRoutes from "./routes/UserRoute.js"
import PackageRoute from "./routes/PackageRoute.js"
import PostRoute from "./routes/PostRoute.js";
import BookingRoute from "./routes/BookingRoute.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import SequelizeStore from "connect-session-sequelize"
import PrismaSessionStore from './Store/PrismaSessionStore.js';

dotenv.config();

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

// Inisialisasi aplikasi Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware untuk parsing JSON
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(),
    cookie: { maxAge: 60 * 60 * 1000 } // Session expiry in milliseconds (1 hour)
  })
);
// Gunakan rute untuk autentikasi
app.use(authRoutes);
app.use(userRoutes);
app.use(PostRoute);
app.use(PackageRoute)
app.use(BookingRoute)


// Middleware untuk menangani error 404
app.use((req, res, next) => {
  res.status(404).json({ msg: "Rute tidak ditemukan" });
});

// Middleware untuk menangani error lainnya
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Terjadi kesalahan pada server" });
});

// Inisialisasi server

app.listen(5000, () => {
  console.log(`Server running on port `);
});
