# RefurbTrack Lab 14 five-minute rehearsal

This fulfills Lab 14's 60-second problem, 150-second walkthrough, and 90-second technical challenge. For the instructor's scheduled presentation, use the separate five-minute pitch spiel followed by the three-minute demo below. All amounts and device records used in rehearsal are fictional examples.

## Problem 0:00–1:00

“RefurbTrack is for AJ Cellphone Repair Shop and Accessories in Tagum City. Our concept paper records the owner's difficulty in keeping the full cost of a phone together. A purchase price may be written in one place, parts in another, and labor remembered later. That makes it difficult to tell whether a sale earned money. Unexpected damage can add cost, and an unsold phone keeps capital tied up.

Our app keeps the intake, diagnosis, expenses, status, and final payment in one phone record. It also separates phones bought for resale from phones brought in by customers. The amount paid for a phone does not decide which workflow it belongs to.”

## Walkthrough 1:00–3:30

Have a fictional Samsung Galaxy A15 record prepared with purchase PHP 2,000, parts PHP 800, paid labor PHP 200, and status Ready for Sale. Have a second fictional customer repair prepared to show the different lifecycle. Sign in before the timed presentation; demonstrate a fresh signup during the final test pass, not at the expense of the three-minute demo.

1. **Overview and records, 30 seconds.** Show the workspace, open jobs, and investment. Explain that open investment is not automatically a loss.
2. **Phone details and sale, 80 seconds.** Open the prepared phone, point to the separate purchase, parts, and labor totals, and record a PHP 4,500 sale. Show PHP 1,500 profit. Show the saved status and history.
3. **Customer repair and history, 40 seconds.** Open the prepared customer repair. Explain zero purchase cost and Amount charged, then show that sold/released records remain searchable. If cloud access is connected, identify the current account and shared workspace without showing passwords.

## Technical challenge 3:30–5:00

“A specific challenge was keeping the two job types separate while using the same cost calculation. A customer repair has no purchase price, but a phone acquired at no cost can also have a zero purchase price. If we guessed the workflow from that number, a free acquisition could incorrectly become a customer repair.

We store the job type explicitly at intake. A resale job ends as Sold, and a customer repair ends as Released. Both use revenue minus purchase, parts, and paid labor. We store amounts as whole centavos to avoid decimal rounding errors. Open jobs have investment but no realized profit yet. A write-off records accumulated cost as a loss.

The financial tests include both job types, a zero-cost acquisition, a below-cost sale, and an expense correction. The screens use the same calculation functions as the tests. A revision check also prevents an old form from silently replacing a more recent cloud update.”

Only claim checks that are recorded in the verification report. Do not claim an installed APK or live Firebase test from a JavaScript export alone.

## Scheduled three-minute demonstration

| Time | Screen and action | Say |
| --- | --- | --- |
| 0:00–0:35 | Overview, then prepared phone | “This is an installed app. Each phone has one record. These are fictional demonstration amounts.” |
| 0:35–1:20 | Phone details and costs | “Purchase is PHP 2,000, parts PHP 800, and paid labor PHP 200. Total investment is PHP 3,000.” |
| 1:20–2:05 | Record sale and return to details | “At PHP 4,500 revenue, the recorded profit is PHP 1,500.” |
| 2:05–2:40 | Customer repair | “Customer repair starts at zero purchase and ends in release. A zero-cost resale still follows the resale workflow.” |
| 2:40–3:00 | History/search | “Completed jobs stay searchable, so the shop can review recorded costs later.” |

Before each rehearsal, reopen and prepare the fictional sale record so the sale action can be repeated. Never alter a real client's historical sale for demonstration.

## If something breaks

Say what should happen and identify the observed issue. If the internet fails, show the clearly labeled practice workspace or an actual backup recording and disclose that cloud synchronization is unavailable. Do not describe local practice data as a successful cloud test. Keep the technical explanation short and return to the working record.

## Q&A preparation

- **How is profit computed?** Revenue minus purchase, parts, and paid labor. It excludes rent, tax, and general overhead; owner labor recorded at zero means profit includes compensation for that time.
- **What if the phone is not sold?** It stays open with investment visible. It is excluded from realized profit until a payment or explicit write-off.
- **Why not infer job type from zero cost?** Both a customer repair and a free acquisition can cost zero. Explicit type avoids misclassification.
- **Can all accounts read the shop's data?** No. Firestore rules limit access to the workspace owner or an explicitly provisioned active member.
- **Does it work offline?** Practice records persist locally. Cloud operations require internet; this release does not claim full offline cloud synchronization.
- **What did the survey prove?** The supplied paper documents a needs assessment with one owner. It does not establish market size, adoption, or measured business improvement.
- **What is next?** Real client acceptance testing, measured usability, and optional photos or inventory only after the present scope is validated.
