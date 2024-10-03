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
    const structure = await fileExtractor.analyzeRepository(
      customUrl,
      req.headers.authorization
    );
    console.log("structure:", structure.fileStructure);

    console.log("Initializing Gemini AI");
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    console.log("Getting generative model");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const folderStructureString = JSON.stringify(
      structure.fileStructure,
      null,
      2
    ); // Converts to a readable format
    const prompt = `You are required to provide a rating out of 10 and a review of the folder structure of the repository mentioned below. The output should be in the form of a structured object like this: {rating: "", good: ["", "", ""], bad: ["", ""]}. 
The repository folder structure is:
${folderStructureString}`;

    console.log("Generating content from Gemini AI");
    // Generate content from the Gemini AI
    const result = await model.generateContent(prompt);
    const aiResponseText = await result.response.text();

    console.log("Raw AI response:", aiResponseText); // Log the raw response

    // Function to safely parse the AI response
    const safeJSONParse = (str) => {
      // Remove Markdown code block syntax if present
      const cleanStr = str.replace(/```json\n?|\n?```/g, "").trim();

      try {
        // Try to parse the cleaned string
        return JSON.parse(cleanStr);
      } catch (e) {
        console.error("Failed to parse cleaned string:", e);

        // If parsing fails, try to further clean up the string
        const furtherCleanedStr = cleanStr
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure all keys are in double quotes
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/,\s*([\]}])/g, "$1"); // Remove trailing commas

        try {
          return JSON.parse(furtherCleanedStr);
        } catch (e2) {
          console.error("Failed to parse further cleaned string:", e2);
          throw new Error("Unable to parse AI response");
        }
      }
    };

    // Parse the response to JSON
    let aiResponseJson;
    try {
      aiResponseJson = safeJSONParse(aiResponseText);
      console.log("Parsed AI response:", aiResponseJson); // Log the parsed response
    } catch (jsonError) {
      console.error("Failed to parse AI response as JSON:", jsonError);
      throw new ApiError(500, "Failed to parse AI response");
    }

    // Send the parsed response as JSON
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          aiResponseJson,
          "Folder structure fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error in getInfo:", error);
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
    console.error("Error in getUserInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
};

module.exports = { getInfo, getUserInfo };
