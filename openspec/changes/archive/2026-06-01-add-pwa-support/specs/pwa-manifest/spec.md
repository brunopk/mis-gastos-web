## ADDED Requirements

### Requirement: Web app manifest is present and valid
The app SHALL include a `manifest.webmanifest` file linked from `index.html` containing at minimum: `name`, `short_name`, `icons` (192 × 192 and 512 × 512), `display`, `theme_color`, `background_color`, and `start_url`.

#### Scenario: Manifest is discoverable
- **WHEN** a browser loads the app
- **THEN** it SHALL find a `<link rel="manifest">` tag in `index.html` pointing to a valid `manifest.webmanifest`

#### Scenario: Manifest contains required fields
- **WHEN** the manifest is parsed
- **THEN** it SHALL include `name`, `short_name`, `icons`, `display: "standalone"`, `theme_color`, `background_color`, and `start_url`

### Requirement: App is installable on Android
The app SHALL meet Chrome's installability criteria so that users on Android are offered the native "Add to Home Screen" prompt.

#### Scenario: Install prompt appears on Android Chrome
- **WHEN** a user visits the app on Android Chrome and has not previously installed it
- **THEN** the browser SHALL display the native install prompt

#### Scenario: App launches in standalone mode after install
- **WHEN** a user opens the app from the Android home screen
- **THEN** the app SHALL launch without browser chrome (address bar and navigation controls hidden)

### Requirement: App is manually installable on iOS
The app SHALL support "Add to Home Screen" on iOS Safari via the share sheet, without requiring a native install prompt.

#### Scenario: App icon appears correctly on iOS home screen
- **WHEN** a user adds the app to their iOS home screen
- **THEN** the home screen icon SHALL use the image defined in the manifest and display the correct app name

#### Scenario: App launches in standalone mode on iOS
- **WHEN** a user opens the app from the iOS home screen
- **THEN** the app SHALL launch without the Safari browser chrome

### Requirement: Service worker is registered
The app SHALL register a service worker (`firebase-messaging-sw.js`) on load to enable installability and support future push notification integration.

#### Scenario: Service worker registers successfully
- **WHEN** the app loads in a supported browser
- **THEN** a service worker SHALL be registered and its status SHALL be `activated`

#### Scenario: Service worker does not break the auth redirect
- **WHEN** the browser follows the Google OAuth redirect back to the app
- **THEN** the service worker SHALL NOT intercept or modify the redirect URL
