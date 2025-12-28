import dotenv from 'dotenv';
dotenv.config();

export const SYS_VAR={
    SERVER_PORT: process.env.PORT||5678,
    Mongo_URL:process.env.Mongo_URI,
   REDIS_URL:process.env.REDIS_URI
}