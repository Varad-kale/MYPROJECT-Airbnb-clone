const express = require("express");
const router = express.Router({mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js")


// Reviews
// Post Review Route 
router.post("/", validateReview, async (req, res, next) => {
    try {
        // console.log(req.params.id);
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created !");
        res.redirect(`/listings/${listing._id}`);
        console.log("Review added !");

    } catch (err) {
        next(err);
    }
});

//Delete Review Route
router.delete("/:reviewId", async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", " Review Deleted !");
        res.redirect(`/listings/${id}`)
    } catch {
        next()
    }
});


module.exports = router;
