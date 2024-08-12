const Groq = require("groq-sdk");

const groq = new Groq({
  apikey: process.env.GROQ_API_KEY,
});

async function getGroqChatCompletion(structure) {
  const prompt =
    structure +
    "  Please Rate this Folder structure out of 10 and also tell the pros and cons";

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    if (
      response &&
      response.choices &&
      response.choices[0] &&
      response.choices[0].message
    ) {
      return response;
    } else {
      throw new Error("Unexpected response format from Groq API");
    }
  } catch (error) {
    console.error("Error fetching Groq chat completion:", error);
    throw new Error("Failed to fetch Groq chat completion");
  }
}

module.exports = getGroqChatCompletion;
