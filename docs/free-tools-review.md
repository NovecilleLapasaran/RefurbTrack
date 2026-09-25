# Free tools reviewed through PinoyFreeCoder

Reviewed September 25, 2026 for the existing RefurbTrack scope. Catalog labels were checked against live sources; a catalog listing is not proof of current availability.

| Candidate | Evidence | Decision |
| --- | --- | --- |
| Phone Specification by azharimm | PinoyFreeCoder returned https://github.com/azharimm/phone-specs-api. Its README points to api-mobilespecs.azharimm.dev. The documented host failed DNS resolution during this review. | Do not add a runtime dependency. Manual brand/model intake remains available. Re-evaluate only after live availability and data licensing are established. |
| Phone Specs on Railway | Catalog URL https://phone-specs-api-production.up.railway.app/docs returned HTTP 404. | Not integrated. |
| scrcpy | PinoyFreeCoder returned https://github.com/Genymobile/scrcpy. GitHub reports Apache-2.0 licensing and an unarchived repository. | Adopt as an optional free demo tool. It mirrors an installed Android app; it does not replace APK testing. |
| Cloudmersive phone validation | Requires an API key; contact validation is not a core requirement. | Not needed for the MVP. |

No shop records, customer references, or financial data were sent to these APIs. No device specifications, valuations, AI diagnosis, or market prices are claimed by the app. The presentation uses the existing source paper and locally verified fictional examples.

## Optional classroom phone projection with scrcpy

Use the official Windows instructions at https://github.com/Genymobile/scrcpy/blob/master/doc/windows.md. One installation option is `winget install --exact Genymobile.scrcpy`; verify the package publisher and current instructions before installation.

On a team-owned Android phone, enable Developer options and USB debugging for the tech run. Connect a data-capable USB cable, unlock the phone, and approve only the trusted presentation computer. Run `scrcpy --no-audio --max-size=1280 --window-title=RefurbTrack`. Turn off USB debugging after use if no longer needed. Do not approve an unknown computer.

Before projection, prove the installed APK opens with the development server stopped and the cable disconnected. Reconnect only to mirror the phone for the audience. Use Do Not Disturb and fictional demo records to prevent personal notifications or customer data from appearing on the projector. Prepare a spare cable and a short backup recording made from the actual app after testing.
