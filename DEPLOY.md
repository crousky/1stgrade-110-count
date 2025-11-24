# Deploying the 110 Chart Game

The game has been built as a static website. You do not need a Node.js server to run it in production.

## Where are the files?
The complete website is in the `dist` folder.
It contains:
- `index.html`: The main entry point.
- `assets/`: All the JavaScript, CSS, and images.

## How to Host
You can upload the contents of the `dist` folder to any static hosting provider:

1.  **GitHub Pages**: Push the `dist` folder (or the whole project and use a workflow) to GitHub.
2.  **Netlify / Vercel**: Drag and drop the `dist` folder onto their dashboard.
3.  **Azure Static Web Apps**:
    - **Prerequisite**: Push your code to a GitHub repository.
    - Go to the Azure Portal -> Create a Resource -> Static Web App.
    - Select your GitHub repository.
    - **Build Presets**: Select "Custom" or "Vite".
    - **App Location**: `/`
    - **Output Location**: `dist`
    - Click "Review + Create". Azure will automatically build and deploy your site!

## Running Locally
Because the game uses modern JavaScript modules, you cannot just double-click `index.html` to run it (browsers block this for security). You need a simple local web server.
- If you have Python installed: `python -m http.server` inside the `dist` folder.
- Or use the VS Code "Live Server" extension.
- Or use the Azure Static Web Apps CLI: `swa start dist`
