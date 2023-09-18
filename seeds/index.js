// IMPORTS
const mongoose = require("mongoose");
const Building = require("../models/building");
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers");

// MONGOOSE CONNECTION
mongoose.connect("mongodb://localhost:27017/design-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected")
})

// SEEDING
// make random combination to create name
const sample = array => array[Math.floor(Math.random() * array.length)];

async function getRandomImageURL() {
    // TBD - config settings can be improved by create "config" variable.
    return fetch("https://api.unsplash.com/photos/random/?client_id=m62qKMmhIeT7dZOvOXxWQtDDDUS-rmVe-W86ASxGitk&collections=3401761", { method: "GET" })
            .then(res => res.json())
            .then(res => {
                let data = res;
                return data;
            })
            .catch(err => {
                console.log(err);
            })
}

const seedDB = async() => {
    await Building.deleteMany({});
    for (let i = 0; i <50 ; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const building = new Building({
            author: "650321102eefdefb867a1afe",
            name: `${sample(descriptors)} ${sample(places)}`,
            cost: Math.floor(Math.random()*1000000),
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // async func need await to get result.
            image: await getRandomImageURL().then(data => data.urls.regular),
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis saepe quo hic quod rem quia quisquam eius expedita id pariatur quaerat maxime libero dolo, assumenda modi itaque, fugiat ab corrupti. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate corporis impedit voluptas officia nulla eaque veniam accusantium aliquid eius nam?",
            geometry:{type:"Point", coordinates:[cities[random1000].longitude, cities[random1000].latitude]},
            images: [
                {
                    url: await getRandomImageURL().then(data => data.urls.regular),
                    filename: "TBD"
                }
            ]
        });
        // IMPORTANT -> get data saved in MongoDB
        await building.save(); 
    }
}

// Execute seeding then close it
seedDB().then(() => {
    mongoose.connection.close();
})