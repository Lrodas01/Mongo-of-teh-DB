const mongoose = require('mongoose'); //dependencies we need to use schema and to send data

const schema = new mongoose.Schema(
    {
        user: {type: String, default: ""},
        name: {type: String, default: ""},
        birthday: {type: String, default: ""},
    },
    {
        timestamps: {
                createdAt: "createdOn",
                updatedAt: "updatedOn"
        },
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);   //a template for the data thats being stored in mongodb cluster

const ProfileModel = mongoose.model('profiles', schema)
module.exports = ProfileModel; // export this module so that we can import it to the other components