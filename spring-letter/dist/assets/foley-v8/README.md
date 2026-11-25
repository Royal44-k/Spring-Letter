# Recorded footsteps and natural ambience

Nine local PCM16 mono WAV files at 22,050 Hz. The two environmental loops are 20 seconds each, made from 22-second excerpts with a 2-second equal-power head/tail crossfade. The original field recordings contain environmental sound; no score or generated bird melody was added. All adopted sources explicitly offer CC0 1.0.

| Files | Original author and source | Adaptation |
| --- | --- | --- |
| `grass-0.wav` … `grass-2.wav` | Kenney, [Impact Sounds](https://kenney.nl/assets/impact-sounds) | Three grass footstep variants; trim, fade and resample. |
| `stone-0.wav` … `stone-2.wav` | Kenney, same package | Three **concrete** footstep variants used for the game's hard stone paths. The original filename does not claim natural stone. |
| `stone-turn.wav` | Kenney, same package | First 0.24 seconds of `impactMining_000.ogg`, used as a stone-tile contact. It is not a recording of a turning tile. |
| `birds-loop.wav` | isaiah658, [Ambient Bird Sounds](https://opengameart.org/content/ambient-bird-sounds) | Camera microphone field recording, cleaned by its author. Source seconds 3–25; crossfade to 20 seconds. |
| `river-loop.wav` | Thimras (Eike Germann), [Park ambiences](https://opengameart.org/content/park-ambiences) | Small river flowing over a low step in Adelaide, South Australia; source seconds 12–34, crossfade to 20 seconds. Author also describes some wildlife in this recording. |

`sources.json` records the original download URL, source and processed SHA-256, source format, trim/crossfade/gain parameters, bytes and measured signal levels. `CC0-1.0.txt` is the complete legal text; `Kenney-License.txt` preserves the package notice. Original author pages, downloaded originals and reproducible processing script are in `docs/blossom/research/v8-audio` in the project workspace. There is no runtime network request to the source sites.

In the audio engine, grass/stone footsteps rotate without immediately repeating. Water-adjacent ground currently uses the hard-path steps; there is no adopted splash recording. Steps use gain 0.29 (0.38 while dashing), contact 0.24, bird loop 0.22 in the daytime garden, river loop 0.025–0.305 according to proximity; these values precede the user's effects/ambience faders and master. `nearWater` accepts 0–1; missing values fall back to the zone. The ambient sources are fixed for the lifetime of an audio context and stop on disposal.

Verification is technical: complete decoding, file hashes, peaks/RMS and a continuous crossfade boundary, plus engine lifecycle and mixer tests. This is not a claim of human listening or a perceptual guarantee of inaudibility at the loop join. A natural waveform has nonzero sample-to-sample variation; `loopSeamJumpToRmsDerivative` compares that boundary step with ordinary signal variation.
