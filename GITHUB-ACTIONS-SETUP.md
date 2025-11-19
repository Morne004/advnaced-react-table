# GitHub Actions Setup Guide

This guide will help you set up automated npm publishing for this repository.

## Overview

The GitHub Actions workflow will automatically:
- ✅ Detect when package.json version changes on the main branch
- ✅ Build and publish to npm if the version is new
- ✅ Create a GitHub Release with changelog
- ✅ Create and push a git tag for the version

## Setup Instructions

### Step 1: Add NPM_TOKEN to GitHub Secrets

1. **Get your npm access token**:
   - If you don't have one, create it at: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Choose "Automation" token type with "Read and write" permissions
   - Save the token securely (you won't be able to see it again)

2. **Add it to GitHub Secrets**:
   - Go to your repository on GitHub: https://github.com/Morne004/advnaced-react-table
   - Click **Settings** (in the repository menu)
   - In the left sidebar, click **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: Paste your npm access token
   - Click **Add secret**

### Step 2: Push the Workflow to GitHub

The workflow file has been created at `.github/workflows/publish.yml`.

Commit and push it to your repository:

```bash
git add .github/workflows/publish.yml
git commit -m "Add GitHub Actions workflow for automated npm publishing"
git push origin main
```

**Note:** This initial push won't trigger a publish because the current version (1.3.0) already exists on npm.

### Step 3: Test the Workflow

To test the automated publishing:

1. **Bump the version** (choose patch, minor, or major):
   ```bash
   npm version patch  # 1.3.0 → 1.3.1
   # or
   npm version minor  # 1.3.0 → 1.4.0
   # or
   npm version major  # 1.3.0 → 2.0.0
   ```

2. **Push to main**:
   ```bash
   git push origin main
   ```

3. **Watch the workflow**:
   - Go to https://github.com/Morne004/advnaced-react-table/actions
   - You'll see the "Publish to npm" workflow running
   - It will automatically build, publish, and create a release

## How It Works

### Workflow Trigger
- Runs on every push to the `main` branch

### Version Detection
- Extracts version from `package.json`
- Checks if that version exists on npm
- **If new:** Builds, publishes, creates release
- **If exists:** Skips with a helpful message

### Build & Publish Process
1. Checkout code with full git history
2. Setup Node.js 20 (LTS)
3. Install dependencies with `npm ci`
4. Run `npm run build`
5. Verify dist/ directory exists
6. Publish to npm with `--access public`
7. Create and push git tag (e.g., `v1.4.0`)
8. Generate changelog from git commits
9. Create GitHub Release with changelog

### Safety Features
- ✅ Only publishes if version is new (prevents duplicate publishes)
- ✅ Verifies build output before publishing
- ✅ Uses secure token from GitHub Secrets
- ✅ Automatic git tagging with semantic version
- ✅ Clear summary messages for each run

## Workflow File Location

`.github/workflows/publish.yml`

## Monitoring & Troubleshooting

### View Workflow Runs
- https://github.com/Morne004/advnaced-react-table/actions

### Common Issues

**Issue:** "npm ERR! 403 Forbidden"
- **Fix:** Verify NPM_TOKEN is correctly set in GitHub Secrets
- **Check:** Token has publish permissions

**Issue:** "Version X.X.X already exists"
- **Expected behavior:** Workflow will skip publishing
- **Action:** Bump version with `npm version patch/minor/major`

**Issue:** Build fails
- **Check:** Run `npm run build` locally first
- **Verify:** All dependencies are in package.json (not just devDependencies)

**Issue:** Git tag already exists
- **Fix:** Delete the tag locally and remotely:
  ```bash
  git tag -d vX.X.X
  git push origin :refs/tags/vX.X.X
  ```

## Versioning Best Practices

### Semantic Versioning (SemVer)

Follow semantic versioning: `MAJOR.MINOR.PATCH`

- **PATCH** (1.3.0 → 1.3.1): Bug fixes, no breaking changes
  ```bash
  npm version patch
  ```

- **MINOR** (1.3.0 → 1.4.0): New features, backward compatible
  ```bash
  npm version minor
  ```

- **MAJOR** (1.3.0 → 2.0.0): Breaking changes
  ```bash
  npm version major
  ```

### Workflow Integration

The `npm version` command will:
1. Update version in `package.json`
2. Create a git commit with message "X.X.X"
3. Create a local git tag `vX.X.X`

Then just push:
```bash
git push origin main  # Triggers workflow
```

**Note:** The workflow will create the tag on GitHub, so you don't need to push tags separately.

## Disabling the Workflow

If you need to temporarily disable automated publishing:

1. Go to: https://github.com/Morne004/advnaced-react-table/actions/workflows/publish.yml
2. Click the **⋯** menu → **Disable workflow**

Or delete the workflow file:
```bash
git rm .github/workflows/publish.yml
git commit -m "Disable automated publishing"
git push
```

## Manual Publishing Fallback

If GitHub Actions is unavailable, you can still publish manually:

```bash
npm run build
npm publish --access public
git tag -a v1.4.0 -m "Release v1.4.0"
git push origin v1.4.0
```

## Next Steps

After setup is complete, your typical release workflow will be:

1. Make changes and commit to main
2. When ready to release:
   ```bash
   npm version patch  # or minor/major
   git push
   ```
3. Watch the magic happen at: https://github.com/Morne004/advnaced-react-table/actions

That's it! GitHub Actions will handle the rest automatically.

## Questions?

If you encounter issues:
- Check the Actions tab for detailed logs
- Verify NPM_TOKEN secret is set correctly
- Ensure package.json version is new
- Check that .npmrc is NOT committed (it's gitignored)
