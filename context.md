# Context: Opening Night Lucky Draw

For anyone picking this up, people or AI assistants. Read this first, then `README.md` for the on-the-night steps.
Status as of Wednesday 4 November 2026.

## What this is

The lucky draw for **WSTI Festi 2026 Opening Night, Thursday 5 November 2026**. People scan a QR code, fill in a short
form on their phone, and their nickname lands on a wheel on the big screen. Lailei spins it on stage. Five winners,
and each winner gets their prize by email after the event.

The form also collects the data City of Parramatta asked WSTI to report (see "Questions and why" below).

## Links

| What | Link |
|---|---|
| Repo | https://github.com/wsti-studio/Opening-Night-Lucky-Draw |
| Phone form (live site) | https://draw.wsti.org.au/ |
| Stage wheel | https://draw.wsti.org.au/?stage, then log in (Railway variables `ADMIN_USER` and `ADMIN_PASSWORD`, never commit them). Replaced the `?key=` link on 4 Nov because stage links get shown in public. |
| Rehearsal wheel (100 test names, real entries untouched) | https://draw.wsti.org.au/?stage&demo |
| Private Google Form (every answer) | https://docs.google.com/forms/d/14aUlqThf6npvFjzZUxZJGRuUhjzzv0J11Gs6-ylNs-Q/edit |
| Wheel Google Form (nickname + entry code only) | https://docs.google.com/forms/d/1-ALRGbr7uOM3ysLxOAmOiBwzyu8ozTOak8PXG4O2k6w/edit |

The site runs on Railway (Frank, 4 Nov) and redeploys from `main` about a minute after a push.
The form edit links only open for accounts the forms are shared with (ask Harsh).

## Where the data goes

```
Phone form ──► Private Google Form ──► every answer          (WSTI's general Google account, never shared)
           └─► Wheel Google Form   ──► nickname + entry code (its Sheet is "anyone with the link, viewer")
                                          │
                       Stage wheel ◄──────┘ reads that Sheet every 5 seconds
```

- Both forms are owned by WSTI's general Google account (moved there 4 Nov; Harsh is an editor). Entries live in Google only: each form's **Responses** tab,
  and the Google Sheet each form fills once **Responses, Link to Sheets** is clicked.
- **No entries are stored in this repo or on Railway.** Railway serves the page and keeps only the stage's winners list
  (nickname + entry code, `/api/winners`, behind the admin login in `admin.js`) so every stage laptop sees the same winners.
  `admin.js` is the same file as in wsti-studio/Ask-the-Panel: change both together. `DRAW_KEY` is no longer used.
- To email a winner: the wheel shows "nickname + entry code". Find that entry code in the private form's responses.

## How it works

- `index.html` is one page with two views. No build step.
  - **Phone view** (default): validates the answers, then posts each entry twice with `fetch(..., { mode: 'no-cors' })`
    to the two forms' `formResponse` URLs, using the entry ids in `config.js`. `no-cors` means the page cannot see
    whether Google accepted it, so a form that refuses public responses fails silently. Test with a real phone after
    any change to the forms' settings.
  - **Stage view** (`?stage`): reads the wheel Sheet as CSV through
    `https://docs.google.com/spreadsheets/d/<wheelSheetId>/gviz/tq?tqx=out:csv&headers=1` every 5 seconds.
    New names pop in. A row deleted in the Sheet leaves the wheel within 5 seconds (this is how to remove a rude nickname).
- **Entry code:** the first 6 characters of SHA-256 of the lowercased email, in an alphabet without 0, O, 1, I or L.
  The same email always gives the same code, so it counts once on the wheel. The phone also remembers its codes and
  says "You're already in" on a repeat.
- **Picking a winner:** the winner is chosen first with `crypto.getRandomValues`, then the wheel is animated to land on
  them. "Confirm winner" keeps them. "Not eligible, redraw" removes them without counting.
- **Stage state** (winners, removed entries, entries closed, sound) is kept in the stage laptop's `localStorage`
  (key `ond-draw-v1`; rehearsal uses `ond-draw-demo`), so a reload does not lose winners. "Reset draw" (click twice) clears it.
