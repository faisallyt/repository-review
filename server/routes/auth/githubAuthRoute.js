const { Router } = require("express");
const router = Router();
const {
  getAccessTokenController,
} = require("../../controllers/auth/githubAuthController.js");

router.route("/getAccessToken").post(getAccessTokenController);

module.exports = router;
