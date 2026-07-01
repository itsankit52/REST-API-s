import { config as conf } from "dotenv"
conf();


const _config = {
    port: process.env.PORT,

    databaseUrl: process.env.MONGO,

    env: process.env.NODE_ENV,

    jwtSecret: process.env.SECRET,

    cloudinaryCloud: process.env.CLOUDINARY_CLOUD,

    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,

    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

    frontendDomain: process.env.FRONTEND_DOMAIN,

}


export const config = Object.freeze(_config)