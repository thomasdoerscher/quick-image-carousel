# Quick Image Carousel

A timeboxed exercise in frontend feature development with Claude Opus 5.5

**Development time:** 90 minutes

**Features:**
- Image selection from thumbnails
- Carousel navigation
- Keyboard navigation
- Pull-down contact sheet view
- Light-dark theme toggle
- Test coverage

**Issues Noticed:**
- Unnecessary document-wide event handlers in place of providing even handlers to specific buttons
- Attempting to pass refs to child components without wrapping child in `forwardRef`

## Usage

After cloning repo run:
- `npm install`
- `npm run start`

Navigate to http://localhost:3000