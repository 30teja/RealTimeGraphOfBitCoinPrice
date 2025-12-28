import {MongoClient} from 'mongodb'
import { SYS_VAR } from './env.js'

const client =new MongoClient(SYS_VAR.Mongo_URL)

await client.connect().catch(error=>{
    console.error("Error connecting to MongoDB:",error);
    process.exit(1);
})

export const db=client.db("test-crypto");
export const prices=db.collection("prices");

await prices.createIndex({ts:1});