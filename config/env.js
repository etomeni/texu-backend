import dotenv from 'dotenv';
// Load environment variables from the .env file
dotenv.config();

const envData = {
    secretForToken: process.env.SECRET_FOR_TOKEN,
}

export default envData;