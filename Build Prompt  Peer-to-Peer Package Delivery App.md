## 1. Role and Goal

You are a senior React Native engineer and mobile UI/UX specialist. Build the **frontend only** (UI/UX + client-side logic) for **[APP_NAME]**, a peer-to-peer logistics app for Nigeria that connects **Senders** (people who want to send a package) with **Travelers** (people already travelling to the same destination who can carry it for a fee).

The backend does not exist yet. Build every screen against a **mock API layer** that has the exact same shape as the future REST API, so that connecting the real backend later means changing **one config flag and the base URL**, not rewriting screens.

Follow the attached Figma screens closely for layout, colours and components. Where the design has gaps, typos, or UX problems, fix them using the rules in Section 9.

## 2. Tech Stack (use exactly this)

| Concern | Choice |
|---|---|
| Framework | React Native with **Expo SDK (latest stable)**, **TypeScript (strict)** |
| Navigation | **Expo Router** (file-based), tabs + stacks + modals |
| Server state / API | **TanStack Query (React Query)** for all data fetching, caching, mutations |
| HTTP client | **Axios** instance with interceptors (auth token, error normalisation) |
| Forms + validation | **React Hook Form + Zod** (schemas reused as API types) |
| Maps | `react-native-maps` (traveler map on Find a Traveler) |
| Location | `expo-location` (the "use my location" target icon in City fields) |
| Date picker | `@react-native-community/datetimepicker` |
| Clipboard / Share | `expo-clipboard`, React Native `Share` API |
| Notifications | `expo-notifications` (wire UI now, real push later) |
| Chat / Calls | UI only now; abstract behind a `realtime` service (future: Socket.io) 
| Payments | UI only now; abstract behind a `payments` service (future: Monniefy, NGN) |


## 3. Core Business Flow

### 3.1 Sender flow
1. **Home** → taps **Send Package**.
2. **Step 1/3 – Sender Details** ("Where are you sending from?"): full name, mobile number, house address, state, city/LGA.
3. **Step 2/3 – Receiver Details** ("Who are you sending to?"): same fields for the receiver.
4. **Step 3/3 – Package Details** ("What are you sending?"): quantity (stepper − / +), parcel size (Small 0.1–1.0kg, Medium 1.0–4.0kg, Large 4.0–10kg), declared value (optional), delivery window (From date → To date), **instructions (optional, add this field; it is shown on Request Details but missing from the form)**, **package description**.
5. Tap **Find A Match** → **Find a Traveler**: map on top, draggable bottom sheet listing travelers whose route and date window match. Each card: avatar, name, current location, rating, departure date, available space, chat icon, info icon. Selecting a card highlights it (red border). Tap **Continue**.
6. **Request Details** (summary + payment): From, To, Timeline, Weight, Instructions, Fee (₦), selected traveler, payment option (**Card** or **Bank Transfer**; use radio buttons, not checkboxes, since only one can be chosen). Buttons: **Cancel**, **Proceed**.
7. Payment → **Payment Successful** screen. Make it clear the money is **held in escrow by company** and only released to the traveler after delivery is confirmed.
8. **Tracking Code Generated** screen: shows the tracking ID (e.g. `AKS-1234567890`) with **Copy** and **Share** buttons, plus a summary (sender, receiver, package, delivery date). This is the code for tracking the parcel.
9. Request status starts as **Awaiting Traveler** ("Agent: Yet to be accepted"). The sender can still **Cancel Delivery** (confirmation dialog) while it is not yet picked up.

### 3.2 Traveler flow ("Do Delivery" / waybill)
1. **Home** → taps **Do Delivery** ("Be available to do delivery").
2. **Schedule a Trip**: Traveling from, Traveling to (each opens a bottom-sheet with City + State and a "use my current location" icon), departure date, **available space** (weight capacity options), then Confirm.
3. **Payout bank details** (Bank dropdown of Nigerian banks + 10-digit account number, with account-name lookup display). Ask for this **once** (on the first trip or in Account → Payout settings), not on every trip.
4. Trip shows on the **Schedule** tab as a card (date badge + from/to). The traveler can tap to **edit** a trip, or enter select mode (radio per card) to **Cancel / Delete** trips.
5. When a sender selects them, the traveler gets a **push notification + in-app notification**: "Request for Delivery · To: Uyo, Akwa Ibom · By: Joshua Ekanem · Within: 10 days" with **Decline (✕)** and **Accept (✓)** buttons. Tapping the card body opens the full request details (package size, value, pickup address, fee they will earn) **before** they decide.
6. **Ongoing Delivery** screen (after accept): illustration, From / To, buttons **Package Picked Up** (rename from "Accepted package") and **Cancel Delivery**.
7. On arrival, the traveler taps **Confirm Delivery** → **Enter Delivery Code** screen → enters the code the receiver gives them → **"You have delivered this package successfully"** + Done.
8. Delivery confirmed → escrow is released → traveler sees **Payout pending / Paid** status and amount.

