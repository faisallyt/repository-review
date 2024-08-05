    const { asyncHandler } = require("../utils/asyncHandler.utils.js");
    const { ApiError } = require("../utils/ApiError.utils.js");
    const { ApiResponse } = require("../utils/ApiResponse.utils.js");
    const axios=require("axios");
const fileExtractor = require("../utils/fileExtractor.utils.js");

    const getInfo = asyncHandler(async (req, res) => {
        const requestUrl = req.body.url;


        const baseUrl="https://api.github.com/repos/";
        const response=await axios.get(baseUrl+"faisallyt/cloud-ide/contents");
        console.log("hello");
        console.log(response.data);
        if(response.status!=200 ){
            throw new ApiError("Failed to fetch repository information",400);
        }
        const structure=fileExtractor(response.data);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    response.data.length,
                    "System Hang"
                )
            );
    });

    module.exports = {
        getInfo,
    };
