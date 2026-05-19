# Quick Start: Adding Audio Samples to Your DAW

## 3-Step Process

### 1. Create Your Sample
- **Tempo**: 128 BPM (exact)
- **Format**: MP3
- **Length**: Any (will auto-calculate bars)
- **Tip**: Start exactly on beat 1, no silence

### 2. Place the File
```
public/audio/experience/{entry-id}.mp3
```

**Experience Entry IDs** (from `content/experience.ts`):
- `hooli` → `public/audio/experience/hooli.mp3`
- `acme` → `public/audio/experience/acme.mp3`
- `startup` → `public/audio/experience/startup.mp3`
- `university` → `public/audio/experience/university.mp3`
- `certification` → `public/audio/experience/certification.mp3`
- `freelance` → `public/audio/experience/freelance.mp3`
- `open-source` → `public/audio/experience/open-source.mp3`

### 3. Test
1. Refresh the DAW page
2. Click anywhere to initialize audio
3. Drag the file from browser to playlist
4. Press play ▶
5. Sample should trigger when playhead reaches it!

## Duration Reference (at 128 BPM)

| Sample Length | Bars |
|---------------|------|
| 1.875s        | 1    |
| 3.75s         | 2    |
| 7.5s          | 4    |
| 15s           | 8    |

## Quick Troubleshooting

❌ **Sample not loading?**
- Check browser console for errors
- Verify file path matches exactly
- Ensure file is a valid MP3

❌ **Sample not playing?**
- Check channel volume > 0
- Check channel not muted
- Verify transport is playing

❌ **Wrong timing?**
- Ensure sample is exactly 128 BPM
- Make sure sample starts on beat 1
- Try re-dragging the clip

## Example: Creating a 4-Bar Loop

1. Open your DAW (Ableton, FL Studio, etc.)
2. Set BPM to 128
3. Create a 4-bar drum/synth loop
4. Export as `hooli.mp3`
5. Place in `public/audio/experience/hooli.mp3`
6. Test in the DAW!

---

For detailed documentation, see `IMPLEMENTATION.md`
