import app from "./server.js";

import dotenv from 'dotenv'; // Import dotenv
// import { MongoClient, ServerApiVersion } from 'mongodb'; // Import with ES module syntax
import { MongoClient } from 'mongodb';


import ReviewsDAO from "./dao/reviewsDAO.js";


dotenv.config();
// Load the environment variables

// console.log("ayo, set up mongodb");

const uri = process.env.MONGO_URI;
console.log("MongoDB URI:", uri);
// Use the environment variable
// console.log("MONGO_URI:", process.env.MONGO_URI);


// checking if process.env.MONGO_URI is defined or not
if (!uri) {
    console.error("MONGO_URI environment variable is not set.");
    process.exit(1);
}


const port = 8000;

// making a client variable for further use 
let dbClient;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// run().catch(console.dir);


MongoClient.connect(
    uri, 
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        // useNewUrlParser: true
    }
)

    .catch(err => {
        console.error(err.stack);
        process.exit(1);
        
})

    .then(async client => {
        dbClient = client;
        // Inject the database client into ReviewsDAO before starting the server
        await ReviewsDAO.injectDB(client);

        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        })
    }
)


// gracefully shutdown
process.on('SIGINT', async () => {
    console.log("Shutting down gracefully...");
    await dbClient.close();
    process.exit(0);
});
