const express = require("express");
const router = express.Router();
const User = require("../models/user")
const {
  checkUserExist
} = require("../middlewares/database/databaseErrorHelpers");
const {userQueryMiddleware} = require("../middlewares/query/userQueryMiddleware");
const { getSingleUser,getAllUsers } = require("../controllers/user.js");

router.get("/",userQueryMiddleware(User), getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);

module.exports = router;
