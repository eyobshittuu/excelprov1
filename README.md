# Excel Regex Pro 📊

Advanced regular expression operations and VLOOKUP for Excel files with a stunning dark theme.

## Features

✨ **Find & Replace with Regex** - Pattern library with 40+ pre-made patterns
🔍 **VLOOKUP** - Match data between sheets visually
📋 **Sheet Matching** - Find sheets by name patterns
🎨 **Modern Dark Theme** - Red and black cyberpunk design
📱 **Responsive UI** - Works on desktop and mobile

## Tech Stack

- **Frontend**: React + Modern CSS
- **Backend**: Python + FastAPI
- **Excel Processing**: openpyxl, pandas

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Server runs on `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm start
```
App opens at `http://localhost:3005`

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy:**
- Frontend: Vercel (free)
- Backend: Railway (free)

## Usage

1. Upload your Excel file (.xlsx)
2. Choose operation:
   - **Find & Replace**: Use pattern library or custom regex
   - **VLOOKUP**: Select sheets and columns from dropdowns
   - **Sheet Match**: Find sheets by pattern
3. Execute and download results

## Pattern Library Categories

- Phone Numbers (US, International)
- Email Addresses
- Dates (Multiple formats)
- Numbers & Currency
- Text Patterns
- IDs & Codes (SSN, ZIP, Credit Card, UUID)
- Web & URLs

## License

MIT

## Author

Built with ❤️ for making Excel operations easier
