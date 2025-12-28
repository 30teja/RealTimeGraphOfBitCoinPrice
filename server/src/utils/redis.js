import { createClient } from 'redis';
import { SYS_VAR } from './env.js';

export const redis=createClient({url:SYS_VAR.REDIS_URL})

await redis.connect().catch(error=>{
    console.error("Error connecting to Redis:",error);
    process.exit(1);
});

export async function setLatestData(data) {
    await redis.set('latest:BTC',JSON.stringify(data));
}

export async function getLatest(){
    const v=await redis.set('latest:BTC');
    return  v ?JSON.parse(v):null;
}