### 3.3 Shared features
- **Track Package**: from Home search bar or a dedicated Track Delivery screen. Enter tracking number → **Tracking Details** bottom sheet with a vertical timeline (Picked up by [Traveler] · location · date/time → In transit → Delivered). Filled red dot = done, dashed red circle = current/pending. Button: **Delivery Details**.
- **Delivery Details** screen: status chip (e.g. IN PROGRESS), tracking ID, from, to, timeline, weight, instructions, fee, mode of payment, agent (traveler). Actions depend on status and role (Track, Cancel Delivery, Chat, Call).
- **Chat**: chat list (search, avatar, last message, time, unread badge) and conversation screen (bubbles, timestamps, attachment "+", send, voice-note mic, call + video icons in the header). A chat is tied to a delivery request.
- **Calls**: call log (incoming / outgoing / missed icons), outgoing "Calling…", incoming (accept green / decline red), in-call (timer, speaker, end, mute), video call (local preview in the corner). UI only for now.
- **Notifications**: list of request, status-change and delivered notifications with timestamps and "View".
- **Get Quote / Delivery Rate**: from Home → Check Delivery Rate (from, to, quantity, size, value) → **Delivery Quote** modal (From, To, Quantity, Weight, Cost ₦1000) → **Request Delivery** starts the Send Package flow with these values pre-filled.
- **Contact Support**: Home card → support options (WhatsApp, phone, email, FAQ). Floating send/help button on Home.

### 3.4 One account, two roles
A single user can be both a sender and a traveler. Do **not** build two separate apps or force role selection at sign-up. Home shows both actions; Activity and Schedule tabs filter by role.

## 4. Delivery Status Model (single source of truth)

Drive every screen, button, chip and timeline from this enum. Never hard-code UI to screen names.

```ts
export type DeliveryStatus =
  | 'DRAFT'              // sender still filling the form
  | 'PENDING_PAYMENT'    // traveler selected, not paid
  | 'AWAITING_TRAVELER'  // paid, held in escrow, waiting for accept/decline
  | 'ACCEPTED'           // traveler accepted
  | 'DECLINED'           // traveler declined → sender picks another traveler
  | 'PICKED_UP'          // traveler has the package
  | 'IN_TRANSIT'
  | 'DELIVERED'          // delivery code verified
  | 'COMPLETED'          // payout released to traveler
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'UNPAID' | 'HELD_IN_ESCROW' | 'RELEASED' | 'REFUNDED';
```

Rules:
- **Sender can cancel** only in `PENDING_PAYMENT`, `AWAITING_TRAVELER`, `ACCEPTED` (show refund note).
- **Traveler can accept/decline** only in `AWAITING_TRAVELER`. If they do nothing within a set time (e.g. 24h), the request expires and the sender is told to pick another traveler.
- If **declined**, notify the sender and take them back to Find a Traveler with the same request (no re-entering of data, no double payment).
- Status chip colours: Awaiting = amber, Accepted / In transit = blue, Delivered / Completed = green, Cancelled / Declined = red, Refunded = grey.

## 5. Data Models (TypeScript, derived from Zod schemas)

Put these in `src/types/` and generate them from Zod schemas in `src/schemas/` so form validation and API typing share one definition.

