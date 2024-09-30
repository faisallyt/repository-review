const { Router } = require("express");
const router = Router();
const {
  getInfo,
  getUserInfo,
} = require("../controllers/getInfo.controller.js");

router.route("/getInfo").post(getInfo);
router.route("/getUserInfo").get(getUserInfo);

module.exports = router;
