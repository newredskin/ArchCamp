// MODULES
const express = require("express");
const multer  = require('multer');
const { storage } = require("../cloudinary") // No need specify index.js 'cause Node will search index first
const upload = multer({storage});

const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, isAuthor, validateBuilding } = require("../middleware"); //use destructure to import individual middleware from the overall middlewares

const buildingController = require("../controllers/buildings");

const router = express.Router();



// ROUTES
router.route("/")
    .get(catchAsync(buildingController.index))
    .post(isLoggedIn, upload.array("image"), validateBuilding, catchAsync(buildingController.createBuilding)); // Multer use upload to add file info to req.body, name in input html is "image"


router.get("/new", isLoggedIn, catchAsync(buildingController.renderNewForm));

router.route("/:id")
    .get(catchAsync(buildingController.showBuilding))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateBuilding, catchAsync(buildingController.editBuilding))
    .delete(isLoggedIn, isAuthor, catchAsync(buildingController.deleteBuilding));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(buildingController.renderEditForm));


// EXPORTS
module.exports = router;