const express = require("express");
const router = express.Router();

//@route  GET api/profile/test
//@desc   Test route for profile
//@access PUBLIC

router.get("/test", (req, res) => res.json({ msg: "profile works" }));

module.exports = router;
