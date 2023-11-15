import { validationResult } from "express-validator";
// import nodemailer from 'nodemailer';
// import axios from "axios";

// models
import { crud, general } from "../models/firebase.js";


export const saveLiveTvChannelsCtr = async (req, res, next) => {
    try {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({
                    status: 500,
                    message: 'Sent Data Error!', 
                    errors
                });
            };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            error.msg = "sent data validation error";
            next(error);
        }

        try {
            const liveTvChannelsDetails = {
                channel_name: req.body.channel_name,
                category: req.body.category,
                thumbnail: req.body.thumbnail,
                channel_link: req.body.channel_link,
                uploader_username: req.body.uploader_username,
                uploader_email: req.body.uploader_email,

                createdAt: general.getCurrentDateTime(),
                updatedAt: general.getCurrentDateTime()
            };
            // const result = await auth.save(userDetails);
            const result = await crud.save2FirestoreDB("liveTvChannels", liveTvChannelsDetails);

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable add a new live TV channels!'
                });
            }
            
            return res.status(201).json({
                status: 201,
                id: result.id,
                message: 'New live TV channels was added successfully!'
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "an error occured!",
                error
            });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.msg = "unknown error!!!";
        next(error);
    }
}

export const getLiveTvChannelsCtr = async (req, res, next) => {
    try {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json({
                    status: 500,
                    message: 'Sent Data Error!', 
                    errors
                });
            };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            error.msg = "sent data validation error";
            next(error);
        }

        try {
            const result = await crud.getOrderedServiceData("liveTvChannels");

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable get all live TV channels!'
                });
            }
            
            return res.status(201).json({
                status: 201,
                data: result,
                message: 'successfully!'
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "an error occured!",
                error
            });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        error.msg = "unknown error!!!";
        next(error);
    }
}