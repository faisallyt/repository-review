const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const axios = require("axios");
const fileExtractor = require("../utils/fileExtractor.utils.js");
const getGroqChatCompletion = require("../utils/getGroqChatCompletion.utils.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getInfo = asyncHandler(async (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  try {
    const requestUrl = req.body.url;

    // Extract the username and repository name from the GitHub URL
    const urlParts = requestUrl.split("github.com/")[1].split("/");
    console.log(urlParts);
    const username = urlParts[0];
    const repository = urlParts[1];

    // Construct the API URL dynamically
    const customUrl = `https://api.github.com/repos/${username}/${repository}/contents`;
    console.log(customUrl);
    const structure = await fileExtractor(customUrl);
    // console.log(structure);

    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are required to provide a rating out of 10 and a review of the folder structure of the repository mentioned below. The output should be in the form of a structured object like this: {rating: "", good: ["", "", ""], bad: ["", ""]}. 
     The repository folder structure is:
     ${structure}`;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    // const chatCompletion = await getGroqChatCompletion(structure);
    // console.log(chatCompletion);
    // console.log(chatCompletion.choices[0]?.message?.content || "");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result.response.text,
          "Folder structure fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});

const getUserInfo = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = await axios.get("https://api.github.com/user", {
      headers: { Authorization: token },
    });

    return res.status(200).json({
      success: true,
      user: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
};

module.exports = { getInfo, getUserInfo };
