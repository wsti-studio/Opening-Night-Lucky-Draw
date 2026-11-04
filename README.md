# Opening Night Lucky Draw

WSTI Festi 2026 Opening Night, Thursday 5 November. Built 3 November 2026.

- **Phone form:** the site link. People scan the QR on the big screen.
- **Wheel for the stage:** the site link with `?stage&key=…` on the end. The key is the Railway variable `DRAW_KEY`
  (ask Frank; never commit it). Without the key the wheel still works, but winners are kept on that laptop only.
- **Rehearsal:** `?stage&demo` fills the wheel with 100 test names. Real entries are not touched.

## How the data moves

```
Phone form ──► private form ──► private Sheet (all answers, WSTI only)
           └─► wheel form   ──► wheel Sheet (nickname + entry code, link-viewable)
                                   │
                    wheel on stage ◄┘ reads it every 5 seconds
```

The entry code comes from the email, so the same email always gets the same code
and only counts once on the wheel. To email a winner, find their code in the private Sheet.

## Setup

1. **Private form:** Settings, Responses, untick "Restrict to users in WSTI". Then the Responses tab,
   Link to Sheets, Create. Keep this Sheet private.
2. **Wheel form:** the same untick, then Link to Sheets, Create. In that new Sheet: Share,
   General access, "Anyone with the link", Viewer. Put the Sheet's id in `wheelSheetId` in `config.js`.
3. **GitHub Pages:** Settings, Pages, Branch `main`, folder `/ (root)`, Save. The site appears at
   `https://wsti-studio.github.io/Opening-Night-Lucky-Draw/` within a couple of minutes.
4. **Test** before the night: one real entry from a phone, check both Sheets, watch it land on the wheel.

## On the night (Lailei)

1. Open the `?stage` link on the stage laptop and click **Full screen**.
2. People scan the QR. Names land on the wheel by themselves, with a pop-up for each one.
3. When it's time, click **Close entries** so the wheel stops changing.
4. Click **SPIN** (or press the space bar or the clicker). The winner shows big with their entry code.
   - **Confirm winner** keeps them and takes them off the wheel.
   - **Not eligible, redraw** removes them without counting them.
5. After five winners, click **Copy winners** and send the list to whoever emails the prizes.

Winners are saved on the server (a Railway volume), so a reload, another browser or another laptop shows the same list.
The Winners heading says **Saved online** when this works. **Clear** next to it (click twice) empties the list;
**Reset draw** (click twice) also clears removed names and reopens entries.

## If a rude nickname comes in

Delete that row in the wheel Sheet. It leaves the wheel within 5 seconds.

## Files

- `index.html`: the phone form and the wheel
- `server.js`: serves the site and stores the winners (`/api/winners`, needs the key). Railway runs `npm start`
- `config.js`: form addresses, the wheel Sheet id, the age and background options (ABS)
- `festi-logo.svg`: WSTI Festi logo
