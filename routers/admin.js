const express = require("express");
const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");
const { blockUser,deleteUser } = require("../controllers/admin");
const router = express.Router();
const {
    checkUserExist
  } = require("../middlewares/database/databaseErrorHelpers");


router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id",checkUserExist, blockUser);
router.delete("/deleteuser/:id",checkUserExist, deleteUser);

module.exports = router;
