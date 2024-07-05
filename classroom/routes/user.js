const express = require("express");
const router = express.Router();


// user
//Index - users Route
router.get("/", (req,res) => {
    res.send("GET for users Working")
});

//Show - users Route
router.get("/:id", (req,res) => {
    res.send("GET for show user id Working")
});

//POSt - users Route
router.post("/", (req,res) => {
    res.send("POST for users Working")
});

//Show - users Route
router.delete("/:id", (req,res) => {
    res.send("DELETE for user id Working")
});

module.exports = router;
