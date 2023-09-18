// IMPORT MODEL
const Building = require("../models/building");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken});

const { cloudinary } = require("../cloudinary");



// CONTROLLERS
module.exports.index = async (req, res) => {
    const buildings = await Building.find({});
    res.render("buildings/index.ejs", { buildings })
}


module.exports.renderNewForm = async (req, res) => {
    res.render("buildings/new.ejs");
}

module.exports.createBuilding = async(req, res, next) => {
    // geocoding w/ proximity
    const geoData = await geocoder.forwardGeocode({
            query: req.body.building.location,
            limit: 1
        }).send(); //don't forget!
    
    const building = new Building(req.body.building);
    building.geometry = geoData.body.features[0].geometry;
    building.author = req.user._id; //save the user id to the author when registering
    building.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    })) // get url and filename saved to building. .map returns a new array.
    await building.save();
    req.flash("success", "Successuflly created a new building");
    res.redirect(`/buildings/${building._id}`);
}


module.exports.showBuilding = async (req, res) => {
    const building = await Building.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("author"); // Use nested .populate() to get full review data
    if (!building) {
        req.flash("error", "Sorry cannot find the building");
        return res.redirect("/buildings"); //return the redirect page here so the below render is not executed.
    }
    res.render("buildings/show.ejs", { building });
}


module.exports.renderEditForm = async (req, res) => {
    const building = await Building.findById(req.params.id);
    if (!building) {
        req.flash("error", "Sorry cannot find the building");
        return res.redirect("/buildings"); //return the redirect page here so the below render is not executed.
    }
    res.render("buildings/edit.ejs", { building })
}

module.exports.editBuilding = async (req, res) => {
    // req.params contains only id -> cannot use const { id } = req.params.id
    const { id } = req.params;
    console.log(req.body);
    // Use ... to spread out all fields to be updated
    // The 3rd param {new: true} will let the updated page be shown, otherwise only shows the old one
    const building = await Building.findByIdAndUpdate(id,{...req.body.building}, {new: true});
    const images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    building.images.push(...images) 
    // get url and filename pushed (NOT replace) to building. .map returns a new array. Spread the images array into single elements so can pass joi validation -> images[] NOT images[[]]
    await building.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // below is like: Oh... $pull -> "delete"
        await building.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash("success", "Successuflly updated the building");
    res.redirect(`/buildings/${building._id}`);
}


module.exports.deleteBuilding = async (req, res) => {
    const { id } = req.params;
    const building = await Building.findByIdAndDelete(id);
    req.flash("success", "Successuflly delete the building!");
    res.redirect("/buildings");
}