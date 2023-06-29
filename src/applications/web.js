import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import prismaClient from "./database.js";
import morganMiddleware from "../middlewares/morgan-middleware.js";

dotenv.config();

const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL || 'http://localhost:3000';
const SESSION_SECRET = process.env.SESSION_SECRET || '$SeSsIoN-sEcReT$';
const store = new PrismaSessionStore(
    prismaClient,
    {
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }
)

const web = express();
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: 'auto',
        maxAge: 1000 * 60 * 60 * 24,
    },
    store: store
}));
web.use(cors({
    credentials: true,
    origin: FRONTEND_APP_URL
}));
web.use(morganMiddleware);

export default web;