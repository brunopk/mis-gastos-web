## 1. Dependencies & Build Config

- [x] 1.1 Install `vite-plugin-pwa` as a dev dependency
- [x] 1.2 Configure `vite-plugin-pwa` in `vite.config.ts` with `strategies: 'injectManifest'` and `filename: 'firebase-messaging-sw.js'`
- [x] 1.3 Create `src/sw.ts` with the `self.__WB_MANIFEST` placeholder passed to Workbox

## 2. Web App Manifest

- [x] 2.1 Create the manifest config in `vite.config.ts` with `name`, `short_name`, `display: 'standalone'`, `theme_color`, `background_color`, and `start_url`
- [x] 2.2 Generate app icons: 192 × 192, 512 × 512, and maskable variant from a single SVG/PNG source
- [x] 2.3 Reference the generated icons in the manifest config
- [x] 2.4 Verify `<link rel="manifest">` is present in the built `index.html`

## 3. iOS Support

- [x] 3.1 Add `apple-touch-icon` `<link>` tag to `index.html` pointing to the app icon
- [x] 3.2 Add `<meta name="theme-color">` to `index.html`
- [ ] 3.3 Manually verify "Add to Home Screen" works on iOS Safari and the icon and app name appear correctly

## 4. Auth Redirect Protection

- [x] 4.1 Configure `navigateFallbackDenylist` in `vite.config.ts` to exclude the Google OAuth callback URL

## 5. Verification

- [ ] 5.1 Run `vite build` and confirm `firebase-messaging-sw.js` and `manifest.webmanifest` are present in the `dist/` output. Note: `yarn build` (tsc + vite) fails due to pre-existing TS errors unrelated to this change. Run `vite build` directly to verify PWA output.
- [ ] 5.2 Open the app in Chrome DevTools → Application → Manifest and confirm all fields are valid
- [ ] 5.3 Open Chrome DevTools → Application → Service Workers and confirm the SW status is `activated`
- [ ] 5.4 Run Lighthouse PWA audit and confirm installability criteria pass
- [ ] 5.5 Test on Android Chrome: confirm the native install prompt appears
