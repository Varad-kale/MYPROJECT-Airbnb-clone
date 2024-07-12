const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave : false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge: 7 *24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req, res) => {
    console.log("Started");
    res.send("Escape to this luxurious villa nestled in the serene countryside, offering breathtaking views of the surrounding mountains and lush greenery. This spacious property boasts a private pool, outdoor dining area, and beautifully landscaped gardens, perfect for enjoying the Mediterranean sunshine. Inside, you'll find elegantly decorated rooms with modern amenities and comfortable furnishings. Ideal for a relaxing getaway with family and friends, this villa is the perfect retreat for those looking to unwind and recharge");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // to initialize the session
app.use(passport.session()); // for identifying users to authenticate as they browse from page to page 

passport.use(new LocalStrategy(User.authenticate())); //It is used as route middleware to authenticate requests

passport.serializeUser(User.serializeUser()); // for getting logged in for that particular session
passport.deserializeUser(User.deserializeUser()); // for getting out of that session 


app.use((req ,res ,next ) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser", async (req,res) => {
//    let fakeUser = new User({
//      email: "student@gmail.com",
//      username : "delta-student" // can write username because of passport local mongoose package 
//    });

//    let registeredUser = await User.register(fakeUser, "helloworld");
//    res.send(registeredUser);
// });

app.use("/listings", listingRouter );
app.use("/listings/:id/reviews", reviewRouter );
app.use("/", userRouter);


const MONGO_URL = "mongodb://127.0.0.1:27017/WanderGo";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connection successful to mongoDb");
    }).catch((err) => {
        console.log(err);
    });


// app.get("/testlisting", async (req,res) => {
//     let samplelisting = new Listing({
//         title:"My Ville parle",
//         description:"This is a beautiful place to stay",
//         price: 8500,
//         location:"Lonavala",
//         country:"India",
//     })
//     await samplelisting.save();
//     console.log("sample was saved ");
//     res.send("Sucessfully sample saved ! ");
// });


// app.all("*", (req ,res ,next) => {
//     next(new ExpressError(404," Page not Found !"))  
// });

app.use((err, req, res, next) => {
    let { statusCode = 502, message = "Something went Wrong, Try Again !" } = err;
    res.status(statusCode).render("error.ejs", { err });
    //res.status(statusCode).send(message);
    //res.send("something went  wrong please try again ! ")
})


app.listen(8080, () => {
    console.log("Server Activated !");
});


// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, error); //errMsg
//     } else {
//         next();
//     }
// };

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);

//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg); //errMsg
//     } else {
//         next();
//     }
// };



// //Index route
// app.get("/listings", async (req, res, next) => {
//     try {
//         const allListings = await Listing.find({});
//         res.render("./listings/index.ejs", { allListings });
//     } catch (err) {
//         next(err);
//     }
// })

// //new route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs")
// });

// //Show Route
// app.get("/listings/:id", async (req, res, next) => {
//     try {
//         let { id } = req.params;
//         const listing = await Listing.findById(id).populate("reviews");
//         res.render("listings/show.ejs", { listing });

//     } catch (err) {
//         next(err);
//     }

// });

// //Create Route 
// app.post("/listings", validateListing, async (req, res, next) => { // async function because whenever there is a change use async functions
//     try {
//         // let listing = req.body.listing;
//         let result = listingSchema.validate(req.body);
//         console.log(result);
//         if (result.error) {
//             throw new ExpressError(202, result.error);
//         }
//         const newlisting = new Listing(req.body.listing);
//         await newlisting.save();
//         res.redirect("/listings");
//         // console.log(listing);
//     } catch (err) {
//         next(err);
//     }
// });




// //edit route 
// app.get("/listings/:id/edit", async (req, res, next) => {
//     try {
//         let { id } = req.params;
//         const listing = await Listing.findById(id);
//         res.render("listings/edit.ejs", { listing });

//     } catch (err) {
//         next(err);
//     }
// });

// //update route
// app.put("/listings/:id", async (req, res, next) => {
//     try {
//         let { id } = req.params;
//         await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//         res.redirect(`/listings/${id}`);

//     } catch (err) {
//         next(err);
//     }

// });

// // delete route
// app.delete("/listings/:id", async (req, res, next) => {
//     try {
//         let { id } = req.params;
//         const deletedListing = await Listing.findByIdAndDelete(id);
//         console.log(deletedListing);
//         res.redirect("/listings");

//     } catch (err) {
//         next(err);
//     }
// });



// // Reviews
// // Post Review Route 
// app.post("/listings/:id/reviews", validateReview, async (req, res, next) => {
//     try {
//         let listing = await Listing.findById(req.params.id);
//         let newReview = new Review(req.body.review);

//         listing.reviews.push(newReview);

//         await newReview.save();
//         await listing.save();

//         res.redirect(`/listings/${listing._id}`);
//         console.log("Review added !");

//     } catch (err) {
//         next(err);
//     }
// });

// //Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId", async (req, res, next) => {
//     try {
//         let { id, reviewId } = req.params;

//         await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//         await Review.findByIdAndDelete(reviewId);


//         res.redirect(`/listings/${id}`)
//     } catch {
//         next()
//     }
// })

// privacy 
app.get("/privacy", (req, res) => {
    console.log("enter'd privacy")
    res.send("Privacy route is working !");
});

// terms
app.get("/terms", (req, res) => {
    console.log("enter'd terms")
    res.send("terms route is working !");
});

