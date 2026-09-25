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
- Activity history, confirmation before deletion, input validation, and JSON export.
- Clearly labeled practice workspace with local persistence for rehearsal.

## Financial rules

Total investment = purchase price + parts expenses + paid labor expenses.

Recorded profit/loss = final revenue − total investment. Open jobs are excluded from realized profit. A write-off recognizes accumulated investment as a loss. Customer repairs have purchase price zero; a zero-cost resale remains a resale. The app stores whole centavos and excludes rent, tax, and other overhead from this calculation.

## Built with

React Native 0.86, Expo SDK 57, React 19, React Navigation, Firebase Authentication, Cloud Firestore, and AsyncStorage for practice data and native auth persistence. Native React Native controls provide the interface. Firebase Storage and accessory inventory remain outside this release.

## Run

The Android preview APK has been built: [download RefurbTrack 1.0.0](https://expo.dev/artifacts/eas/AFSWm4dG2o5aDhuHZv7V9IiKrdvmiDJ6XZZ0Nx4hsrw.apk). [EAS build record](https://expo.dev/accounts/wrnzn/projects/RefurbTrack/builds/bb99acb3-d31b-443a-b553-57dc538bec52). Install and complete the physical-device checks before presenting; cloud tests and browser walkthroughs have passed.

Requires Node.js 22.13 or newer.

```powershell
npm ci
npm test
npx expo start
```

Without Firebase environment values, the app explicitly offers practice mode. To enable the cloud workspace and create an installable Android APK, follow [setup and packaging](docs/SETUP.md). `eas.json` includes an APK preview profile.

## Course deliverables

- [Lab 14 demo script and scheduled demo](demo-script.md)
- [Submission dates and checklist](docs/submission-checklist.md)
- [Verification evidence and remaining device checks](docs/verification.md)
- [Free tools reviewed through PinoyFreeCoder](docs/free-tools-review.md)
- Documentation, pitch deck, and five-minute spiel are in `submission/alejo blagantio galvez lapasaran/`.

An Expo JavaScript export is not an APK. The deployment checklist records the cloud-build and physical-device status separately. The client acceptance form requires the beneficiary's actual decision and signature.

## Authors

Joseph D. Alejo, Ynoid Dan M. Blagantio, Ace Jerald C. Galvez, and Novecille Lapasaran.

Instructor: Maricel Timbal. Repository: https://github.com/NovecilleLapasaran/RefurbTrack.
