function handleAPIError(error) {
  let errorMessage = 'Unknown error occurred';
  let userMessage = 'Failed to complete API operation. Please try again later.';

  if (error.message) {
    errorMessage = error.message;
  }

  // Differentiate error types
  if (error.message && error.message.includes('quota')) {
    userMessage = 'API rate limit exceeded. Please wait and try again later.';
  } else if (error.message && error.message.includes('auth')) {
    userMessage = 'Authentication failed. Please check your API settings.';
  }

  const fullErrorMessage = `API Error: ${errorMessage}`;
  logError(error, 'API Operation');
  displayUserError(userMessage);
  return fullErrorMessage;
}

/**
 * Logs errors to Stackdriver and sheet's error log
 * @param {Error} error - Error object to log
 * @param {string} context - Context where error occurred
 */
function logError(error, context) {
  console.error(`[${context}]`, error);
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const errorLog = ss.getSheetByName('ErrorLog') || ss.insertSheet('ErrorLog');
  
  errorLog.appendRow([
    new Date(),
    ss.getName(),
    context,
    error.message || 'No error message',
    error.stack || 'No stack trace'
  ]);
}

/**
 * Displays user-friendly error message in UI
 * @param {string} message - Error message to display
 */
function displayUserError(message) {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Error', message, ui.ButtonSet.OK);
}

/**
 * Retries an operation with exponential backoff
 * @param {Function} operation - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} [retryDelay=1000] - Initial retry delay in ms
 * @return {*} Result of successful operation
 */
async function retryOperation(operation, maxRetries, retryDelay = 1000) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries) {
        throw error;
      }
      
      Utilities.sleep(retryDelay * Math.pow(2, attempt - 1));
    }
  }
}