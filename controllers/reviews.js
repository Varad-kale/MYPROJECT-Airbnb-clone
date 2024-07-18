const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    try {
        // console.log(req.params.id);
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created !");
        res.redirect(`/listings/${listing._id}`);
        console.log("Review added !");

    } catch (err) {
        next(err);
    }
};


module.exports.deleteReview = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", " Review Deleted !");
        res.redirect(`/listings/${id}`)
    } catch {
        next()
    }
};
