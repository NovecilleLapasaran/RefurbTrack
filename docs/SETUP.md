# RefurbTrack setup and Android packaging

Firebase project: `refurbtrack-c4ed3`. Expo account: `wrnzn`.

## Firebase

1. Sign in to Firebase Console. In Authentication, enable the Email/Password provider.
2. Create a Cloud Firestore database in production mode. Choose a region appropriate for Philippine users, such as Singapore where available. Retain the region once created.
3. In Project settings, register a Web app named RefurbTrack. The Firebase JavaScript SDK uses this configuration even when running inside the Android app. Do not enable Hosting just to register the app.
4. Copy `.env.example` to `.env.local`. Fill the six `EXPO_PUBLIC_FIREBASE_*` values from the Web app configuration. These are public client identifiers; authorization comes from Firestore rules. Never put an admin service-account key in the app.
5. Sign in with `npx firebase-tools login`, then deploy the included rules:

```powershell
npx firebase-tools deploy --only firestore:rules --project refurbtrack-c4ed3
```

6. Restart Expo after changing environment variables. Sign up with a fresh test account and verify the empty workspace.

## Shared staff access

Every new account starts with a private workspace whose ID is its Firebase user ID. Administrators assign shared access using membership and profile documents, as described under "Staff setup" below. Owner and approved technicians have the same record permissions. The app never lets a user grant themselves membership.

Use two unrelated accounts to verify isolation. Then explicitly provision one staff member and verify sharing. Remove the membership or set `active: false` to revoke access.

## Run and validate

```powershell
npm ci
npm test
npx expo-doctor
npx expo start
```

For a browser build, run `npx expo export --platform web --output-dir web-build`. Android JavaScript packaging can be checked with `npx expo export --platform android --output-dir android-export`; this is not an APK.

## EAS preview APK

```powershell
npx eas-cli login
npx eas-cli whoami
npx eas-cli init
npx eas-cli build:configure --platform android
npx eas-cli env:push --environment preview --path .env.local
npx eas-cli build --platform android --profile preview
```

Use Expo account `wrnzn`, create/link RefurbTrack, and retain `eas.json` with `android.buildType: apk`. The preview build needs the Firebase values in its Expo environment at build time. Do not accept a build with a missing Firebase configuration as the final cloud-connected app. EAS may offer signing-credential creation; use credentials belonging to this project. Store builds use the production profile, which is separate from this class APK.

When the build succeeds, retain the build URL and APK URL. Download and install the APK on Android. Close the development server and confirm that the installed app still launches. Test sign-up, sign-in, persistence, both lifecycles, and account separation. JavaScript export alone does not verify the installed app.

## Recovery

Keep the last working APK and Git commit. If a new APK fails, restore the earlier source, rebuild using the same package and signing key with an appropriate higher Android version code, and install that build. Export records before destructive changes. Reverting app code does not undo database edits. Do not replace production data with practice data.
# Current project setup

Firebase `refurbtrack-c4ed3` is configured: Email/Password Authentication is enabled, Firestore is in Singapore (`asia-southeast1`) on the standard free tier, and the repository rules are deployed. Expo `@wrnzn/RefurbTrack` is linked and its preview environment contains the six Firebase public client values.

The previous 1.0.0 preview APK build finished successfully. [Download APK](https://expo.dev/artifacts/eas/AFSWm4dG2o5aDhuHZv7V9IiKrdvmiDJ6XZZ0Nx4hsrw.apk) or use the local file `releases/RefurbTrack-1.0.0-preview.apk`. Version 1.1.1 (Android build 4) needs a new APK build and physical-device checks. Rebuild the APK to include the new native clipboard module; refreshing the old installation does not install it.

The instructions below remain available for another developer to reproduce setup or prepare a later build.

## Staff setup without technical IDs in the app (1.1)

Users now sign in and open their assigned shop automatically. To link a staff
account, the project administrator finds its UID by email in Firebase Authentication,
creates `shops/{ownerUid}/members/{staffUid}` with `active: true`, then creates
`profiles/{staffUid}` with `shopId: ownerUid` and `shopName: "AJ Cellphone Repair Shop"`.
An owner can also have a profile with the same shop ID and display name.
Profiles can be read only by their own account and cannot be written by app users.
Membership rules still decide access; a profile alone never grants permission.
No profile means the account's own private records. After assignment, sign in again.
The user interface no longer exposes UIDs, manual workspace switching or JSON.
Practice storage remains internal for development; no welcome/sign-in entry is shipped.
