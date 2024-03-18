export const insertPTag = (content) => {
  // Parse the HTML content into a document object
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  // Get all <p> tags from the document
  const paragraphs = doc.querySelectorAll('p');

  // Iterate through the paragraphs and extract their inner HTML
  const pTagsHTML = Array.from(paragraphs).map((p) => p.innerHTML);

  // Join the inner HTML of the <p> tags into a single string
  const sanitizedHTML = pTagsHTML.join('');

  return sanitizedHTML
};
