const {Router}=require("express");
const router=Router();
const {getInfo}=require("../controllers/getInfo.controller.js");

router.route("/getInfo").get(getInfo);


module.exports=router;




