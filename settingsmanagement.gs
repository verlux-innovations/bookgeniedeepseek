function loadSettings() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    if (!sheet) {
      return getDefaultSettings();
    }
    const settings = {};
    const data = sheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      const key = data[i][0];
      const value = data[i][1];
      if (key && value) {
        if (key === "temperature" || key === "maxTokens") {
          settings[key] = parseFloat(value);
        } else {
          settings[key] = value;
        }
      }
    }
    return settings;
  } catch (error) {
    console.error("Error loading settings: ", error);
    return getDefaultSettings();
  }
}

function saveSettings(settings) {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    if (!sheet) {
      SpreadsheetApp.getActiveSpreadsheet().insertSheet('Settings');
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    }
    const data = [];
    for (const key in settings) {
      if (settings.hasOwnProperty(key)) {
        data.push([key, settings[key]]);
      }
    }
    sheet.clear();
    sheet.getRange(1, 1, data.length, 2).setValues(data);
  } catch (error) {
    console.error("Error saving settings: ", error);
  }
}

function resetSettings() {
  try {
    const defaultSettings = getDefaultSettings();
    saveSettings(defaultSettings);
  } catch (error) {
    console.error("Error resetting settings: ", error);
  }
}

function getDefaultSettings() {
  return {
    "apiKey": "",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 1000,
    "language": "English"
  };
}