# RefurbTrack

A mobile phone refurbishment cost and profit tracker for AJ Cellphone Repair Shop and Accessories, Tagum City. Built for CCE 106/L Application Development and Emerging Technologies at UM Tagum College.

## Features

- Explicit Buy & Resell and Customer Repair workflows, including zero-cost acquisitions.
- Staff sign-up, login, password reset, and persistent sessions through Firebase Authentication when configured.
- Private workspaces and shared shop records for administrator-approved staff.
- Phone intake, diagnosis, repair estimates, editable parts and paid-labor expenses.
- Status changes, sale/customer payment, write-offs, and automatic profit/loss.
- Search by brand, model, status, source, or ID, plus job-type and intake-date filters.
- Dashboard separating open investment from realized profit and revenue.
- Activity history, confirmation before deletion, input validation, and readable PDF reports.
- Interactive activity calendar with daily updates and links to phone records.
- Comfortaa headings, navy/teal surfaces, bottom sheets, native date selection, and accessible password reveal.
- Saved light/dark appearance, reduced-motion support, and centered loading states.
- Shop PDF reports with readable filenames, the app icon, and repeating table headers.
- Readable error messages with expandable, copyable and shareable diagnostics.

## Financial rules

Total investment = purchase price + parts expenses + paid labor expenses.

Recorded profit/loss = final revenue − total investment. Open jobs are excluded from realized profit. A write-off recognizes accumulated investment as a loss. Customer repairs have purchase price zero; a zero-cost resale remains a resale. The app stores whole centavos and excludes rent, tax, and other overhead from this calculation.

## Built with

React Native 0.86, Expo SDK 57, React 19, React Navigation, Firebase Authentication, Cloud Firestore, and AsyncStorage for native auth persistence. React Native Reusables compositions, Gorhom sheets, Reanimated, Lucide, and Expo Haptics provide shared controls and feedback. Firebase Storage and accessory inventory remain outside this release.

Version 1.1.1 fixes PDF artwork loading in installed Android builds and adds error diagnostics. All 33 automated tests and Android/web JavaScript exports pass. Physical Android testing of this version is still pending.

## Run

The Android preview APK has been built: [download the previous RefurbTrack 1.0.0](https://expo.dev/artifacts/eas/AFSWm4dG2o5aDhuHZv7V9IiKrdvmiDJ6XZZ0Nx4hsrw.apk). [EAS build record](https://expo.dev/accounts/wrnzn/projects/RefurbTrack/builds/bb99acb3-d31b-443a-b553-57dc538bec52). Install and complete the physical-device checks before presenting; cloud tests and browser walkthroughs have passed.

Requires Node.js 22.13 or newer.

```powershell
npm ci
npm test
npx expo start
```

Without Firebase environment values, sign-in is unavailable. To enable the cloud workspace and create an installable Android APK, follow [setup and packaging](docs/SETUP.md). `eas.json` includes an APK preview profile.

## Repository contents

Source code, tests, setup instructions, and [design sources](docs/design-sources.md) are included. Local assistant settings, skills, course deliverables, generated reports, build output, and private environment files are excluded.

An Expo JavaScript export is not an APK. Build and test an installed Android APK before release.

## Authors

Joseph D. Alejo, Ynoid Dan M. Blagantio, Ace Jerald C. Galvez, and Novecille Lapasaran.

Instructor: Maricel Timbal. Repository: https://github.com/NovecilleLapasaran/RefurbTrack.
