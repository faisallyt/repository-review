const axios = require("axios");

async function fileExtractor(customUrl) {
  try {
    const response = await axios.get(customUrl);
    const directory = response.data;
    const array = [];

    for (let i = 0; i < directory.length; i++) {
      if (directory[i].type === "file") {
        const obj = {
          name: directory[i].name,
          path: directory[i].path,
          type: "file",
        };
        array.push(obj);
      } else {
        const obj = {
          name: directory[i].name,
          path: directory[i].path,
          type: "directory",
          children: await fileExtractor(`${customUrl}/${directory[i].name}`),
        };
        array.push(obj);
      }
    }
    return array;
  } catch (error) {
    console.error("Error fetching file structure:", error);
    throw new Error("Failed to fetch file structure");
  }
}

module.exports = fileExtractor;
