# Verification record

Verified on September 25, 2026. Fictional fixtures were used throughout; these results are not client acceptance or evidence of business improvement.

APK and document delivery checks completed September 26. The downloaded APK is 78,996,054 bytes; its ZIP integrity, Android manifest, and bundled application were checked. SHA256: `C45DC24FD17F9F76899186809654F94BFBD78193A8B6A675AED18DCAD325F013`. The Word documentation has 15 reviewed pages, the spiel has two reviewed pages, and the PowerPoint has 11 reviewed slides with package/layout/import validation. See [design review](design-review.md) for the scoped Anti Slop evidence and remaining interaction checks.

## Completed checks

| Area | Evidence |
| --- | --- |
| Financial and workflow rules | 20 Node tests passed, including exact centavo arithmetic, resale and customer repair, zero-cost resale, expenses, payment, write-off, filters, and validation. |
| Expo project | Expo Doctor: 21/21 checks passed after updating Expo to 57.0.25. |
| Bundling | Web export passed with Firebase configuration and cleared cache. Android JavaScript export passed. These checks alone do not produce an APK. |
| Firebase setup | Email/password Authentication enabled. Firestore `(default)` is in `asia-southeast1`, standard free tier. Repository rules deployed successfully. |
| Live authentication | Two disposable users signed up; signing out and signing back in succeeded. |
| Live access control | Owner create/read/delete passed. Unrelated-user reads, collection listing, writes, and anonymous reads were denied. Negative purchase and stale-version writes were rejected. |
| Staff membership | Self-assignment was denied. An administrator-provisioned active member could read and update the owner's records. Revoking membership denied a new server read. Test users and fixtures were removed. |
| Browser resale walkthrough | Purchase PHP 2,000 + parts PHP 800 + paid labor PHP 200; sale PHP 4,500; displayed profit PHP 1,500. Required blank brand produced feedback. |
| Browser cloud repair walkthrough | Signed in to a fresh disposable account; created Customer Repair; added PHP 800 parts and edited to PHP 750; recorded diagnosis and PHP 900 estimate; marked Ready for Pickup; charged PHP 1,200 and released. Displayed profit PHP 450; estimate did not increase investment. |
| Persistence and discovery | Browser reload retained the signed-in session and cloud record. History/search found the completed repair. Resale filter excluded it; repair/status/date filters included it. |
| Visual checks | Inspected phone-width screens at 390 × 844. Text remained readable and controls fitted the viewport. Keyboard focus outline was visible. White on teal is 6.40:1; muted text on page background is 5.85:1; input borders against white are 3.21:1. |

## Android release

Application source and submission materials were committed and pushed to `main` as `8c143c4` (Lab 14). Later documentation-only handoff updates do not change the built application.

Expo project: https://expo.dev/accounts/wrnzn/projects/RefurbTrack

Build ID: `bb99acb3-d31b-443a-b553-57dc538bec52`

Build page: https://expo.dev/accounts/wrnzn/projects/RefurbTrack/builds/bb99acb3-d31b-443a-b553-57dc538bec52

EAS reports FINISHED. [Download the signed APK](https://expo.dev/artifacts/eas/AFSWm4dG2o5aDhuHZv7V9IiKrdvmiDJ6XZZ0Nx4hsrw.apk). A local copy is in `releases/RefurbTrack-1.0.0-preview.apk` (excluded from Git). The preview profile creates an internally distributed APK with Firebase client configuration. Signing credentials are managed by EAS.

## Checks the group must complete on the installed APK

- Install on a physical Android phone; record device model, Android version, tester, date, and this build ID.
- Stop the development server, disconnect the cable, and open the installed app icon without Expo Go.
- Create a fresh staff account, complete both job types, close/reopen the app, and verify saved records and session restoration.
- Exercise reset-password delivery with your own email, sign-out, approved shared workspace, expense removal, reopen, write-off, delete/cancel, and JSON sharing.
- Check the on-screen keyboard, Android Back, text scaling, TalkBack, slow/offline connection, and recovery. Browser testing cannot establish these native behaviors.
- Rehearse the actual five-minute pitch and three-minute walkthrough aloud. Obtain and record the beneficiary's real acceptance decision.

## Known limits

Cloud writes require internet. Practice records are separate, local-only data. The list loads all records and is intended for a small shop dataset. History retains the latest 100 changes; each record supports at most 200 expenses. Owner and active staff have equal record permissions. Firestore rules enforce account boundaries, top-level fields and versions, but do not validate every nested expense/history element; deploy only to trusted internal staff, and harden these nested schemas before wider untrusted use. Export is JSON, with no in-app restore interface. Header/system Back can leave a form without the explicit Cancel confirmation. The browser automation could not complete a native browser confirmation dialog, so destructive/reopen confirmation paths remain a manual check. Native device behavior, performance targets, and client acceptance are not marked passed.
