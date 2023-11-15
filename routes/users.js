import express from 'express';
import { body } from 'express-validator';
import bodyParser from 'body-parser';

import https from 'https';
// import http from 'http';

import nodemailer from 'nodemailer';

// import { v4 as uuidv4 } from 'uuid';
// uuidv4();

// Models
import { auth, crud, general } from '../models/firebase.js';

const router = express.Router();

// Controllers
import { 
    saveLiveTvChannelsCtr,
    getLiveTvChannelsCtr
} from '../controllers/usersCtrl.js';

// middleWares
import authMiddleware from './../middleware/auth.js';

router.use(bodyParser.json());


// save live TV channels
router.post(
    '/saveLiveTvChannels',
    [
        // authMiddleware,
        body('channel_name').trim().not().isEmpty(),
        body('category').trim().not().isEmpty(),
        body('thumbnail').trim().not().isEmpty(),
        body('channel_link').trim().not().isEmpty(),
        body('uploader_username').trim().not().isEmpty(),
        body('uploader_email').trim().not().isEmpty(),
    ],
    saveLiveTvChannelsCtr
);

// get live TV channels
router.post(
    '/getLiveTvChannels',
    // authMiddleware,
    getLiveTvChannelsCtr
);


// // get all services from the provider
// router.post(
//     '/',
//     (req, res) => {
//         return res.status(200).json({
//             message: "api is working!",
//             statusCode: 200,
//             hostname: req.hostname,
//         });
//     }
// );

// // get user details
// router.post(
//     '/user',
//     authMiddleware,
//     getUserCtr
// );

// // place new order
// router.post(
//     '/placeOrder',
//     [
//         authMiddleware,
//         body('userID').trim().not().isEmpty(),
//         body('serviceDBid').isNumeric().not().isEmpty(),
//         body('serviceID').not().isEmpty(),

//         body('type').trim().not().isEmpty(),

//         body('maxOrder').isNumeric().not().isEmpty(),
//         body('minOrder').isNumeric().not().isEmpty(),

//         body('serviceName').trim().not().isEmpty(),
//         body('quantity').isNumeric().not().isEmpty(),
//         body('link').trim().not().isEmpty(),

//         body('amount').isNumeric().not().isEmpty(),
//         body('costAmount').isNumeric().not().isEmpty(),
//         body('profit').isNumeric().not().isEmpty()
//     ],
//     placeOrderCtr
// );


// // get User's Ticket
// router.post(
//     '/getUserTicket',
//     authMiddleware,
//     getUserTicketCtr
// );

// // new Ticket Message
// router.post(
//     '/newTicketMessage',
//     [
//         authMiddleware,
//         body('message').trim().not().isEmpty()
//     ],
//     newTicketMessageCtr
// );

// // get User's Ticket Message
// router.post(
//     '/getUserTicketMessage',
//     authMiddleware,
//     getUserTicketMessageCtr
// );

// // generate a New Api Key
// router.post(
//     '/generateNewApiKey',
//     authMiddleware,
//     generateNewApiKeyCtr
// );

// // add funds
// router.post(
//     '/addFunds',
//     authMiddleware,
//     addFundsCtr
// );

export default router;