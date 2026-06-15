# Fairepart API

Express + TypeScript + PostgreSQL (Prisma) backend for the Fairepart event management platform. Implements the full domain modeled by the frontend (`lib/types/index.ts` / `lib/mockData.ts`): auth, events, guests/RSVP, seating, messages/polls, photos, gifts, kitties, notifications, and the public guest-facing invite flow.

## Setup

```bash
# 1. Start a local Postgres instance
docker compose up -d

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# edit .env if needed (DB credentials, JWT_SECRET, CORS_ORIGIN, ...)

# 4. Create the database schema
npx prisma migrate dev --name init

# 5. Seed demo data (organizer account + sample event)
npm run seed

# 6. Start the dev server (http://localhost:4000)
npm run dev
```

Other scripts:

```bash
npm run build          # tsc -> dist/
npm run start          # run compiled server (dist/server.js)
npm run prisma:studio  # open Prisma Studio
```

### Demo credentials (after `npm run seed`)

- Email: `organisateur@fairepart.fr`
- Password: `password123`
- Public invite link: `/api/invite/inv_abc123def456`

## Conventions

- All JSON. Authenticated routes require `Authorization: Bearer <token>`.
- Errors: `{ "error": "message" }` (validation errors additionally include `issues` from Zod).
- Response shapes mirror the frontend's `lib/types/index.ts` (`GuestDTO`, `EventDTO`, `MessageDTO`, etc. — see `src/types/dto.ts`).
- Uploaded files are served from `/uploads/<filename>`.

## Endpoint reference

### Auth — `/api/auth`

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/register` | – | `{ name, email, password }` | Create account, returns `{ token, user }` |
| POST | `/login` | – | `{ email, password }` | Returns `{ token, user }` |
| GET | `/me` | ✅ | – | Current user |

### Events — `/api/events` (all require auth)

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/` | – | List events owned by the current user |
| POST | `/` | `{ name, type, date, venue, coupleNames?, coverImageUrl?, steps: [{step,label,date,time,address}] }` | Create event |
| GET | `/:eventId` | – | Full event detail |
| PATCH | `/:eventId` | partial of the above | Update event (and optionally replace `steps`) |
| DELETE | `/:eventId` | – | Delete event (cascades) |
| GET | `/:eventId/dashboard` | – | `{ stats: StatsCard[], activity: ActivityItem[] }` |

### Guests — `/api/events/:eventId/guests`

| Method | Path | Query / Body | Description |
|---|---|---|---|
| GET | `/` | `?rsvpStatus=&step=&search=&familyGroup=` | List/filter guests |
| POST | `/` | `GuestInput` | Create guest |
| POST | `/import` | `GuestInput[]` | Bulk import |
| GET | `/:guestId` | – | Guest detail |
| PATCH | `/:guestId` | partial `GuestInput` + `tableId?` | Update guest (RSVP change logs activity + notification) |
| DELETE | `/:guestId` | – | Delete guest |

`GuestInput`: `{ firstName, lastName, email, phone, rsvpStatus?, steps?, familyGroup?, relatedGuests?, avatarColor?, dietaryRestrictions? }`

### Seating — `/api/events/:eventId/seating`

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/tables` | – | List tables with assigned guest IDs |
| POST | `/tables` | `{ name, capacity, shape?, position? }` | Create table |
| PATCH | `/tables/:tableId` | partial | Update table |
| DELETE | `/tables/:tableId` | – | Delete table (unassigns guests first) |
| PATCH | `/assign` | `{ guestId, tableId: string \| null }` | Assign/unassign a guest (checks capacity) |

### Messages & polls — `/api/events/:eventId/messages`

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/` | – | List messages (with poll results) |
| POST | `/` | `{ type, content, steps?, scheduledAt?, poll?: { question, isAnonymous, options: string[] } }` | Create/send a message or poll |
| GET | `/:messageId` | – | Message detail |
| DELETE | `/:messageId` | – | Delete message |
| POST | `/:messageId/votes` | `{ guestId, optionId }` | Cast/replace a poll vote |

### Photos — `/api/events/:eventId/photos`

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/` | `?approved=true\|false` | List photos |
| POST | `/` | multipart: `file`, `guestId` | Upload a photo (pending approval) |
| PATCH | `/:photoId` | `{ approved }` | Approve/unapprove |
| DELETE | `/:photoId` | – | Delete photo (and file) |

### Gifts — `/api/events/:eventId/gifts`

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/` | – | List gifts |
| POST | `/` | `{ name, description, imageUrl, price?, link? }` | Create gift |
| PATCH | `/:giftId` | partial + `status?` | Update gift |
| DELETE | `/:giftId` | – | Delete gift |
| POST | `/:giftId/reserve` | `{ reservedByName, reservedByGuestId? }` | Reserve a gift |
| POST | `/:giftId/unreserve` | – | Reset to available |