```ts
export type Role = 'SENDER' | 'TRAVELER';
export type ParcelSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface Location {
  state: string;          // e.g. "Akwa Ibom"
  city: string;           // City / LGA, e.g. "Uyo"
  address?: string;       // house address
  lat?: number;
  lng?: number;
}

export interface Contact {
  fullName: string;
  phone: string;          // E.164, e.g. +2348012345678
  location: Location;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  rating?: number;
  isVerifiedTraveler: boolean;
  payoutAccount?: PayoutAccount;
}

export interface PayoutAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;  // 10 digits (NUBAN)
  accountName: string;    // resolved from bank lookup
}

export interface PackageDetails {
  quantity: number;            // >= 1
  size: ParcelSize;
  weightRangeKg: [number, number];
  declaredValue?: number;      // in Naira (kobo on the API side)
  description?: string;
  instructions?: string;
}

export interface Trip {
  id: string;
  travelerId: string;
  from: Location;
  to: Location;
  departureDate: string;       // ISO date
  availableCapacityKg: number;
  status: 'ACTIVE' | 'FULL' | 'COMPLETED' | 'CANCELLED';
}

export interface TravelerMatch {
  traveler: Pick<User, 'id' | 'fullName' | 'avatarUrl' | 'rating' | 'isVerifiedTraveler'>;
  trip: Trip;
  currentLocation: Location;
  estimatedFee: number;
}

export interface DeliveryRequest {
  id: string;
  trackingId: string;          // e.g. AKS-1234567890
  deliveryCode?: string;       // shown to sender only; receiver gives it to traveler
  sender: Contact;
  receiver: Contact;
  package: PackageDetails;
  window: { from: string; to: string }; // ISO dates
  travelerId?: string;
  tripId?: string;
  fee: number;
  paymentMethod?: 'CARD' | 'BANK_TRANSFER';
  paymentStatus: PaymentStatus;
  status: DeliveryStatus;
  timeline: TrackingEvent[];
  createdAt: string;
}

export interface TrackingEvent {
  status: DeliveryStatus;
  title: string;               // "The package has been picked up"
  location?: string;           // "Abuja"
  actorName?: string;          // "Thomas MD."
  timestamp?: string;          // undefined = upcoming step
}

export interface Quote {
  from: Location; to: Location;
  quantity: number; size: ParcelSize;
  cost: number; currency: 'NGN';
}

export interface AppNotification {
  id: string;
  type: 'DELIVERY_REQUEST' | 'REQUEST_ACCEPTED' | 'REQUEST_DECLINED' | 'PICKED_UP' | 'DELIVERED' | 'PAYOUT';
  title: string;
  body: string;
  requestId?: string;
  read: boolean;
  createdAt: string;
}

export interface ChatThread { id: string; requestId: string; participant: User; lastMessage?: Message; unreadCount: number; }
export interface Message { id: string; threadId: string; senderId: string; type: 'TEXT' | 'IMAGE' | 'VOICE' | 'LOCATION'; content: string; createdAt: string; }
export interface CallLog { id: string; participant: User; direction: 'INCOMING' | 'OUTGOING' | 'MISSED'; kind: 'VOICE' | 'VIDEO'; createdAt: string; durationSec?: number; }
```

## 6. API Contract (mock now, real later)

Create one service file per domain in `src/api/services/`. Every function returns a typed Promise. Screens **never** call Axios or mocks directly; they only use React Query hooks in `src/api/hooks/`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/otp/request`, `/auth/otp/verify` | Phone login |
| GET | `/me` | Current user |
| PUT | `/me/payout-account` | Save bank details |
| GET | `/banks`, POST `/banks/resolve` | Bank list, account-name lookup |
| GET | `/locations/states`, `/locations/states/:state/lgas` | Nigerian states and LGAs |
| POST | `/quotes` | Get delivery rate |
| POST | `/delivery-requests` | Create request (returns `id`, `fee`) |
| GET | `/delivery-requests?role=sender\|traveler&status=` | Activity lists |
| GET | `/delivery-requests/:id` | Delivery details |
| GET | `/delivery-requests/:id/matches` | Matching travelers |
| PATCH | `/delivery-requests/:id/traveler` | Select traveler |
| POST | `/delivery-requests/:id/payments` | Start payment (returns checkout URL / bank details) |
| POST | `/delivery-requests/:id/cancel` | Cancel |
| POST | `/delivery-requests/:id/accept`, `/decline` | Traveler response |
| POST | `/delivery-requests/:id/pickup` | Mark picked up |
| POST | `/delivery-requests/:id/confirm-delivery` `{ code }` | Verify delivery code |
| GET | `/tracking/:trackingId` | Public tracking + timeline |
| GET/POST/PATCH/DELETE | `/trips`, `/trips/:id` | Traveler schedule CRUD |
| GET | `/notifications`, PATCH `/notifications/:id/read` | Notifications |
| GET | `/chats`, `/chats/:id/messages`, POST `/chats/:id/messages` | Chat |
| GET | `/calls` | Call log |

Implementation rules:
- `src/config/env.ts` exports `API_BASE_URL` and `USE_MOCKS` (read from `EXPO_PUBLIC_*` env vars).
- `src/api/client.ts` = Axios instance + auth header + error normaliser → `ApiError { code, message, fieldErrors? }`.
- `src/api/mocks/` holds realistic Nigerian seed data (names, states, LGAs, ₦ prices) and an in-memory store, so that state changes **persist during the session** (accepting a request really moves it to ACCEPTED, cancelling really cancels it).
- Mocks add a random 300–900ms delay and can simulate errors (`?fail=true` or a dev toggle), so loading and error states get built and tested.
- Each service picks implementation via `USE_MOCKS ? mockImpl : httpImpl`, with **identical function signatures**.
- Money is stored as **integer kobo** in the API layer and formatted to `₦1,000` only in the UI via a `formatNaira()` util.
- Dates travel as ISO strings and are displayed as `DD/MM/YYYY` via a `formatDate()` util.

KEEP IT DRY
Make use of the current project design system
Make use of the reusable components
Do a neat job