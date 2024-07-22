const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("./listings/index.ejs", { allListings });
    } catch (err) {
        next(err);
    }
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.renderShowPage = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate({path: "reviews", populate: {
            path: "author",
        }}).populate("owner");
        if(!listing){
            req.flash("error", "Listing you requested does not exist !");
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listings/show.ejs", { listing });

    } catch (err) {
        next(err);
    }
}

module.exports.renderCreateRoute = async (req, res, next ) => { // async function because whenever there is a change use async functions
    try {
        // let listing = req.body.listing;
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if (result.error) {
        //     throw new ExpressError(202, result.error);
        // }
        let url = req.file.path;
        let filename = req.file.filename;
       
        const newlisting = new Listing(req.body.listing);
        // console.log(req.user);
        newlisting.owner = req.user._id;
        newlisting.image = {url, filename};
        await newlisting.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
        // console.log(listing);
    } catch (err) {
        next();
    }
};

module.exports.renderEditform = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing you requested does not exist !");
            res.redirect("/listings");
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250")
        res.render("listings/edit.ejs", { listing , originalImageUrl });

    } catch (err) {
        next(err);
    }
};

module.exports.updatelisting = async (req, res, next) => {
    try {
        let { id } = req.params;
        
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url, filename};
            await listing.save();
        }

        req.flash("success", "Listing Updated !");
        res.redirect(`/listings/${id}`);

    } catch (err) {
        next(err);
    }

};

module.exports.deletelisting = async (req, res, next) => {
    try {
        let { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing Deleted !");
        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
};

