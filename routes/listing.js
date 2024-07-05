const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error); //errMsg
    } else {
        next();
    }
}


//Index route
router.get("/", async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("./listings/index.ejs", { allListings });
    } catch (err) {
        next(err);
    }
})

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
});

//Show Route
router.get("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        if(!listing){
            req.flash("error", "Listing you requested does not exist !");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });

    } catch (err) {
        next(err);
    }

});

//Create Route 
router.post("/", validateListing, async (req, res, next ) => { // async function because whenever there is a change use async functions
    try {
        // let listing = req.body.listing;
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if (result.error) {
        //     throw new ExpressError(202, result.error);
        // }
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
        // console.log(listing);
    } catch (err) {
        next();
    }
});



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
router.get("/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing you requested does not exist !");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });

    } catch (err) {
        next(err);
    }
});

//update route
router.put("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated !");
        res.redirect(`/listings/${id}`);

    } catch (err) {
        next(err);
    }

});

// delete route
router.delete("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleted !");
        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
});




module.exports = router;

