const { Router } = require("express");
const router = Router();
const {
  getInfo,
  getUserInfo,
} = require("../controllers/getInfo.controller.js");

router.route("/getInfo").post(getInfo);
router.route("/getUserInfo").post(getUserInfo);

module.exports = router;
