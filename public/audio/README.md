# Audio Samples for DAW

This directory contains audio samples that play when clips are triggered in the DAW playlist.

## Directory Structure

```
public/audio/
├── experience/
│   ├── hooli.mp3       # Hooli experience sample
│   ├── acme.mp3        # Acme Corp experience sample
│   └── ...             # Other experience entries
├── about/
│   ├── bio.mp3         # Bio sample
│   ├── facts.mp3       # Facts sample
│   ├── currently.mp3   # Currently sample
│   └── whoami.mp3      # Who am I sample
├── projects/
│   └── [project-id].mp3
├── skills/
│   ├── frontend.mp3
│   ├── backend.mp3
│   ├── infra.mp3
│   └── tooling.mp3
└── contact/
    └── contact.mp3
```

## Audio Specifications

- **Tempo**: 128 BPM (all samples must be exactly at this tempo)
- **Format**: MP3 (recommended), WAV, OGG, or FLAC
- **Duration**: Any length (clip duration will be calculated automatically)
- **Key**: All samples should be in compatible keys for harmonic mixing
- **Time Signature**: 4/4

## How It Works

1. When a file is dragged onto the playlist, the system checks if a corresponding MP3 exists
2. The sample's duration is analyzed and converted to musical bars at 128 BPM
3. The clip automatically gets the correct length based on the sample duration
4. During playback, when the playhead reaches the clip's start bar, the sample plays
5. Channel volume and mute controls affect the sample playback

## Adding Samples

1. Create an MP3 file at 128 BPM
2. Name it according to the file's `itemId` (see `components/daw/files.ts`)
3. Place it in the appropriate folder under `public/audio/`
4. The system will automatically detect and load it on next page load

## Example: Adding an Experience Sample

For the experience entry with `id: "hooli"`:
1. Create a drum/synth loop at 128 BPM
2. Export as `hooli.mp3`
3. Place in `public/audio/experience/hooli.mp3`
4. When you drag the "hooli" file to the playlist, it will create a clip with the correct duration

## Tips for Creating Samples

- Use a DAW to create perfectly timed loops at 128 BPM
- Ensure samples start exactly on beat 1 (no silence at beginning)
- Keep samples in compatible musical keys (e.g., all in C minor, F major, etc.)
- Consider creating 1-bar, 2-bar, or 4-bar loops for flexibility
- Test your samples by importing them into the DAW and checking the calculated duration
