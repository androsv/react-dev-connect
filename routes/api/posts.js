const express = require("express");
const router = express.Router();

//@route  GET api/posts/test
//@desc   Test route for posts
//@access PRIVATE

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

module.exports = router;
