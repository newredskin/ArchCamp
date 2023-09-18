// IMPORTS
const mongoose = require("mongoose");
const Review = require("./review");

// https://res.cloudinary.com/dm8wm8xmx/image/upload/ar_1.0,c_thumb,w_100,z_1/DesignCamp/x4wurq0zchx6oyviaprg.jpg
// https://res.cloudinary.com/dm8wm8xmx/image/upload/v1694804929/DesignCamp/x4wurq0zchx6oyviaprg.jpg'


// VARIABLES
const Schema = mongoose.Schema;

// MODELS
const imageSchema = new Schema({
    url: String,
    filename: String
});

// Add "thumbnail" virtual property! The reason to use virtual property here is No Need to store it in database.
imageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/ar_1.0,c_thumb,w_100,z_1")
}); 


// Get the virtual properties included in the JSON convert
const opts = { toJSON: { virtuals: true }};

const buildingSchema = new Schema({
    name: String,
    images: [imageSchema], //nested imageSchema with virtual property for thumbnails.
    geometry: { //geodata should follow format below - from MongoDB...
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    cost: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);

// Add "properties" virtual property for cluster map popText
buildingSchema.virtual("properties.popUpMarkUp").get(function() {
    return `
        <strong><a href="/buildings/${this._id}">${this.name}</a></strong>
        <p>${this.description.substring(0, 100)}...</p>
    
    `
});


// Query Middleware to be used for deletion. Need figure it out Later!!!
buildingSchema.post("findOneAndDelete", async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews // $in -> something IN dataset
            }
        })
    }
})


// EXPORT FOR OTHER FILES' USE
module.exports = mongoose.model("Building", buildingSchema);