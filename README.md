# SelfDev

Micro-learning powered by your daily life. Connect what you see and do directly to your personal and professional growth, one daily habit at a time.

SELFDEV helps people explore useful ideas from other fields and apply them to activities they already do. This early-access release includes three guided paths: everyday decisions, university group work, and communication in a language being learned.

## Run

Requires Node.js 22 or newer. No dependency installation or build step is needed.

```sh
npm start
```

Open the address printed by the server. To check the release:

```sh
npm run check
npm test
```

## Experience

1. Bring a real activity or try a supplied example.
2. Explore a useful idea with examples, feedback, and an optional interactive simulation.
3. Map the connection to the situation.
4. Choose a small step and identify evidence to look for.
5. Save the practice and return to reflect.

Drafts restore after reload. Re-saving a practice updates its existing note. Notes and the current draft can be downloaded as JSON. The most recent removal can be undone while the page remains open.

## Structure

```text
dist/
  index.html          Application shell
  app.js              Screens, navigation, and interactions
  content.js          Curated learning paths
  state.js            Storage validation and simulation logic
  style.css           Core layout and visual styles
  accessibility.css   Focus, reflow, and motion adjustments
  icon.svg            App icon
  _headers            Static-host response headers
tests/                State and HTTP server regression checks
server.mjs            Dependency-free local and Node-hosted server
```

## Hosting

Publish `dist/` on a static host, or run the Node server behind HTTPS. See [DEPLOYMENT.md](DEPLOYMENT.md) for configuration, privacy details, and release boundaries.

## Current boundaries

The learning paths are curated. The app does not analyse free text, call an AI service, grade open-ended answers, or assess skill mastery. The feedback simulation is illustrative and does not model a body or prescribe health interventions.

Drafts and practice notes stay in localStorage in the current browser and origin. There are no accounts, remote backups, analytics, third-party fonts, or runtime dependencies. A downloaded file is a backup for reading; importing it is not yet supported.
