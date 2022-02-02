import http from 'http';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';

const router = express();

// sever handling
const httpServer = http.createServer(router);

// connect to firebase admin
let serviceAccount = require('./config/serviceAccountKey.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

// connect to mongodb
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(() => {
        logging.info('Connected to mongodb');
    })
    .catch((err) => {
        logging.error('Error connecting to mongodb', err);
    });

// logging middleware
router.use((req, res, next) => {
    logging.info(`METHOD: '${req.method}' - URL: '${req.url}' - IP: '${req.socket.remoteAddress}'`);

    res.on('finish', () => {
        logging.info(`METHOD: "${req.method}" - URL: '${req.url}' - IP: '${req.socket.remoteAddress}' - STATUS: '${res.statusCode}'`);
    });

    next();
});

//   parse the body of the request
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Api access policies
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// routes

// error handling

router.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

// listen to the server
httpServer.listen(config.server.port, () => {
    logging.info(`Server is running ${config.server.host}:${config.server.port}...`);
});
