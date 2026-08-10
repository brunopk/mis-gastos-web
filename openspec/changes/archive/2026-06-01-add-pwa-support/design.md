## Context

Mis Gastos is a Vite + React SPA with no service worker or web app manifest. It is primarily used on mobile to log daily expenses. The build toolchain is Vite 6, which has first-class PWA support via `vite-plugin-pwa`.

## Goals / Non-Goals

**Goals:**

- Make the app installable on Android and iOS home screens
- Service worker architecture that supports future push notification integration

**Non-Goals:**

- Offline or cached data access (future idea — see proposal)
- Push notification triggering (backend + VAPID keys out of scope for this change)
- Server-side rendering or edge caching changes

## Decisions

### 1. Use `vite-plugin-pwa` with `injectManifest` mode

`vite-plugin-pwa` is a Vite community plugin that wraps Workbox and wires it into the build pipeline. It supports two modes; `injectManifest` is chosen here.

`injectManifest` is a mode set via `strategies: 'injectManifest'` in `vite.config.ts`. It means: "I'll write the service worker file myself — just inject the list of assets to precache into it at build time." Concretely: you write `src/sw.ts` (regular TypeScript that runs in the browser's SW context); at build time, Vite compiles and fingerprints all static assets (JS chunks, CSS, HTML), and `vite-plugin-pwa` takes that list and writes it directly into your `src/sw.ts` as a variable called `self.__WB_MANIFEST` — literally replacing a placeholder with an array like `[{ url: '/assets/index-abc123.js' }, { url: '/assets/style-def456.css' }, ...]`. Your code passes that array to Workbox so it knows which files to cache when the SW installs. You never maintain that list manually — it's always in sync with what Vite produced. Everything else in the file — event handlers, custom logic — is yours to write freely.

The output SW file is named `firebase-messaging-sw.js` from the start, configured via the `filename` option in `vite-plugin-pwa`. Firebase Cloud Messaging (FCM) requires this exact filename — the FCM SDK hardcodes it and won't register otherwise. Naming it this way upfront avoids a rename when push notifications are added, and since the file also owns all other SW logic (Workbox, future custom handlers), the name reflects FCM's constraint rather than the file's full responsibility — a known FCM quirk accepted by the community.

_Alternative considered_: `generateSW` — rejected because it produces a fully Workbox-managed SW with no hook points for custom event handlers, and does not output `firebase-messaging-sw.js` by default. The alternative, `generateSW`, produces a SW file entirely owned by Workbox with no hook points for custom code. Adding a `push` event listener later would require switching modes, creating `src/sw.ts`, and migrating the Workbox config into it — a structural change to the project and build pipeline, not just a feature addition. Choosing `injectManifest` now means a future push notification change only needs to write the handler, nothing else.

_Alternative considered_: two separate files (`sw.js` + `firebase-messaging-sw.js` via `importScripts`) — rejected. The split is artificial: both files share the same runtime context and can interfere with each other, but any change to SW behavior requires knowing which file owns what. Over time it becomes unclear where new logic should live.

_Alternative considered_: hand-rolling a service worker — rejected. Without Workbox, the SW must manually implement the install/activate lifecycle, cache versioning, request interception, and cache cleanup on updates. Workbox handles all of this; writing it from scratch adds complexity with no benefit.

### 2. Manifest display mode: `standalone`

`standalone` hides the browser's address bar and navigation controls entirely — the app looks and feels like a native app. `minimal-ui` keeps a minimal browser bar with back/forward/refresh controls visible.

`standalone` is chosen because Mis Gastos is a focused utility app: the user opens it, logs an expense, closes it. All navigation is handled internally by React Router, so browser controls add no value and make the app feel like a website rather than an installed app.

### 4. Icons: generate from a single SVG source

Use a single high-res SVG/PNG source and generate the required sizes (192 × 192, 512 × 512, maskable variant). This avoids maintaining multiple bitmaps manually.

## Risks / Trade-offs

- **Stale content after deploy** → The browser activates the new SW on the next natural page load. If in-progress form data loss becomes a concern, a prompt-to-reload toast can be added later.
- **iOS limitations** (no install prompt, partial SW support in older Safari) → Acceptable; Android is the primary mobile target. iOS users can still "Add to Home Screen" manually.
- **Service worker interfering with auth redirects** → NavigationRoute must not intercept the Google OAuth redirect. Configure `navigateFallbackDenylist` to exclude the auth callback URL.

## Migration Plan

Rollback: remove `vite-plugin-pwa` from `vite.config.ts` and delete `src/sw.ts`. The browser will unregister the SW on the next load automatically.

**Extending the SW in the future** (e.g. push notifications): add the new logic directly to `src/sw.ts` — it's a plain TypeScript file. For FCM specifically, import and initialize the Firebase messaging SDK inside `src/sw.ts` and add a `push` / `onBackgroundMessage` handler. No changes to `vite.config.ts` or the build pipeline are needed.

**Splitting the SW into smaller files**: use standard ES module `import` statements in `src/sw.ts`. Since `vite-plugin-pwa` processes the file through Vite's build pipeline, it gets bundled like any other TypeScript file — the browser always receives a single `firebase-messaging-sw.js`. For example:

```ts
// src/sw.ts
import { registerRoutes } from './sw-routing'
import { initMessaging } from './sw-messaging'
```

## Open Questions

- **iOS install discoverability**: There is no native install prompt on iOS — users must know to tap "Share → Add to Home Screen" manually. Should the app surface an in-app hint for iOS users?
