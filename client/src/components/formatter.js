function formatText(input) {
  let formattedText = input
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Add new lines after certain keywords to maintain structure
    .replace(/Pros:/g, "\n### <strong>Pros:</strong>\n")
    .replace(/Cons:/g, "\n### <strong>Cons:</strong>\n")
    .replace(/Conclusion:/g, "\n### <strong>Conclusion:</strong>\n")

    // Add line breaks after each list item number
    .replace(/(\d\.) /g, "\n$1 ");

  return formattedText.trim();
}

export default formatText;
