# F1 Rankings

F1 Rankings is a spoilerless Formula 1 standings viewer. Select a completed race or sprint to see the drivers' and constructors' championship points **before** that event, making it easier to catch up on the season without revealing a result.

## Features

- Includes completed races and sprint events.
- Shows standings from the event immediately before the selected event.
- Handles loading, empty, and API error states.
- Uses the [OpenF1 API](https://openf1.org/) for live session and championship data.

## Run locally

```bash
cd react-app
npm install
npm run dev
```

The production build can be checked with:

```bash
npm run lint
npm run build
```

## Project structure

- `src/App.jsx` contains the main React UI and data-loading flow.
- `src/services/openF1Service.js` contains the OpenF1 API integration and session filtering.
- `src/App.css` and `src/index.css` contain the responsive presentation styles.

## Data and limitations

The app requires network access to the OpenF1 API.
