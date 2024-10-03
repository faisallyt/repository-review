const axios = require("axios");

const IGNORED_DIRECTORIES = [
  "node_modules",
  ".git",
  ".vscode",
  ".idea",
  "dist",
  "build",
  "target",
  "vendor",
  "bin",
  "obj",
];

async function fileExtractor(customUrl, accessToken, depth = 0, maxDepth = 10) {
  console.log(`Accessing: ${customUrl}`);
  try {
    const response = await axios.get(customUrl, {
      headers: { Authorization: accessToken },
    });
    const directory = response.data;
    const array = [];

    for (const item of directory) {
      if (item.type === "file") {
        array.push({
          name: item.name,
          path: item.path,
          type: "file",
          url: item.download_url,
        });
      } else if (
        item.type === "dir" &&
        depth < maxDepth &&
        !IGNORED_DIRECTORIES.includes(item.name)
      ) {
        const children = await fileExtractor(
          `${customUrl}/${item.name}`,
          accessToken,
          depth + 1,
          maxDepth
        );
        if (children.length > 0) {
          array.push({
            name: item.name,
            path: item.path,
            type: "directory",
            children: children,
          });
        }
      }
    }

    // Sort the array: directories first, then files, both in alphabetical order
    array.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return array;
  } catch (error) {
    console.error(
      `Error fetching file structure for ${customUrl}:`,
      error.message
    );
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
    // Instead of throwing, return an empty array to allow partial results
    return [];
  }
}

function identifyProjectType(fileStructure) {
  const fileNames = fileStructure.map((item) => item.name.toLowerCase());

  if (fileNames.includes("package.json")) {
    return "Node.js";
  } else if (
    fileNames.includes("pom.xml") ||
    fileNames.includes("build.gradle")
  ) {
    return "Java";
  } else if (
    fileNames.includes("requirements.txt") ||
    fileNames.includes("setup.py")
  ) {
    return "Python";
  } else if (fileNames.includes("gemfile")) {
    return "Ruby";
  } else if (fileNames.includes("composer.json")) {
    return "PHP";
  } else if (
    fileNames.some((name) => name.endsWith(".csproj") || name.endsWith(".sln"))
  ) {
    return "C#/.NET";
  } else if (fileNames.includes("cargo.toml")) {
    return "Rust";
  } else if (fileNames.includes("go.mod")) {
    return "Go";
  } else {
    return "Unknown";
  }
}

async function analyzeRepository(repoUrl, accessToken) {
  try {
    const fileStructure = await fileExtractor(repoUrl, accessToken);
    const projectType = identifyProjectType(fileStructure);

    return {
      projectType: projectType,
      fileStructure: fileStructure,
    };
  } catch (error) {
    console.error("Error analyzing repository:", error.message);
    throw error;
  }
}

module.exports = { fileExtractor, analyzeRepository };
