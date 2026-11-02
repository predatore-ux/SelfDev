# Deployment

SELFDEV is a static web application. Publish the contents of `dist/`; do not publish the repository root. The application works at a domain root or beneath a path such as `/SelfDev/` because asset URLs are relative and navigation uses URL fragments.

## Release checks

Use Node.js 22 or newer. There are no package dependencies to install.

```sh
npm run check
npm test
npm start
```

Open the printed address and check a complete journey before deploying changes. The automated HTTP tests open temporary loopback ports. GitHub Actions runs the checks on Node.js 22 and 24 for pushes and pull requests.

## Static hosting

- **Netlify:** Import this repository. `netlify.toml` sets the publish directory to `dist`. Leave the build command empty.
- **Cloudflare Pages:** Connect the repository, choose no framework, leave the build command empty, and set the output directory to `dist`.
- **GitHub Pages:** Publish `dist` as the Pages artifact through a deployment workflow. No SPA rewrite is needed.
- **Other hosts:** Upload the contents of `dist`. Serve `.js` files as JavaScript and `.svg` files as SVG.

`dist/_headers` supplies a Content Security Policy and related headers on hosts that support that format. Other hosts must set equivalent headers in their own configuration; the provided Node server demonstrates them. GitHub Pages does not apply `_headers` files.

## Node hosting

Run `npm start`. The default binding is `127.0.0.1:4173`. For a container or managed Node service, set `HOST=0.0.0.0` and `PORT` to the port assigned by the host. Put the service behind HTTPS. The server serves only an explicit list of public assets.

## Data and privacy

There are no server-side accounts, analytics, third-party font requests, or AI requests. The browser stores drafts and notes in localStorage. Notes are not encrypted, synchronized, or backed up remotely. Clearing browser data removes them. A different hostname or browser has a separate storage area. Users can download their notes and current draft as JSON; re-import is not yet supported. Avoid entering sensitive information on shared devices.

## Product scope

Release 0.1.0 is an early-access learning experience with three curated paths. It does not interpret arbitrary text, assess open-ended answers, evaluate language proficiency, or provide medical advice. Do not market it as a complete adaptive learning system. Live lesson generation and accounts require a separate backend design and evaluation.