### Kitties — `/api/events/:eventId/kitties`

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/` | – | List kitty goals |
| POST | `/` | `{ name, description, imageUrl?, targetAmount }` | Create goal |
| PATCH | `/:kittyId` | partial + `isActive?` | Update goal |
| DELETE | `/:kittyId` | – | Delete goal |
| POST | `/:kittyId/contributions` | `{ name, amount, message?, avatarColor?, guestId? }` | Add a contribution |

### Notifications — `/api/events/:eventId/notifications`

| Method | Path | Description |
|---|---|---|
| GET | `/` | List notifications |
| PATCH | `/:notificationId/read` | Mark one as read |
| PATCH | `/read-all` | Mark all as read |

### Public invite — `/api/invite/:token` (no auth)

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/` | – | Event info for the guest landing page |
| GET | `/guests?email=` | – | Find the inviting guest by email |
| PATCH | `/guests/:guestId/rsvp` | `{ rsvpStatus?, steps?, dietaryRestrictions? }` | Submit RSVP |
| GET | `/messages` | – | Sent messages/polls |
| POST | `/messages/:messageId/votes` | `{ guestId, optionId }` | Vote on a poll |
| GET | `/gifts` | – | Gift list |
| POST | `/gifts/:giftId/reserve` | `{ reservedByName, reservedByGuestId? }` | Reserve a gift |
| GET | `/kitties` | – | Kitty goals |
| POST | `/kitties/:kittyId/contributions` | `{ name, amount, message?, avatarColor?, guestId? }` | Contribute |
| POST | `/photos` | multipart: `file`, `guestId` | Guest photo upload |

### Invitation styles — `/api/invitation-styles` (no auth)

| Method | Path | Description |
|---|---|---|
| GET | `/` | Static catalog of invitation design styles |

## Example flows (curl)

```bash
BASE=http://localhost:4000/api

# Register & login
curl -s -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Demo","email":"demo@fairepart.fr","password":"password123"}'

TOKEN=$(curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"organisateur@fairepart.fr","password":"password123"}' | jq -r .token)

# List events & dashboard
EVENT_ID=$(curl -s $BASE/events -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')
curl -s $BASE/events/$EVENT_ID/dashboard -H "Authorization: Bearer $TOKEN"

# Guests
curl -s $BASE/events/$EVENT_ID/guests -H "Authorization: Bearer $TOKEN"

# Public RSVP via invite token
curl -s $BASE/invite/inv_abc123def456
curl -s "$BASE/invite/inv_abc123def456/guests?email=marie.dupont@email.fr"

# Upload a photo (guest-facing)
curl -s -X POST $BASE/invite/inv_abc123def456/photos \
  -F "guestId=<guestId>" -F "file=@/path/to/photo.jpg"

# Reserve a gift
GIFT_ID=$(curl -s $BASE/invite/inv_abc123def456/gifts | jq -r '.[0].id')
curl -s -X POST $BASE/invite/inv_abc123def456/gifts/$GIFT_ID/reserve \
  -H 'Content-Type: application/json' -d '{"reservedByName":"Jean Dupont"}'

# Contribute to a kitty
KITTY_ID=$(curl -s $BASE/invite/inv_abc123def456/kitties | jq -r '.[0].id')
curl -s -X POST $BASE/invite/inv_abc123def456/kitties/$KITTY_ID/contributions \
  -H 'Content-Type: application/json' -d '{"name":"Jean Dupont","amount":50}'

# Vote on a poll
MESSAGE_ID=$(curl -s $BASE/invite/inv_abc123def456/messages | jq -r '.[] | select(.poll) | .id' | head -1)
OPTION_ID=$(curl -s $BASE/invite/inv_abc123def456/messages | jq -r ".[] | select(.id==\"$MESSAGE_ID\") | .poll.options[0].id")
curl -s -X POST $BASE/invite/inv_abc123def456/messages/$MESSAGE_ID/votes \
  -H 'Content-Type: application/json' -d "{\"guestId\":\"<guestId>\",\"optionId\":\"$OPTION_ID\"}"
```
