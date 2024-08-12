const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const axios = require("axios");
const fileExtractor = require("../utils/fileExtractor.utils.js");
const getGroqChatCompletion = require("../utils/getGroqChatCompletion.utils.js");

const getInfo = asyncHandler(async (req, res) => {
  try {
    const requestUrl = req.body.url;

    // Extract the username and repository name from the GitHub URL
    const urlParts = requestUrl.split("github.com/")[1].split("/");
    const username = urlParts[0];
    const repository = urlParts[1];

    // Construct the API URL dynamically
    const customUrl = `https://api.github.com/repos/${username}/${repository}/contents`;
    const structure = await fileExtractor(customUrl);
    console.log(structure);

    const chatCompletion = await getGroqChatCompletion(structure);
    console.log(chatCompletion);
    console.log(chatCompletion.choices[0]?.message?.content || "");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          chatCompletion,
          "Folder structure fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});

module.exports = { getInfo };
