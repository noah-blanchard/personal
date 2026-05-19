# DAW Audio Playback System - Implementation Guide

## Overview

The DAW now has a fully functional audio playback system powered by Tone.js. When you drag files from the browser onto the playlist, they can trigger corresponding MP3 samples that play in perfect sync with the transport at 128 BPM.

## Architecture Summary

### Core Components

1. **ToneEngine** (`audio/ToneEngine.ts`)
   - Singleton managing Tone.js Transport
   - Handles sample loading and caching
   - Provides transport control (play, stop, seek, BPM)
   - Schedules sample playback at precise musical times

2. **PlaybackScheduler** (`audio/PlaybackScheduler.ts`)
   - Monitors transport position
   - Triggers samples when playhead reaches their start bar
   - Uses lookahead scheduling for tight timing (100ms ahead)
   - Respects channel volume and mute controls

3. **React Hooks**
   - `useToneEngine()` - Access ToneEngine from React components
   - `usePlaybackScheduler()` - Automatically manages scheduler lifecycle

4. **Integration**
   - `DAWProvider` - Initializes audio engine and loads samples
   - `DAWToolbar` - Transport controls connected to ToneEngine
   - `types.ts` - Extended with `durationBars` field

## How It Works

### 1. Sample Loading

When the DAW first loads:
- System scans `public/audio/` for available MP3 files
- Each file is loaded into a `Tone.Player` and cached
- Sample duration is analyzed and converted to bars at 128 BPM
- Files in the browser are updated with their `durationBars` value

### 2. Creating Clips

When you drag a file to the playlist:
- If the file has a corresponding MP3 sample:
  - Clip length is automatically set to match sample duration
  - Example: 4-bar sample → clip is 4 bars long
- If no sample exists:
  - Clip gets default 4-bar length
  - No audio will play

### 3. Playback

When you press play:
1. ToneEngine starts Tone.js Transport at current BPM (128)
2. PlaybackScheduler begins monitoring playhead position
3. For each clip whose start bar is approaching:
   - Sample is scheduled to play at exact musical time
   - Channel volume and mute are applied
   - Clip is marked as "triggered" to prevent re-triggering
4. When transport stops, all scheduled events are cleared

### 4. Timing Precision

The system uses multiple strategies for tight timing:
- **Lookahead Scheduling**: Checks 100ms ahead for upcoming clips
- **Tone.js Transport**: Uses musical time (bars:beats:sixteenths)
- **Bar-based Triggering**: Ensures samples start exactly on beat 1 of their bar
- **Fallback Safety**: Also triggers on bar changes in case lookahead misses

## Using the Audio System

### Adding Audio Samples

1. **Create your audio file**:
   - Tempo: Exactly 128 BPM
   - Format: MP3 (recommended), WAV, OGG, or FLAC
   - Length: Any duration (will auto-calculate bars)
   - Key: Choose compatible keys for harmonic mixing
   - Start: Begin exactly on beat 1 (no silence)

2. **Name and place the file**:
   ```
   public/audio/{folderId}/{itemId}.mp3
   ```
   - `folderId`: One of `experience`, `about`, `projects`, `skills`, `contact`
   - `itemId`: Matches the file's ID from `files.ts`

3. **Examples**:
   ```
   public/audio/experience/hooli.mp3      # For Hooli work entry
   public/audio/experience/acme.mp3       # For Acme Corp entry
   public/audio/about/bio.mp3             # For bio file
   public/audio/skills/frontend.mp3       # For frontend skills
   ```

4. **Reload the DAW**:
   - Refresh the page
   - Samples are loaded on first user interaction (click/keydown)
   - Check browser console for loading messages

### Testing Your Samples

1. **Verify loading**:
   - Open browser console
   - Look for: `[ToneEngine] Loaded sample: experience:hooli (7.50s = 4.00 bars)`

2. **Test playback**:
   - Drag the corresponding file from browser to playlist
   - Clip should appear with correct length
   - Press play
   - Sample should trigger when playhead reaches it

3. **Adjust channel controls**:
   - Use channel volume fader to adjust sample volume
   - Click "M" button to mute/unmute
   - Changes apply in real-time during playback

