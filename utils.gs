function parseAIResponse(response) {
  if (response && response.choices && response.choices.length > 0) {
    return response.choices[0].message.content.trim();
  }
  throw new Error('Invalid or empty response from AI');
}

function formatContentForDocs(content) {
  return content.replace(/\n/g, '\n\n'); // Double newlines for better readability in Docs
}

function batchProcess(items, callback) {
  if (!Array.isArray(items) || typeof callback !== 'function') {
    throw new Error('Invalid arguments: items must be an array and callback must be a function');
  }
  const results = [];
  for (let i = 0; i < items.length; i++) {
    results.push(callback(items[i]));
  }
  return results;
}