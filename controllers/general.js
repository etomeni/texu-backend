import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import nodemailer from 'nodemailer';
import axios from "axios";

// models
// import { general } from '../models/general.js';
// import { services } from '../models/services.js';
// import { user, auth } from '../models/users.js';
// import { admin } from '../models/admin.js';
import { auth } from "../models/firebase.js";


// get the data dashboard needed data
export const getSite_and_SeoDataCtr = async (req, res, next) => {
    const sentData = req.body.hostname;

    try {
        let siteData = await general.getSiteData(sentData);
        siteData = siteData[0][0];
        // console.log(siteData);
        // siteData = siteData[0];
        // console.log(siteData);

        let seoData = await general.getSeoData(sentData);
        seoData = seoData[0][0];
        // seoData = seoData[0];
        // console.log(seoData);
        
        return res.status(201).json({
            status: 201,
            result: { 
                siteData,
                seoData
            },
            message: 'successfully!'
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// add New WebSite controller
export const addNew_WebSiteCtr = async (req, res, next) => {
    try {
        const siteDataReceived = req.body.site;
        const seoDataReceived = req.body.seo;

        // authenticate the admin adding the new site
        // gets all the registered admins

        let admins = await auth.find('white');
        admins = admins[0];
        if (admins.length !== 1) {
            const error = new Error('No registered admin user to authenticate this registration!');
            error.statusCode = 401;
            error.message = 'No registered admin user to authenticate this registration!';

            return res.status(401).json({
                error,
                statusCode: error.statusCode,
                msg: error.message
            });
        };

        // authenticate their passwords with the one supplied;
        const isPassEqual = await bcryptjs.compare(siteDataReceived.password, admins[0].password);

        if (!isPassEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            error.message = 'Wrong password!';

            return res.status(401).json({
                error,
                statusCode: error.statusCode,
                msg: error.message
            });
        };
        // authenticate ends here
    
        let siteData = await general.addNewWebSite(siteDataReceived);
        // console.log(siteData);
        
        seoDataReceived.site_id = siteData[0].insertId;
        let seoData = await general.addNewWebSite_seo(seoDataReceived);
        // console.log(seoData);
        
        return res.status(201).json({
            status: 201,
            result: { 
                siteData: siteData[0],
                seoData: seoData[0]
            },
            message: 'successfully!'
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}