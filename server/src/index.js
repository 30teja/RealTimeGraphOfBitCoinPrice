import express from 'express';
import cors from 'cors';
import {SYS_VAR} from './utils/env.js';
import cron from 'node-cron';
import morgan from 'morgan';
import { scrapeOnce } from './utils/scrapper.js';
import { getLatest } from './utils/redis.js';
import { prices } from './utils/mongo.js';

const app=express();
app.use(cors("http://localhost:5173"));

app.use(express.json());
app.use(morgan('dev'));

cron.schedule('*/5 * * * * *', async()=>{
    try {
        await scrapeOnce();
    } catch (error) {
        console.error("Error during scheduled task:",error);
    }
})

//latest prices api(from Redis)
app.get('/latest',async(req,res)=>{
    const data=await getLatest();
    res.json(data ?? {status:'warming up'});
})

//get prices from mongodb
app.get('/prices',async(req,res)=>{
    const data=await prices.find({coin:"BTC"}).sort({ts:-1}).limit(60).toArray();
    res.json(data.reverse());
})


app.get('/health',(req,res)=>{
    res.status(200).json({status:'OK',message:'Server is healthy'});
})
app.listen(SYS_VAR.SERVER_PORT,(error)=>{
    if(error){
        console.error("Error starting server:",error);
    }else{
        console.log(`Server is running on port ${SYS_VAR.SERVER_PORT}`);
    }
})

