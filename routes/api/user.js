const express = require("express");
const router = express.Router();

//@route  GET api/users/test
//@desc   Test route for users
//@access PUBLIC

router.get("/test", (req, res) => res.json({ msg: "users works" }));

module.exports = router;
