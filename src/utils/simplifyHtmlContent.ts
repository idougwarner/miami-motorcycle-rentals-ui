export function simplifyHtmlContent(htmlContent: string): string {
  // Parsing the HTML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Removing elements with specific attributes (metadata) or any other non-essential elements
  const elementsToRemove = doc.querySelectorAll('[data-metadata], [data-buffer]');
  elementsToRemove.forEach(element => element.remove());

  // Getting the body's inner HTML, which should now be cleaned
  const simplifiedContent = doc.body.innerHTML;

  return simplifiedContent.trim(); // Trim it to remove any extra whitespace
}