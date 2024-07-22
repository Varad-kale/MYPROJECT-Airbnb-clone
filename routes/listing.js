const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get( listingController.index)
.post( 
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    listingController.renderCreateRoute 
     );
// .post( (req,res) => {
//     res.send(req.file);
// });

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( listingController.renderShowPage)
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, listingController.updatelisting)
.delete( isLoggedIn, isOwner, listingController.deletelisting);




// //Index route
// router.get("/", listingController.index);


// //Show Route
// router.get("/:id", listingController.renderShowPage);

//Create Route 
// router.post("/", validateListing,isLoggedIn, listingController.renderCreateRoute);


// router.use((err, req, res, next) => {
//     let { statusCode = 502, message = "Something went Wrong, Try Again !" } = err;
//     res.status(statusCode).render("error.ejs", { err });
//     //res.status(statusCode).send(message);
//     //res.send("something went  wrong please try again ! ")
// })

// app.all("*", (req ,res ,next) => {
//     next(new ExpressError(404," Page not Found !"))  
// });

//edit route 
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditform);

//update route
// router.put("/:id", isLoggedIn, isOwner, listingController.updatelisting);

// delete route
// router.delete("/:id",isLoggedIn, isOwner, listingController.deletelisting);


module.exports = router;

