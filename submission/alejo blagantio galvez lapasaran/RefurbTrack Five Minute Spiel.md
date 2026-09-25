# RefurbTrack five-minute pitch spiel

## 0:00–0:15 Title

Good evening. We are the RefurbTrack team from UM Tagum College. Our project helps AJ Cellphone Repair Shop and Accessories keep each phone’s costs and outcome together. We focus on the shop’s repair and resale work.

## 0:15–0:50 Overview · Problem

Our concept paper reports a needs assessment with the shop owner on August twenty-three. Records were spread across memory, paper, and an inconsistent existing application. Buying, repairing, and reselling phones was the greatest difficulty. Another discovered defect changes the investment. Without keeping those costs together, a sale can appear successful even when it produces a loss. This is evidence from one beneficiary, not every repair shop.

## 0:50–1:25 Overview · Solution

RefurbTrack keeps intake, diagnosis, expenses, status, and final payment together. In our fictional demonstration, purchase costs two thousand pesos, parts cost eight hundred, and paid labor costs two hundred. Investment totals three thousand pesos. Revenue of four thousand five hundred produces one thousand five hundred pesos recorded profit. Rent, tax, and overhead are excluded. An unsold job shows investment, not an automatic realized loss.

## 1:25–1:50 Overview · Objectives

Our objectives are to record actual direct costs, separate the two job types, and retrieve each phone’s history. Buy and Resell and Customer Repair are explicit choices. A free acquisition still follows resale; a customer repair ends with release. Our intake target is under two minutes, pending timed tests with actual users.

## 1:50–2:15 Market · Market Opportunity

Our initial users are the owner and technicians of AJ Cellphone Repair Shop and Accessories in Tagum City. The opportunity is to replace fragmented records at this shop. Other shops may face a similar problem, but wider demand and market size have not been measured. We will validate this beneficiary’s workflow first.

## 2:15–2:40 Market · Competition

Paper and memory need little setup, but the survey describes fragmented records. A spreadsheet is a valid alternative, although its workflow needs to be designed and maintained. RefurbTrack organizes intake, costs, status, and outcome around each phone. This is a comparison of our implemented workflow, not a claim that all commercial systems lack these functions.

## 2:40–3:10 Market · Architecture

React Native and Expo provide the Android interface. Firebase Authentication identifies staff, and Firestore stores workspace records. Shared access requires administrator-provisioned membership. Money is stored as whole centavos. A revision check prevents an old form from silently overwriting a newer update. Practice mode follows the same calculations but saves only on this device, separately from cloud records.

## 3:10–3:35 Market · Development Process

We defined the lifecycles and financial rules from the concept paper, then connected the screens. Automated tests cover free acquisitions, expense corrections, and below-cost sales. Browser walkthroughs verify the displayed result. Cloud verification and an installed Android APK are separate release checks. The mock presentation will guide refinements before final submission.

## 3:35–4:10 Status · Traction and Validation

Our concept paper reports a needs assessment with one shop owner. We now have twenty passing financial and workflow tests, live Firebase access checks, and a completed Android APK build. A cloud repair test survived a browser reload with the correct profit. We still need to record physical-device results and the client’s acceptance. We have not claimed increased sales or measured time savings.

## 4:10–4:35 Status · Market Strategy

Our rollout begins with a supervised pilot. We will orient the owner and technicians, explain the calculation’s limits, and collect corrections from agreed tasks. No commercial price or paying-user claim has been established. Photos and inventory can follow validated needs. Free scrcpy mirroring can help demonstrate the installed app during class.

## 4:35–5:00 Status · Team

Our team is Joseph Alejo, Ynoid Dan Blagantio, Ace Jerald Galvez, and Novecille Lapasaran. Together we are responsible for implementation, testing, documentation, and presentation. Individual contributions should follow our actual assignments. We will now demonstrate a fictional phone, its recorded costs and profit, then the customer repair workflow. Thank you.