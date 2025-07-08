const SIDEBAR_TITLE = 'BookGenie';
const OPENROUTER_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-3.5-turbo';
const MAX_RETRIES = 3;
const INITIAL_DELAY = 2000;

/**
 * Triggered when spreadsheet opens - adds custom menu
 */
function onOpen() {
  validateApiKey();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('BookGenie')
    .addItem('Open BookGenie', 'showSidebar')
    .addToUi();
}

/**
 * Validates if API key is set
 */
function validateApiKey() {
  if (OPENROUTER_API_KEY === 'YOUR_API_KEY') {
    throw new Error('Please set your OpenRouter API key in the script');
  }
}

/**
 * Displays the BookGenie sidebar
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle(SIDEBAR_TITLE)
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Generates book titles based on user prompt
 * @param {string} prompt - User's description of the book
 * @return {Array} Array of generated book titles
 */
function generateBookTitles(prompt) {
  validateInput(prompt);
  const requestBody = {
    model: DEFAULT_MODEL,
    messages: [{
      role: "user",
      content: `Generate 5 creative book titles based on: "${sanitizeInput(prompt)}". Return only the titles as a numbered list.`
    }]
  };

  const response = callOpenRouterAPI(requestBody);
  return parseListResponse(response);
}

/**
 * Generates chapter structure for a book
 * @param {string} bookTitle - The book title
 * @param {string} genre - The book genre
 * @return {Array} Array of chapter titles and brief descriptions
 */
function generateChapterStructure(bookTitle, genre) {
  validateInput(bookTitle);
  validateInput(genre);
  const requestBody = {
    model: DEFAULT_MODEL,
    messages: [{
      role: "user",
      content: `Create a detailed chapter structure for "${sanitizeInput(bookTitle)}" (${sanitizeInput(genre)} genre). 
      For each chapter, provide a title and 1-2 sentence description. 
      Format as: "1. Chapter Title: Description"`
    }]
  };

  const response = callOpenRouterAPI(requestBody);
  return parseListResponse(response);
}

/**
 * Generates full chapter content
 * @param {string} chapterTitle - The chapter title
 * @param {string} outline - The chapter outline/description
 * @return {string} Generated chapter content
 */
function generateFullChapter(chapterTitle, outline) {
  validateInput(chapterTitle);
  validateInput(outline);
  const requestBody = {
    model: DEFAULT_MODEL,
    messages: [{
      role: "user",
      content: `Write a full chapter titled "${sanitizeInput(chapterTitle)}" based on: "${sanitizeInput(outline)}". 
      The chapter should be 800-1200 words with proper narrative structure.`
    }]
  };

  return callOpenRouterAPI(requestBody);
}

/**
 * Generates back cover text for a book
 * @param {string} bookTitle - The book title
 * @param {string} summary - Brief summary of the book
 * @return {string} Generated back cover text
 */
function generateBackCoverText(bookTitle, summary) {
  validateInput(bookTitle);
  validateInput(summary);
  const requestBody = {
    model: DEFAULT_MODEL,
    messages: [{
      role: "user",
      content: `Write compelling back cover text (150-200 words) for "${sanitizeInput(bookTitle)}". 
      Book details: ${sanitizeInput(summary)}. Include a hook and key selling points.`
    }]
  };

  return callOpenRouterAPI(requestBody);
}

/**
 * Batch generates multiple chapters
 * @param {Array} chapterTitles - Array of chapter titles with outlines
 * @return {Array} Array of generated chapter contents
 */
function batchGenerateChapters(chapterTitles) {
  const chapters = [];
  
  chapterTitles.forEach((chapter, index) => {
    try {
      const content = generateFullChapter(chapter.title, chapter.outline);
      chapters.push({
        title: chapter.title,
        content: content
      });
      
      // Add exponential backoff delay between requests
      if (index < chapterTitles.length - 1) {
        Utilities.sleep(INITIAL_DELAY * Math.pow(2, index));
      }
    } catch (e) {
      chapters.push({
        title: chapter.title,
        content: `Error generating chapter: ${e.message}`
      });
    }
  });
  
  return chapters;
}

/**
 * Exports generated content to Google Docs
 * @param {Object} contentStructure - The complete book structure
 */
function exportToGoogleDocs(contentStructure) {
  const doc = DocumentApp.create(contentStructure.bookTitle);
  const body = doc.getBody();
  
  // Add title
  body.appendParagraph(contentStructure.bookTitle)
    .setHeading(DocumentApp.ParagraphHeading.TITLE);
  
  // Add chapters
  contentStructure.chapters.forEach(chapter => {
    body.appendParagraph(chapter.title)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph(chapter.content);
  });
  
  // Add back cover if exists
  if (contentStructure.backCover) {
    body.appendPageBreak();
    body.appendParagraph('Back Cover')
      .setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph(contentStructure.backCover);
  }
  
  return doc.getUrl();
}

/**
 * Makes API call to OpenRouter with retry logic
 * @param {Object} requestBody - The request payload
 * @return {string} API response content
 */
function callOpenRouterAPI(requestBody) {
  let retries = 0;
  let lastError;
  
  while (retries < MAX_RETRIES) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(requestBody),
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(OPENROUTER_URL, options);
      const responseData = JSON.parse(response.getContentText());
      
      if (responseData.error) {
        throw new Error(responseData.error.message);
      }
      
      return responseData.choices[0].message.content;
    } catch (e) {
      lastError = e;
      retries++;
      if (retries < MAX_RETRIES) {
        Utilities.sleep(INITIAL_DELAY * Math.pow(2, retries));
      }
    }
  }
  
  throw lastError;
}

/**
 * Parses numbered list responses into array
 * @param {string} response - API response text
 * @return {Array} Parsed list items
 */
function parseListResponse(response) {
  return response.split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^\d+\.\s*/, '').trim());
}

/**
 * Validates user input
 * @param {string} input - User input to validate
 */
function validateInput(input) {
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    throw new Error('Invalid input: Input cannot be empty');
  }
}

/**
 * Sanitizes user input
 * @param {string} input - User input to sanitize
 * @return {string} Sanitized input
 */
function sanitizeInput(input) {
  return input.replace(/[^a-zA-Z0-9\s.,!?\-'"()]/g, '');
}