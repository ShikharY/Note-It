# Note It - Chrome Extension

A simple Chrome extension for taking notes while browsing any webpage.

## Features

- Write and save notes while browsing
- View all saved notes with timestamps
- Delete notes
- Graph view page for better note visualization
- Clean and simple interface

## Installation

1. Build the extension:

   ```bash
   npm run build
   ```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Development

To run in development mode with auto-rebuild:

```bash
npm run dev
```

Both commands will start webpack in watch mode, automatically rebuilding the extension when you make changes to the source code.

## Usage

1. Click the "Note It" extension icon in your Chrome toolbar
2. Write your note in the text area
3. Click "Save Note" to save it
4. View all your saved notes below
5. Click "Delete" to remove any note
6. Click "Open Graph View" to see all notes in a full-page view

## Graph View

The Graph View opens in a new browser tab and provides:

- A full-page layout for better note visualization
- Grid layout showing all saved notes
- Links to the original pages where notes were taken
- Delete functionality for individual notes
- Responsive design for different screen sizes

## Project Structure

```
├── src/
│   ├── App.js              # Main React component (popup)
│   ├── GraphView.js        # Graph view component
│   ├── popup.js            # Popup entry point
│   ├── graphView.js        # Graph view entry point
│   ├── popup.html          # Popup HTML template
│   ├── graphView.html      # Graph view HTML template
│   ├── styles.css          # Popup styles
│   └── graphViewStyles.css # Graph view styles
├── manifest.json           # Chrome extension manifest
├── webpack.config.js       # Webpack configuration
└── package.json            # Dependencies and scripts
```

## Building

The extension will be built to the `dist/` folder, which contains:

- `popup.html` - The popup page
- `popup.js` - The bundled popup JavaScript
- `graphView.html` - The graph view page
- `graphView.js` - The bundled graph view JavaScript
- `manifest.json` - Extension manifest
