<p align="center">
  <img src="assets/refurbtrack-logo.png" alt="RefurbTrack logo" width="144">
</p>

<h1 align="center">RefurbTrack</h1>

<p align="center">Track repairs, record costs, and see what each phone earns.</p>

A mobile phone refurbishment cost and profit tracker for AJ Cellphone Repair Shop and Accessories, Tagum City. Built for CCE 106/L Application Development and Emerging Technologies at UM Tagum College.

## Get the Android app

**[Download RefurbTrack 1.1.1 APK](https://expo.dev/artifacts/eas/XkHFCGStGwM9RVbadX90zHpzn0YztxCiSWaGQ8iEkUM.apk)** · **[View the latest Expo build](https://expo.dev/accounts/wrnzn/projects/RefurbTrack/builds/ff2e2b74-a4cd-4009-aa3f-b9811916ea63)**

Android preview · Version **1.1.1** · Build **4** · September 27, 2026.
This release fixes PDF export in installed Android builds and adds copyable, shareable error details.

## App previews

Four views of a new shop, before phone records are added. Browser controls have been cropped out; the app content is unchanged.

| Welcome | Workshop overview |
| :---: | :---: |
| <img src="assets/screenshots/welcome.png" alt="RefurbTrack welcome screen with sign-in and account creation" width="260"> | <img src="assets/screenshots/workshop.png" alt="Workshop totals, repair shortcuts, and activity calendar" width="260"> |
| Sign in and start tracking phones. | See invested money, results, and shop activity. |

| Customer intake | Record filters |
| :---: | :---: |
| <img src="assets/screenshots/customer-intake.png" alt="Add a phone with Customer Repair selected and device condition fields" width="260"> | <img src="assets/screenshots/record-filters.png" alt="Filter phone records by job type, status, and intake date" width="260"> |
| Record the device and choose its workflow. | Find jobs by type, status, or date. |

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

## Run locally

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
