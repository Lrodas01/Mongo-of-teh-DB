require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ProfileModel = require('./profile');
const { MongoClient } = require('mongodb');

const app = express()
const port = process.env.PORT;
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);

// set up middleware, basically acting as a bridge betweeen os/database and applications, on a network 
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => {console.log('Successfully connected to Mongo DB')}, err => {console.log(`Something went wrong when connecting to DB ${err}`)});

// routes
app.get('/', (req, res) => res.status(200).send('Server is Running :)'));

app.get('/get-profiles', (req, res) => {
    async function run() {
    try {
        const database = client.db("UserInfo"); 
        const profiles = database.collection("Profiles"); 
        const result = await profiles.find().toArray(); 
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
    };
    }
    run().catch(console.dir);
});


app.delete('/delete-profiles', (req, res) => {
    async function run () {
        try {
        const database = client.db ("UserInfo");
        const profiles = database.collections("Profiles");
        const result = await profiles.deleteOne();
        if (result.deletedCount === 1) {
            res.status(200).send({
                message: 'Document has been succesfully deleted.'
            });
        } else {
            res.status (200).send({
                message: 'No document matched the query. Deleted 0 documents.'
            });
        }
    } catch (err) {
        console.log(err)
    }
}
   run().catch(console.dir);
}
);


app.post('/add-profile', (req, res) => {
    const incomingData = req.body;

    try{
        const newProfile = new ProfileModel(incomingData);
        newProfile.save();

        res.status(200).send({
            message: 'saved profile'
        });
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
