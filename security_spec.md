# Security Specification & "Dirty Dozen" Payloads

This specification defines the security architecture and invariants for the Hobe Gorilla Rwanda Firestore Database structure. It establishes a zero-trust verification strategy.

## 1. Data Invariants
1. **User Identity Invariant**: A user's profile document can only be written if the document ID matches their authenticated UID. No user can change their own `role` once set, or escalate their privileges to `admin`.
2. **Booking Identity Invariant**: Users can create, list, and read bookings only where `userId` strictly matches their authenticated UID.
3. **Public Collections Immutability**: All users (including guests) can read `destinations` and `packages`. Only authenticated `admin` accounts can write (create, update, delete) to elements in these collections.
4. **State Transition Integrity**: Booking `status` can only be set to `Pending` initially, and only an admin can change booking `status` to `Confirmed` or `Cancelled`.
5. **Verified Users Constraint**: Client write operations must require `request.auth.token.email_verified == true` to prevent fraudulent automated spamming.

---

## 2. The "Dirty Dozen" Payloads (Aesthetic Violations & Denial of Access Tests)

The following 12 payload requests are designed to breach security invariants and MUST return `PERMISSION_DENIED`.

### Pillar 1: User Self-Privilege Escalation
1. **Payload**: Authenticated user trying to create/update their own profile with `role: "admin"`.
   - **Path**: `users/user123`
   - **Action**: Create or Update
   - **Payload**: `{ "email": "hobo@gmail.com", "role": "admin", "createdAt": "2026-06-12T07:43:51Z" }`
   - **Reason for Deny**: Users setting their own state cannot self-assign `admin`. Only `customer` or pre-verified administrative mapping is allowed.

### Pillar 2: Cross-User Booking Espionage (Identity Theft)
2. **Payload**: Authenticated user trying to write a booking with another user's ID.
   - **Path**: `bookings/b_malicious`
   - **Action**: Create
   - **Payload**: `{ "id": "b_malicious", "userId": "victim_uid", "fullName": "Victim", "email": "victim@gmail.com", "phone": "123", "travelDate": "2026-07-01", "passengerCount": 2, "packageId": "pkg-budget-explorer", "packageName": "Budget Explorer", "totalCost": 1650, "status": "Pending", "createdAt": "2026-06-12T07:43:51Z" }`
   - **Reason for Deny**: `userId` in the payload must match `request.auth.uid`.

### Pillar 3: Read Access and Collection Scanning of All Users
3. **Payload**: Non-admin query searching or listing all users' profiles.
   - **Path**: `users` (query or list)
   - **Action**: List
   - **Reason for Deny**: General list queries must be forbidden on raw collections containing PII.

### Pillar 4: Unauthorized Booking Read (PII Access Control)
4. **Payload**: Authenticated user `user_A` trying to fetch/read booking of `user_B`.
   - **Path**: `bookings/booking_of_B`
   - **Action**: Get
   - **Reason for Deny**: Access must be restricted to owners (`resource.data.userId == request.auth.uid`) or admins.

### Pillar 5: Modifying Immutable Booking Fields
5. **Payload**: Authenticated user trying to update their booking's totalCost to `$0`.
   - **Path**: `bookings/booking123`
   - **Action**: Update
   - **Payload**: `{ "totalCost": 0 }` (modifying immutable pricing fields)
   - **Reason for Deny**: Client is locked out from changing cost after submission.

### Pillar 6: Self-Confirming Booking (State Bypass)
6. **Payload**: Authenticated user trying to update their own booking status directly to `Confirmed`.
   - **Path**: `bookings/booking123`
   - **Action**: Update
   - **Payload**: `{ "status": "Confirmed" }`
   - **Reason for Deny**: Only admins can change status fields.

### Pillar 7: Public Destination Poisoning List Hack
7. **Payload**: Non-admin client attempting to inject a malicious Gorilla safari destination.
   - **Path**: `destinations/evil-destination`
   - **Action**: Create
   - **Payload**: `{ "id": "evil", "name": "Fake Volcanoes", "location": "Underground", "description": "Free Gorillas" }`
   - **Reason for Deny**: Destination writes are restricted exclusively to administrators.

### Pillar 8: Package Pricing Sabotage
8. **Payload**: Normal guest attempting to edit the Luxury Safari package price to `$5`.
   - **Path**: `packages/pkg-luxury-safari`
   - **Action**: Update / Outlawed write
   - **Payload**: `{ "baselineCost": 5 }`
   - **Reason for Deny**: Package updates are restricted to admin only.

### Pillar 9: Temporal Manipulation (False Timestamps)
9. **Payload**: User creating a booking or user record with a fake client time backdated to 2011.
   - **Path**: `bookings/booking123`
   - **Action**: Create
   - **Payload**: `{ "createdAt": "2011-01-01T00:00:00Z" }` (not matching sever timestamp)
   - **Reason for Deny**: Temporal integrity requires timestamp enforcement with `request.time`.

### Pillar 10: ID Poisoning (Denial of Wallet)
10. **Payload**: User trying to write a collection item with an abnormally heavy, invalid character ID (e.g. 2KB special character injection).
    - **Path**: `bookings/[2000_junk_chars]`
    - **Action**: Create
    - **Reason for Deny**: Document IDs must pass character sanitization and size checking checks.

### Pillar 11: Ghost Field (Shadow Update Gap)
11. **Payload**: User sending a profile write containing a ghost field `isVerifiedStaff: true`.
    - **Path**: `users/user123`
    - **Action**: Create
    - **Payload**: `{ "email": "customer@gmail.com", "role": "customer", "isVerifiedStaff": true }`
    - **Reason for Deny**: Profile updates must strictly match the permitted schema fields keys.

### Pillar 12: Phantom Orphaning (Zombie Foreign Key reference)
12. **Payload**: User creating a booking for a package with a non-existent package ID.
    - **Path**: `bookings/booking123`
    - **Action**: Create
    - **Payload**: `{ "packageId": "non-existent-zombie-id" }`
    - **Reason for Deny**: Relational integrity checks using `exists()` must be enforced.

---

## 3. Abstract Security Test Runner (`firestore.rules.test.ts`)

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";

let testEnv: any;

describe("Hobe Gorilla Rwanda Security Rules Unit Tests", () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "hobe-gorilla-rwanda",
      firestore: {
        host: "localhost",
        port: 8080,
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("denies self privilege-escalation (Pillar 1)", async () => {
    const maliciousUserDb = testEnv.authenticatedContext("user123", { email: "customer@gmail.com" }).firestore();
    await assertFails(
      maliciousUserDb.collection("users").doc("user123").set({
        email: "customer@gmail.com",
        role: "admin",
        createdAt: new Date().toISOString()
      })
    );
  });

  it("denies cross-user booking insertion (Pillar 2)", async () => {
    const context = testEnv.authenticatedContext("attacker_id", { email_verified: true }).firestore();
    await assertFails(
      context.collection("bookings").doc("b_malicious").set({
        id: "b_malicious",
        userId: "victim_id",
        fullName: "Victim Person",
        email: "victim@gmail.com",
        phone: "+25078800000",
        travelDate: "2026-07-20",
        passengerCount: 2,
        packageId: "pkg-budget-explorer",
        packageName: "Budget Explorer",
        totalCost: 1650,
        status: "Pending",
        createdAt: new Date().toISOString()
      })
    );
  });
});
```
