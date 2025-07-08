```markdown
# BookGenieDeepSeek - AI-Powered Book Writing Assistant

![Google Sheets + AI Logo](https://via.placeholder.com/150) *(Consider adding a logo/image here)*

## ? Project Description

BookGenieDeepSeek is a powerful Google Sheets-based tool that leverages AI (via OpenRouter API) to assist writers in generating structured book content. From initial title ideas to complete chapter drafts and back cover text, this tool streamlines the book creation process and compiles everything into a ready-to-edit Google Docs document.

? **Project Documentation**: [Google Doc](https://docs.google.com/document/d/1l9cI4RFjVgWM8zAn7CKzCGjbTbvl63F8Fy2vg3zdS8o/)

## ? Features

- ?? AI-generated book title suggestions
- ? Automatic chapter structure generation
- ?? Full chapter content drafting
- ? Professional back cover text generation
- ? Google Docs export with proper formatting
- ?? Customizable OpenRouter API settings
- ? Save/Load user preferences
- ? Batch processing for efficient generation
- ?? Comprehensive error handling

## ? Installation

1. **Make a Copy** of the Google Sheet template:
   - [BookGenieDeepSeek Template](https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing) *(Replace with actual link)*
   
2. **Open the Script Editor**:
   - Go to `Extensions > Apps Script`
   
3. **Add Required Scripts**:
   - Copy the contents from all `.gs` and `.html` files in this project into corresponding files in the Apps Script editor

4. **Set Up API Key**:
   ```javascript
   // In settings.gs
   function setOpenRouterAPIKey() {
     PropertiesService.getScriptProperties().setProperty('OPENROUTER_API_KEY', 'your-api-key-here');
   }
   ```

5. **Authorize and Reload**:
   - Run any function to authorize the script
   - Refresh your Google Sheet

## ?? Usage

### Basic Workflow:
1. Open the sidebar via `Extensions > BookGenieDeepSeek > Show Sidebar`
2. Enter your book details:
   - Genre
   - Theme
   - Target audience
   - Any specific instructions
3. Generate content step-by-step:
   - First get title suggestions
   - Then generate chapter outlines
   - Finally draft full chapters
4. Export to Google Docs when ready

### Example Usage:
```javascript
// Generate book titles
function generateSampleTitles() {
  const titles = generateBookTitles("Fantasy novel about dragon riders");
  console.log(titles);
}

// Export to Docs
function createSampleBook() {
  const content = {
    title: "The Last Dragon Rider",
    chapters: [...],
    backCover: "..."
  };
  exportToGoogleDocs(content);
}
```

## ? Components

| File | Purpose | Status |
|------|---------|--------|
| `code.gs` | Main logic for interactions, API calls, and Docs compilation | ? Pass |
| `sidebar.html` | User interface for inputs and actions | ? Pass |
| `utils.gs` | Utility functions (API calls, formatting) | ? Fail *(Needs work)* |
| `settingsmanagement.gs` | Manages user preferences and settings | ? Pass |
| `errorhandling.gs` | Handles errors and provides user feedback | ? Pass |
| `settings.gs` | API key and model configuration | ? Pass |

## ? Dependencies

- **Google Apps Script** services:
  - SpreadsheetApp
  - DocumentApp
  - PropertiesService
  - UrlFetchApp
  
- **External APIs**:
  - OpenRouter API (AI content generation)
  
- **Libraries**:
  - None required (pure Google Apps Script)

## ?? Important Notes

1. **API Limits**: Be mindful of OpenRouter API rate limits and costs
2. **Data Privacy**: All user data stays within Google's ecosystem
3. **Customization**: Adjust `settings.gs` for your preferred AI models
4. **Performance**: For long books, use batch processing to avoid timeouts

## ? Contributing

Contributions are welcome! Please fork the project and submit pull requests for:
- Improving `utils.gs` functionality
- Adding new AI model support
- Enhancing error handling
- UI improvements

## ? License

[MIT License](LICENSE) *(Include actual license file if available)*

---

*Developed with ?? for writers and creators*  
*Powered by Google Sheets and OpenRouter AI*
```

This README provides a comprehensive overview of your project with:
1. Clear project description and features
2. Step-by-step installation
3. Usage examples
4. Component breakdown
5. Dependency information
6. Additional relevant notes

You may want to:
- Add actual links to your template sheet
- Include screenshots of the interface
- Add more detailed code examples
- Specify exact API requirements/limits
- Add troubleshooting section if needed