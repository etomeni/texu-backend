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

export const setUploadedVideosCtr = async (req, res, next) => {
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
            const uploadedVideosDetails = {
                title: req.body.title,
                video_thumbnail: req.body.video_thumbnail,
                video_file: req.body.video_file,
                video_category: req.body.video_category,
                uploader_username: req.body.uploader_username,
                uploader_email: req.body.uploader_email,
                date_uploaded: req.body.date_uploaded,

                createdAt: general.getCurrentDateTime(),
                updatedAt: general.getCurrentDateTime()
            };
            const result = await crud.save2FirestoreDB("uploadedVideos", uploadedVideosDetails);

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable to save uploaded video!'
                });
            }
            
            return res.status(201).json({
                status: 201,
                id: result.id,
                message: 'Upload successfully!'
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

export const getUploadedVideosCtr = async (req, res, next) => {
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
            const result = await crud.getOrderedServiceData("uploadedVideos");

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable get saved videos!'
                });
            }

            // this line removes all the lastVisible property from the array of object
            const newResult = result.map(({lastVisible, ...rest}) => rest);
            
            return res.status(201).json({
                status: 201,
                data: newResult,
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


export const setPostLikesCtr = async (req, res, next) => {
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
            const postLikesDetails = {
                uploader_username: req.body.uploader_username,
                title: req.body.title,
                like_count: req.body.like_count,
                createdAt: general.getCurrentDateTime(),
                updatedAt: general.getCurrentDateTime()
            };
            const result = await crud.save2FirestoreDB("postLikes", postLikesDetails);

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable to save post likes!'
                });
            }
            
            return res.status(201).json({
                status: 201,
                id: result.id,
                message: 'successful!'
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

export const getPostLikesCtr = async (req, res, next) => {
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
            const result = await crud.getOrderedServiceData("postLikes");

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable get post likes!'
                });
            }

            // this line removes all the lastVisible property from the array of object
            const newResult = result.map(({lastVisible, ...rest}) => rest);
            
            return res.status(201).json({
                status: 201,
                data: newResult,
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

export const getPostCommentsCtr = async (req, res, next) => {
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
            const postCommentsDetails = {
                uploader_username: req.body.uploader_username,
                title: req.body.title,
                like_count: req.body.like_count,
                createdAt: general.getCurrentDateTime(),
                updatedAt: general.getCurrentDateTime()
            };
            const result = await crud.save2FirestoreDB("postComments", postCommentsDetails);

            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable to save post comments!'
                });
            }
            
            return res.status(201).json({
                status: 201,
                id: result.id,
                message: 'successful!'
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

export const setPostCommentsCtr = async (req, res, next) => {
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
            const result = await crud.getOrderedServiceData("postComments");
            
            if (!result) {
                return res.status(202).json({
                    status: 202,
                    // userID: userDetails.userID,
                    message: 'unable to get post comments!'
                });
            }

            // this line removes all the lastVisible property from the array of object
            const newResult = result.map(({lastVisible, ...rest}) => rest);
            
            return res.status(201).json({
                status: 201,
                data: newResult,
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
