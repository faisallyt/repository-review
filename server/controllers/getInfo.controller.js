const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const axios = require("axios");
const fileExtractor = require("../utils/fileExtractor.utils.js");

const getInfo = asyncHandler(async (req, res) => {
    const requestUrl = req.body.url;

    const baseUrl = "https://api.github.com/repos/";
    const customUrl = baseUrl + "faisallyt/cloud-ide/contents";
    // const response=await axios.get(customUrl);
    
    // console.log(response.data);
    const structure = await fileExtractor(customUrl);
    console.log(structure);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                structure,
                "Folder structure fetched successfully"
            )
        );
});

module.exports = {
    getInfo,
};
