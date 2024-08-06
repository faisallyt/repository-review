const { asyncHandler } = require("../utils/asyncHandler.utils.js");
const { ApiError } = require("../utils/ApiError.utils.js");
const { ApiResponse } = require("../utils/ApiResponse.utils.js");
const axios = require("axios");
const fileExtractor = require("../utils/fileExtractor.utils.js");
const Groq = require("groq-sdk");

const groq = new Groq({
  apikey: "",
});

const getInfo = asyncHandler(async (req, res) => {
  try {
    const requestUrl = req.body.url;

    const baseUrl = "https://api.github.com/repos/";
    const customUrl = baseUrl + "faisallyt/cloud-ide/contents";
    const structure = await fileExtractor(customUrl);
    console.log(structure);

    const chatCompletion = await getGroqChatCompletion(structure);
    // console.log(chatCompletion);
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

async function getGroqChatCompletion(structure) {
  const request = {
    messages: [
      {
        role: "user",
        content:
          structure +
          " Please Rate this Folder structure out of 10 and also tell the pros and cons",
      },
    ],
    model: "llama3-8b-8192",
  };

  try {
    const response = await groq.chat.completions.create(request);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
}

module.exports = { getInfo };
