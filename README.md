# Vite React Project

A modern React application built with Vite, TypeScript, and Tailwind CSS.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Build

To build for production:

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deploy to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy when you push to the `main` branch

3. **Configure Base Path (if needed):**
   If your repository name is not `username.github.io`, you'll need to set a base path in `vite.config.ts`:
   
   ```typescript
   export default defineConfig({
     base: '/YOUR_REPO_NAME/',
     // ... rest of config
   })
   ```

4. **Access your site:**
   - If repo is `username.github.io`: `https://username.github.io`
   - Otherwise: `https://username.github.io/REPO_NAME`

### Manual Deployment:

The GitHub Actions workflow will automatically:
- Build your project on every push to `main`
- Deploy the `dist` folder to GitHub Pages
- You can also trigger it manually from the **Actions** tab

## Project Structure

- `src/` - Source code
- `public/` - Static assets
- `dist/` - Build output (generated)
- `.github/workflows/` - GitHub Actions workflows

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Shadcn UI
