# Success Brand Virtual Wellness Center

A 3D / VR / AR counseling experience for [Success Brand](https://www.successbrand.org/), built with Three.js and WebXR.

**Rooms:** Lobby · Book an appointment · Session room · Relaxation lounge · Meditation lounge · Mind Garden · Founders · Contact

**Features**
- Sage, a virtual guide who answers questions, books appointment requests, shares crisis resources, and speaks with a natural voice
- Meditation lounge with three scenes (Aurora night, Golden dawn, Moonlit mist), a lotus that breathes with you, a singing bowl, guided meditations and a silent sit with bells
- Relaxation lounge with teak chaise loungers, hanging rattan egg chairs and generative music
- Mind Garden games: wellness trivia, Reframe It, brain teasers, Calm Words, Memory Match and a gratitude garden
- Enter VR on Meta Quest and other WebXR headsets; breathe with the orb in AR on supported phones
- 988 / 911 crisis line on every screen

## Run it locally
Any static server works:
```
npx serve .
```
Then open the printed address.

## Hosting
**Static hosting (GitHub Pages, any web host).** Upload `index.html`, `models/` and `.nojekyll`. Everything works except Sage's AI answers and studio voice: she uses her built-in answers and the best natural voice on the visitor's device (Microsoft neural voices in Edge, Google voices in Chrome, Siri voices on Apple devices).

**Full features (Vercel).** Import this repository in Vercel, then add environment variables from `.env.example`:
- `ANTHROPIC_API_KEY` turns on Sage's AI answers (`api/guide.js`)
- `ELEVENLABS_API_KEY` or `OPENAI_API_KEY` turns on Sage's studio voice (`api/tts.js`)

The page checks `api/health` on load and switches these on automatically. Visitors can still pick a different voice from the chat's **Voice** menu.

## Before launch
- Booking requests are stored in the visitor's browser only. Connect your HIPAA-compliant scheduler or EHR in the booking form's submit handler (`#bookForm` in `index.html`).
- Live therapy video should run through your existing secure telehealth platform.
- Sage is a guide, not a clinician; she never diagnoses or advises on medication and always routes crisis messages to 988 / 911.

## Credits
3D furniture from the [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) (textures resized for the web):
- Glam Velvet Sofa, Damask Chair, Silk Pouf © Wayfair, LLC (CC BY 4.0)
- Diffuse Transmission Plant © Darmstadt Graphics Group (CC BY 4.0)
- Sheen Chair, Glass Vase with Flowers, Teacup (CC0)

Three.js © three.js authors (MIT).
