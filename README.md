# Success Brand Virtual Wellness Center

A 3D / VR / AR counseling experience for [Success Brand](https://www.successbrand.org/), built with Three.js and WebXR.

**Rooms:** Lobby · Book an appointment · Session room · Relaxation lounge · Meditation lounge · Mind Garden · Founders · Contact · Staff

**Features**
- A grand portal lobby: travertine arches with glowing outlines and signs, live previews of each room, a reflective floor, a tree-of-life sculpture and a skylight vault
- Grace, a photoreal hologram guide who answers questions, books appointment requests, shares crisis resources, and speaks with a natural voice (she blinks, breathes and moves her lips as she talks)
- Staff invitations: physicians, therapists and administrators invite clients to individual or group sessions; clients open a private link to accept, decline, add to calendar and join
- Meditation lounge: a mountaintop sanctuary under the Milky Way with glowing carved arches, a valley river below, a Persian rug, glowing crystals, lanterns and a breathing meditation figure; three scenes (Milky Way, Golden dawn, Sea of clouds), a lotus that breathes with you, a singing bowl, guided meditations and a silent sit with bells
- Relaxation lounge with teak chaise loungers, hanging rattan egg chairs and generative music
- Mind Garden: a storybook garden with a Victorian gazebo, winding stone paths, flower beds, a lily pond, lamp posts and butterflies. Games: wellness trivia, Reframe It, brain teasers, Calm Words, Memory Match and a gratitude garden
- Enter VR on Meta Quest and other WebXR headsets; breathe with the orb in AR on supported phones
- Opens fast: only the lobby loads before the page appears; other rooms load in the background. Phones and modest computers automatically use lighter graphics.
- Zoom in and out with the on-screen + / − / reset buttons, the mouse wheel, pinch, or the + / − / 0 keys
- 988 / 911 crisis line on every screen

## Run it locally
Any static server works:
```
npx serve .
```
Then open the printed address.

## Hosting
**Static hosting (GitHub Pages, any web host).** Upload `index.html`, `models/` and `.nojekyll`. Everything works except Grace's AI answers and studio voice: she uses her built-in answers and the best natural voice on the visitor's device (Microsoft neural voices in Edge, Google voices in Chrome, Siri voices on Apple devices).

**Full features (Vercel).** Import this repository in Vercel, then add environment variables from `.env.example`:
- Mind Garden puzzles: a fresh wellness crossword every time, Bloom Sudoku (6×6 and 9×9, optional garden colors, notes and hints), Calm Connections matching, number games (Petal Sums, Number Flow, Balance) and memory games (Memory Match in three sizes, Glow Sequence, What Changed?)
- `ANTHROPIC_API_KEY` turns on Grace's AI answers (`api/guide.js`)
- `ELEVENLABS_API_KEY` or `OPENAI_API_KEY` turns on Grace's studio voice (`api/tts.js`)

The page checks `api/health` on load and switches these on automatically. Visitors can still pick a different voice from the chat's **Voice** menu.

## Adding it to successbrand.org (Wix)
The app must be hosted at its own address first. Turn on GitHub Pages (repository **Settings → Pages → Deploy from a branch → main → / (root) → Save**); the address is `https://mrimagemakers.github.io/SuccessBrandVR/`. Open that address on its own to confirm it loads before adding it to Wix.

**Best: a button that opens the app.** In the Wix Editor add a button such as "Enter the Virtual Wellness Center", link it to the address above, and set it to open in a new tab. This is full screen, and VR headsets, voice and booking all work.

**Also possible: show it inside a page.** Add Elements (+) → Embed Code → **Embed a Site**, paste the address, then stretch the box to full width and at least 700 px tall. Inside Wix's box, VR can't start (Wix doesn't allow it in embedded content), so the app shows an **Open full screen** button that opens it in its own tab.

**Don't** paste the contents of `index.html` into Wix's "Embed HTML" box. Wix runs pasted code from its own servers, so the furniture models and server features can't be found, and the file is larger than Wix expects.

## Building the website copy
`index.html` here is the full web page. It is generated from the app source with `python3 tools/build_site.py <source.html> index.html`, which adds the page header phones need (doctype, character set and mobile viewport).

## Staff invitations
Open **Staff** in the top menu and sign in with the staff access code.
- On static hosting the code is `SITE.STAFF_CODE` near the top of `index.html` (default `SB-STAFF-2026`). Change it before launch. This is a convenience gate, not real security; use your organization's sign-in for production.
- With `api/invite` deployed, the server checks `STAFF_CODE` instead and emails invitations through Resend (`RESEND_API_KEY`, `INVITE_FROM`) with a calendar file attached. Client accept/decline replies are emailed to the clinician (`api/rsvp`, staff addresses on `STAFF_EMAIL_DOMAIN` only).
- Without email configured, staff use **Open in email app** (group invitations use BCC) or **Copy link**.
- Each invitation lives inside its private link (`#invite-…`), so no database is needed. Links include session details only, never clinical notes, and "Keep it private" limits names to first names.
- Set `SITE.PUBLIC_URL` to the page's public address so links created from previews point to the live site.

## Before launch
- Booking requests are stored in the visitor's browser only. Connect your HIPAA-compliant scheduler or EHR in the booking form's submit handler (`#bookForm` in `index.html`).
- Live therapy video should run through your existing secure telehealth platform.
- Grace is a guide, not a clinician; she never diagnoses or advises on medication and always routes crisis messages to 988 / 911.

## Credits
3D furniture from the [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) (textures resized for the web):
- Glam Velvet Sofa, Damask Chair, Silk Pouf © Wayfair, LLC (CC BY 4.0)
- Diffuse Transmission Plant © Darmstadt Graphics Group (CC BY 4.0)
- Sheen Chair, Glass Vase with Flowers, Teacup (CC0)

Three.js © three.js authors (MIT).
