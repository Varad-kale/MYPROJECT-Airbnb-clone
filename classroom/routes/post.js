const express = require("express");
const router = express.Router();

//posts 
//Index - posts Route
router.get("/", (req,res) => {
    res.send("GET for posts Working")
});

//Show - posts Route
router.get("/:id", (req,res) => {
    res.send("GET for show post id Working")
});

//POSt - posts Route
router.post("/", (req,res) => {
    res.send("POST for posts Working")
});

//Show - posts Route
router.delete("/:id", (req,res) => {
    res.send("DELETE for post id Working");
});

module.exports = router;
