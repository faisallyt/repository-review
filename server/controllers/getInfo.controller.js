const {asyncHandler} =require("../utils/asyncHandler.utils.js");
const {ApiError} = require("../utils/ApiError.utils.js");
const {ApiResponse} = require("../utils/ApiResponse.utils.js");



const getInfo =asyncHandler(async(req,res)=>{
    const requestUrl=req.body.url;


    console.log(requestUrl);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            requestUrl,
            "System Hang"
        )
    )
})

module.exports = {
    getInfo,
}