import { prices } from "./mongo.js";
import { fetcgBTC } from "./priceSource.js";
import { setLatestData } from "./redis.js";
export async function scrapeOnce() {
    try {
        const data=await fetcgBTC();
        await prices.insertOne(data);
        await setLatestData(data);
        console.log(`${data.ts.toISOString()}: Fetched BTC price: $${data.price}`);
    } catch (error) {
        if(error.response.this.status===429){
            console.warn("Rate limit exceeded. Waiting before retrying...");
        }else{
            throw error;
        }
    }
}