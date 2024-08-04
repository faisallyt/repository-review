const {Router}=require("express");
const router=Router();
const {getInfo}=require("../controllers/getInfo.controller.js");

router.route("/getInfo").post(getInfo);


module.exports=router;




