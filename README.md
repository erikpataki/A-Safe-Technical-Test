# A‑Safe Technical Test — Jokes App

Full‑stack app to browse random jokes with category filtering, history navigation, and a custom cursor.

## Repo layout
- node.js-backend — Node.js + SQLite API
- a-safe-technical-test — React frontend

## Features
- Random jokes from SQLite
- Dynamic categories from DB
- Multi‑select dropdown for categories
- Click navigation:
  - Left half = previous joke
  - Right half = next joke or reveal punchline
- Custom cursor

## Prerequisites
- Node.js 18+ and npm

## Quick start

Open two terminals.

Terminal 1 - API:
```powershell
cd .\node.js-backend
npm install
npm start
# (optional) seed once: npm run seed
```

Terminal 2 - Web:
```powershell
cd .\a-safe-technical-test
npm install
npm start
```

- API: http://localhost:5000
- App: http://localhost:3000

## API
- GET /api/types
  - Returns distinct joke types (strings), ordered.
- GET /api/jokes/random?types=type1,type2
  - Returns one random joke filtered by optional CSV list of types.

Example:
```
GET http://localhost:5000/api/jokes/random?types=general,programming
```

## Usage
- Select categories in the dropdown (top‑center). Selection applies on the next “next” joke.
- Click right half:
    1. If no joke: fetch and show setup
    2. Reveal punchline
    3. Next joke
- Click left half: go to previous joke in history.
- Category changes trim forward history but keep the current joke shown.

## Configuration
- Backend port: 5000 (update in node.js-backend/index.js if needed)
- Frontend expects backend at http://localhost:5000

## Data import (if needed)
1. Download raw file from https://github.com/15Dkatz/official_joke_api/blob/master/jokes/index.json
2. Copy into `.\node.js-backend` folder

```powershell
cd .\node.js-backend
node .\import_jokes.js
```

## Troubleshooting
- CORS/errors: ensure backend is running on 5000 before starting the frontend.
- Empty results after filtering: broaden selection or clear filters.
- Custom cursor image: change size via the size prop on CustomCursor in `App.js`.

## Credits
- Jokes dataset: https://github.com/15Dkatz/official_joke_api