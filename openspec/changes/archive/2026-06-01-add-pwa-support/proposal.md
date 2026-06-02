## Why

Mis Gastos is used on mobile to track everyday expenses, but currently requires a browser to access it every time. Adding PWA support lets users install the app to their home screen and access it offline or with a poor connection, matching the experience of a native app without the need for app store distribution.

## What Changes

- Add `vite-plugin-pwa` (a thin wrapper around Workbox) to configure a service worker and web app manifest automatically at build time.
- Create a `manifest.webmanifest` with app name, icons, theme color, and display mode
- Register a service worker to enable installability and future push notification support
- Add installability metadata (viewport, theme-color) to `index.html`

**What is Workbox?** Workbox is a Google-maintained JavaScript library that runs inside a service worker and handles the boilerplate of caching strategies, routing rules, and push event handling.

## Capabilities

### New Capabilities

- `pwa-manifest`: Web app manifest enabling home screen installation on mobile and desktop, including app name, icons, display mode, and theme color

### Modified Capabilities

_(none — no existing spec-level requirements change)_

## Impact

- **Files**: `vite.config.ts`, `index.html`, new icon assets
- **Dependencies**: adds `vite-plugin-pwa` (dev dependency)
- **Build output**: service worker (`sw.js`) and manifest generated at build time
- **No breaking changes**

## Future Considerations

- **Offline caching**: once the service worker is in place, adding Workbox caching strategies (precache for static assets, network-first for API calls) would allow the app to load and browse expenses without a network connection.