## Duration Calculation

The system automatically calculates how many bars a sample occupies:

```
bars = (durationSeconds × BPM) / 60 / 4
```

At 128 BPM:
- 1 bar = 1.875 seconds
- 2 bars = 3.75 seconds
- 4 bars = 7.5 seconds
- 8 bars = 15 seconds

Examples:
- 7.5 second sample → 4 bars
- 3.75 second sample → 2 bars
- 1.875 second sample → 1 bar

## Troubleshooting

### Samples Not Loading

**Check console for errors**:
```
[ToneEngine] Failed to load sample experience:hooli: ...
```

**Common issues**:
- File not at expected path: `public/audio/experience/hooli.mp3`
- File not a valid audio format
- CORS issues (shouldn't happen with files in `public/`)
- Audio context not initialized (requires user interaction)

### Samples Not Playing

1. **Check if sample is loaded**:
   ```javascript
   // In browser console
   toneEngine.isSampleLoaded("experience:hooli")
   ```

2. **Verify clip placement**:
   - Clip must be on a channel
   - Playhead must reach the clip's start bar

3. **Check channel controls**:
   - Channel volume > 0
   - Channel not muted
   - Master volume up

4. **Check transport state**:
   - Transport must be playing (▶ button active)
   - BPM set to 128

### Timing Issues

If samples don't play at the right time:

1. **Check BPM**: Must be exactly 128 BPM for all samples
2. **Check sample start**: Ensure no silence at beginning
3. **Check bar alignment**: Samples should start exactly on bar 1
4. **Try re-dragging clip**: Sometimes helps if clip was placed before sample loaded

### Audio Quality Issues

- **Clicks/pops**: Sample may not be trimmed properly
- **Distortion**: Reduce sample volume or channel volume
- **Latency**: Should be minimal with Tone.js, check browser audio settings

## Advanced Usage

### Programmatic Sample Triggering

You can manually trigger samples using the ToneEngine:

```javascript
import { getToneEngine } from "./audio/ToneEngine"

const engine = getToneEngine()
engine.scheduleSample("experience:hooli", 5, 80, false) // Play at bar 5, 80% volume
```

### Custom Sample Loading

Load samples dynamically:

```javascript
const toneEngine = useToneEngine()

await toneEngine.loadSample("custom:sample", "/path/to/sample.mp3")
```

### BPM Changes

The system supports BPM changes, but all samples are recorded at 128 BPM:

```javascript
toneEngine.setBpm(130) // Samples will play slightly faster/slower
```

⚠️ **Note**: Changing BPM will affect sample duration and timing. For best results, keep BPM at 128.

## Performance Considerations

- **Sample Loading**: All samples load on first interaction (may take time with many files)
- **Memory**: Each sample is cached in memory (consider lazy loading for large libraries)
- **CPU**: PlaybackScheduler runs every 50ms during playback (minimal impact)
- **Audio Context**: Only one AudioContext per page (Tone.js handles this)

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may require user interaction)
- **Mobile**: Limited support (audio context restrictions)

## Future Enhancements

Potential improvements for the future:

1. **Sample Looping**: Loop samples for clips longer than sample duration
2. **Pitch Shifting**: Adjust sample pitch to match musical key
3. **Sample Warping**: Time-stretch samples to fit any BPM
4. **Per-Clip Envelopes**: Fade in/out for smoother playback
5. **Sample Preview**: Preview sample on hover in browser
6. **Waveform Display**: Visual representation of samples in clips
7. **Multiple Sample Versions**: Different samples for different contexts
8. **Sample Groups**: Trigger multiple samples simultaneously

## Resources

- **Tone.js Documentation**: https://tonejs.github.io/docs/
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Musical Time**: https://en.wikipedia.org/wiki/Musical_time

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify sample file paths and formats
3. Ensure BPM is exactly 128
4. Test with a simple 1-bar sample first

---

**Implementation Date**: May 19, 2026  
**Tone.js Version**: 15.1.22  
**Architecture**: Singleton ToneEngine + React Hooks + PlaybackScheduler
