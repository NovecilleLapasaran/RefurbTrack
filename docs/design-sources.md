# Design sources and implementation

The following user-supplied repositories were cloned into `working/design-references`
for local inspection. These are reference/source repositories, not executable
plugins, and are excluded from the app bundle and Git submission.

- https://github.com/VoltAgent/awesome-design-md — explicit token/state specification.
- https://github.com/borysttk/awesome-DESIGN-md — Wise Expo financial hierarchy and
  opaque bottom tabs; Things 3 work-row density and progressive disclosure.
- https://github.com/founded-labs/react-native-reusables — MIT button/input/dialog
  compositions adapted into `components/ui`. License in `THIRD_PARTY_NOTICES.md`.
- https://github.com/Novawerk/YIMA — soft tonal surfaces, rounded typography,
  and purposeful motion, implemented with this app's React Native components.

The guides describe other brands and older Expo assumptions. RefurbTrack keeps
its supplied infographic colors, Comfortaa headings, system body type, accessibility scaling and
React Navigation architecture. Current Expo 57 dependency versions come from
Expo's installer and compatibility checks, not copied reference snippets.

One styling system remains: React Native StyleSheet with centralized semantic
tokens. Reusables utility-class variants were translated into that system; no
NativeWind/Uniwind or competing gluestack system was added. Gorhom Bottom Sheet,
Reanimated, Gesture Handler, Expo Haptics and Lucide are installed and used.

References consulted:
- https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/
- https://gorhom.dev/react-native-bottom-sheet/modal/usage
- https://reactnavigation.org/docs/use-prevent-remove/

## Audit decisions

Replaced wrapping top navigation with four labeled bottom tabs. Replaced large
record cards and repeated open buttons with compact tappable rows. Filters and
status lists use sheets. Device costs remain visible; intake, payment details
and history can be expanded. Record edit/reopen/delete actions share a sheet.
Grouped intake fields and added password reveal. Added dirty-form back protection,
visible confirmations, 48-point targets, reduced-motion-aware press feedback and
haptics only for selections and successful writes. No fictional records ship by
default; practice storage is internal and has no welcome or sign-in entry.