- Libraries from cdnjs: qrcodejs 1.0.0 and canvas-confetti 1.9.3. Font: Figtree from Google Fonts.
- Keyboard on stage: space, Enter, right arrow or Page Down spins, or confirms the winner on screen (presenter clickers work).

## Questions and why

City of Parramatta's reporting requirement (Harsh, 4 Nov): postcode is a required field on every festival registration.
WSTI reports registrations, attendance postcodes per event and in total, age band, ethnicity, and organisation/student
data, and asks whether attendees would like to engage in potential future citizen science programs with Council.

| Field on the phone | Required | Why |
|---|---|---|
| Nickname | Yes | Shown on the wheel |
| Email | Yes | To contact winners; also makes the entry code |
| Postcode | Yes | Council: postcode required. Label hint matches the Festi listings: "where you live, work or study" |
| Age group | Yes, "Prefer not to say" allowed | Council: age band. ABS Age Standard ten year groups, 15–24 to 75 and over |
| Cultural or ethnic background | Yes, "Prefer not to say" allowed | Council: ethnicity. ABS ASCCEG 2025, the nine broad groups |
| I'm a student (tick) | No | Council: student data. Recorded as Yes or No |
| Organisation, or Uni or school when ticked | Yes, "None" allowed | Council: organisation data. The label flips with the student tick. A line under it says they can write "None" (Harsh, 4 Nov) |
| Citizen science interest (tick, unticked to start) | No | Council's citizen science question. Recorded as Yes or No |
| WSTI event updates (tick, unticked to start) | No | Opt-in to WSTI's own event emails (Harsh, 4 Nov). Recorded as Yes or No. Only email people who said Yes |
| Privacy note and draw terms (tick) | Yes | Consent |

Private form columns, in order: Nickname, Email, Age band, Ethnicity, Postcode, Student, Organisation or place of study,
Citizen science interest, WSTI event updates, Entry code, Agreed to privacy note and draw terms.

To add a question: add it to the private form in Google Forms first, read its entry id (form menu, "Get pre-filled link",
fill a test value, the link shows `entry.<number>`), add that id to `privateForm.fields` in `config.js`, then send the
value in the phone view's `post(C.privateForm, ...)` call.

## Files

- `index.html`: the phone form and the stage wheel
- `config.js`: the two forms' addresses and entry ids, `wheelSheetId`, the age and background options
- `festi-logo.svg`: the WSTI Festi logo, used as supplied (never crop or recolour it)
- `README.md`: setup and on-the-night steps for Lailei
- `context.md`: this file

Test locally with any static server, for example `python3 -m http.server 8000` in this folder, then open
`http://localhost:8000/?stage&demo`. The entry code needs `https` or `localhost`.

## Open items (4 Nov)

1. **Forms:** untick "Restrict to users in WSTI" on both forms (Settings, Responses). Until then, public entries are refused silently.
2. **Sheets:** ✅ the wheel Sheet is linked and in `wheelSheetId` (Frank, 4 Nov; readable from the live site's origin).
   Still to check: the private form's Sheet is linked and NOT shared. Both Sheets should end up owned by WSTI's general account.
3. **Hosting:** ✅ live on Railway at https://draw.wsti.org.au/ (4 Nov). GitHub Pages is not used.
4. **Page copy placeholders** (shown in orange on the phone page): the age limit (currently "[18] and over"),
   the contact email for privacy requests, and who contacts citizen science opt-ins (WSTI or Council).
   The prize is set: an e-gift card, emailed to each winner (Harsh, 4 Nov).
5. **One real end-to-end test** from a phone before the night: check both forms' responses and watch the name land on the wheel.

## House rules for this project

- This repo is **public**. Never commit the private Sheet's link, any entrant's details, emails, passwords or keys.
- The wheel form and its Sheet hold nickname and entry code only. Never add other columns to it.
- Page copy is Australian English, with no em dashes.
- No AI attribution lines in commits.
