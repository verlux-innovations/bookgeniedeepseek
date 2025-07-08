function getOpenRouterAPIKey() {
  const properties = PropertiesService.getUserProperties();
  return properties.getProperty('OPENROUTER_API_KEY') || '';
}

/**
 * Sets the OpenRouter API key in the user's properties.
 * @param {string} key The OpenRouter API key to set.
 */
function setOpenRouterAPIKey(key) {
  const properties = PropertiesService.getUserProperties();
  properties.setProperty('OPENROUTER_API_KEY', key);
}

/**
 * Retrieves the default AI model from the user's properties.
 * @return {string} The default AI model.
 */
function getDefaultModel() {
  const properties = PropertiesService.getUserProperties();
  return properties.getProperty('DEFAULT_MODEL') || 'openai/gpt-3.5-turbo';
}

/**
 * Sets the default AI model in the user's properties.
 * @param {string} model The default AI model to set.
 */
function setDefaultModel(model) {
  const properties = PropertiesService.getUserProperties();
  properties.setProperty('DEFAULT_MODEL', model);
}