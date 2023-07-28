import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import prismaClient from './database.js';

import morganMiddleware from '../middlewares/morgan-middleware.js';
import errorMiddleware from '../middlewares/error-middleware.js';

import authRoute from '../routes/auth-route.js';
import userRoute from '../routes/user-route.js';
import referensiHargaRoute from '../routes/referensi-harga-route.js';
import kontrakRoute from '../routes/kontrak-route.js';
import deliveryOrderRoute from '../routes/delivery-order-route.js';
import transaksiRoute from '../routes/transaksi-route.js';

dotenv.config();

const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL || 'http://localhost:3000';
const SESSION_SECRET = process.env.SESSION_SECRET || '$SeSsIoN-sEcReT$';
const store = new PrismaSessionStore(prismaClient, {
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const web = express();
web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: 'auto',
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: store,
  })
);
web.use(
  cors({
    credentials: true,
    origin: FRONTEND_APP_URL,
  })
);

web.use(morganMiddleware);

web.use(authRoute);
web.use(userRoute);
web.use(referensiHargaRoute);
web.use(kontrakRoute);
web.use(deliveryOrderRoute);
web.use(transaksiRoute);

web.use(errorMiddleware);

export default web;
