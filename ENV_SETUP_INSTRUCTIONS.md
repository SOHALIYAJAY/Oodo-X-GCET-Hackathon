# How to Create .env File - Step by Step Guide

## Method 1: Using PowerShell (Windows) ✅ RECOMMENDED

The `.env` file has been created automatically using PowerShell. Verify it exists by checking the root directory.

If you need to create it manually:

```powershell
# Navigate to project root (if not already there)
cd C:\dayflow-hr-suite-main\dayflow-hr-suite-main

# Create the .env file
Set-Content -Path .env -Value "VITE_API_URL=http://localhost:5000/api"
```

## Method 2: Using Command Prompt (Windows)

```cmd
cd C:\dayflow-hr-suite-main\dayflow-hr-suite-main
echo VITE_API_URL=http://localhost:5000/api > .env
```

## Method 3: Using Text Editor (Any OS)

1. Open your text editor (Notepad, VS Code, etc.)
2. Create a new file
3. Add this single line:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Save the file as `.env` (with the dot at the beginning) in the root directory:
   - Location: `C:\dayflow-hr-suite-main\dayflow-hr-suite-main\.env`
   - **Important**: Make sure the filename is exactly `.env` (not `.env.txt`)

### VS Code Instructions:
1. Right-click in the file explorer (root directory)
2. Select "New File"
3. Type `.env` as the filename
4. Add the content: `VITE_API_URL=http://localhost:5000/api`
5. Save (Ctrl+S)

## Method 4: Using Git Bash (Windows/Mac/Linux)

```bash
cd /c/dayflow-hr-suite-main/dayflow-hr-suite-main
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## Verify the File Was Created

Check if the file exists:
```powershell
Get-Content .env
```

You should see:
```
VITE_API_URL=http://localhost:5000/api
```

## File Location

The `.env` file should be in the **root directory** of your project:
```
dayflow-hr-suite-main/
├── .env                    ← HERE (root directory)
├── package.json
├── src/
├── backend/
└── ...
```

## Important Notes

1. **File Name**: Must be exactly `.env` (not `.env.txt` or `env.txt`)
2. **Location**: Must be in the root directory (same level as `package.json`)
3. **No Spaces**: Make sure there are no spaces around the `=` sign
4. **Git**: The `.env` file is typically ignored by git (should be in `.gitignore`)
5. **Restart**: After creating/editing `.env`, restart your development server

## Troubleshooting

### File shows as `.env.txt`
- This happens in Windows if "Hide extensions for known file types" is enabled
- Rename it to remove the `.txt` extension
- Or disable "Hide extensions" in File Explorer options

### File not being read by Vite
- Make sure the file is named exactly `.env`
- Make sure it's in the root directory (not in `src/` or `backend/`)
- Restart the development server after creating the file
- Environment variables in Vite must start with `VITE_`

### Can't see the file in File Explorer
- Enable "Show hidden files" in File Explorer options
- Or use VS Code/Command Line to verify the file exists
