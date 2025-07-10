# Export to VS Code Guide

## Method 1: Download Project Files (Recommended)

### Step 1: Download All Files
1. In Replit, click on the three dots menu (⋯) in the file explorer
2. Select "Download as zip" to download the entire project
3. Extract the zip file to your desired location on your computer

### Step 2: Open in VS Code
1. Open VS Code
2. File → Open Folder → Select the extracted project folder
3. VS Code will automatically detect this as a Node.js project

### Step 3: Install Dependencies
Open the terminal in VS Code and run:
```bash
npm install
```

### Step 4: Set Up Environment
1. Create a `.env` file in the root directory (if needed for database connection)
2. Add any environment variables you were using in Replit

### Step 5: Run the Project
```bash
npm run dev
```

## Method 2: Git Clone (Alternative)

### If you have Git set up in Replit:
1. In Replit terminal, run: `git init` (if not already initialized)
2. Add all files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Push to GitHub/GitLab
5. Clone in VS Code using the Git: Clone command

## Project Structure Overview

```
your-project/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility libraries
├── server/              # Express backend
│   ├── index.ts         # Main server file
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data storage layer
├── shared/              # Shared code
│   └── schema.ts        # Database schema
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS config
└── tsconfig.json        # TypeScript config
```

## VS Code Extensions (Recommended)

Install these extensions for the best development experience:

### Essential:
- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **TypeScript Importer** - Auto import TypeScript modules
- **Tailwind CSS IntelliSense** - Tailwind CSS class autocomplete
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **Bracket Pair Colorizer** - Color matching brackets

### Helpful:
- **Thunder Client** - Test API endpoints directly in VS Code
- **GitLens** - Enhanced Git capabilities
- **Prettier** - Code formatter
- **ESLint** - JavaScript/TypeScript linting
- **Auto Import - ES6, TS, JSX, TSX** - Automatic imports

## VS Code Settings (Optional)

Create `.vscode/settings.json` in your project root:

```json
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "css.validate": false,
  "tailwindCSS.experimental.classRegex": [
    "className\\s*=\\s*[\"']([^\"']*)[\"']"
  ]
}
```

## Running the Development Server

After setup, your development workflow will be:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend API: http://localhost:5000 (Express server)

## Key Features of Your Application

### Frontend (React + TypeScript):
- **Pages:** Dashboard, SignIn, SignUp, Profile, Flagged Anomalies, Export Reports, Upload Submission, Text Input, Review, Submission
- **UI Framework:** shadcn/ui components with Tailwind CSS
- **Routing:** Wouter for client-side routing
- **State Management:** TanStack Query for server state
- **Forms:** React Hook Form with Zod validation

### Backend (Express + TypeScript):
- **API Routes:** User authentication and CRUD operations
- **Storage:** In-memory storage with interface for easy database integration
- **Middleware:** Request logging, JSON parsing, error handling

### Styling:
- **Tailwind CSS:** Utility-first CSS framework
- **Custom Fonts:** Montserrat font family
- **Responsive Design:** Full-width layouts optimized for desktop
- **Components:** shadcn/ui component library

## Troubleshooting

### Common Issues:

1. **Module not found errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check that path aliases in `vite.config.ts` are working

2. **TypeScript errors:**
   - Ensure you have TypeScript installed: `npm install -g typescript`
   - Check `tsconfig.json` configuration

3. **Tailwind styles not working:**
   - Verify `tailwind.config.ts` and `postcss.config.js` are present
   - Check that Tailwind CSS is imported in your main CSS file

4. **Port conflicts:**
   - Change ports in `vite.config.ts` if needed
   - Default: Frontend (5173), Backend (5000)

## Additional Notes

- The project uses ESM modules and modern TypeScript
- Database integration ready (currently using in-memory storage)
- All pages are fully responsive and use full-width layouts
- Authentication flow is implemented but uses mock data
- API endpoints are ready for integration with real backend services

## Need Help?

If you encounter any issues during the export process:
1. Check that all dependencies are installed correctly
2. Verify Node.js version compatibility (recommended: Node 18+)
3. Ensure all configuration files are present
4. Check the console for specific error messages

Your application is now ready to run in VS Code with full development capabilities!