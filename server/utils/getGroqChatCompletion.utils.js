const Groq = require("groq-sdk");

const groq = new Groq({
  apikey: "",
});
async function getGroqChatCompletion(structure) {
  const request =
    structure +
    "  Please Rate this Folder structure out of 10 and also tell the pros and cons";
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: request,
      },
    ],
    model: "llama3-8b-8192",
  });
}
