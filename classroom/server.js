const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: 'superdupersecret',
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req,res) => {
    let { name = 'anonymous'} = req.query;
    req.session.name = name;

    if(name == 'anonymous'){
        req.flash("error", "user not registered ");
    }else{
        req.flash("success", "user registered successfully !");
    }

    res.redirect("/hello");
});

app.get("/hello", (req,res) => {
    res.render("page.ejs", { name : req.session.name });
});

// app.get("/reqcount", (req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You send a request ${req.session.count} times`)
// })


// app.use(cookieparser("secretcode"));

// app.get("/getsignedcookie", (req,res) => { 
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookie sent ! ");
// })

// app.get("/getcookies", (req,res) => {
//     res.cookie("greet ", "Namaskar ");
//     res.cookie("madeInState", "Maharashtra");
//     res.send("sent you some cookies ");
// })

// app.get("/Verify", (req,res) => {
//     console.log(req.signedCookies);
//     res.send("Verified !")
// });

// app.get("/greet", (req,res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi I am ${name}`);
// })

// app.get("/", (req,res) => {
//     console.dir(req.cookies);
//     res.send(" Hi, Web page I am root Route ");
// });

app.listen(3000, () => {
    console.log("Server is listening to port 3000 ")
});

// app.use("/users", users);
// app.use("/posts", posts);


// //Index - users Route
// app.get("/users", (req,res) => {
//     res.send("GET for users Working")
// });

// //Show - users Route
// app.get("/users/:id", (req,res) => {
//     res.send("GET for show user id Working")
// });

// //POSt - users Route
// app.post("/users", (req,res) => {
//     res.send("POST for users Working")
// });

// //Show - users Route
// app.delete("/users/:id", (req,res) => {
//     res.send("DELETE for user id Working")
// });


// //posts 
// //Index - posts Route
// app.get("/posts", (req,res) => {
//     res.send("GET for posts Working")
// });

// //Show - posts Route
// app.get("/posts/:id", (req,res) => {
//     res.send("GET for show post id Working")
// });

// //POSt - posts Route
// app.post("/posts", (req,res) => {
//     res.send("POST for posts Working")
// });

// //Show - posts Route
// app.delete("/posts/:id", (req,res) => {
//     let {id} = req.params;
//     res.send("DELETE for post id Working");
// });