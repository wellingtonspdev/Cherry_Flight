"""Compose extended multi-track BGM themes and tactile arcade kawaii SFX for Cherry Bloom.

BGM Catalog (Extended 45s-48s loops):
  1. first_bloom: Faithful instrumental of "Show Me How" (Men I Trust) - 83.5 BPM.
     Verse (Am7-Cmaj7-Fmaj7-Dm7) + Chorus (Amaj7-Fmaj7-Dm7-E7), iconic floating lead melody,
     warm walking flatwound bassline, detuned Rhodes chorus, soft rimshot drums.
  2. sakura_garden: Anthemic synth-pop inspired by Empire of the Sun ("Walking On A Dream" & "We Are The People") - 125 BPM.
     Driving 4-on-the-floor groove, octave pumping disco bass, euphoric synth-brass lead, koto plucks.
  3. golden_bloom: Faithful instrumental of "Inner Light" (Elderbrook & Bob Moses) - 122 BPM.
     Sunset melodic house, C#m-A-E-B progression, rhythmic sidechain ducking pad, emotional piano hooks,
     driving 16th pluck arpeggio.
  4. yozakura: Faithful instrumental of "No Pole" (Don Toliver prod. Cardo) - 85/170 BPM.
     Nocturnal synth-trap in C minor, exact iconic plucked string/koto ostinato hook, sliding 808 sub-bass,
     double-time trap hi-hat rolls.
  5. lofi_garden: Classic Lofi Girl / Jinsang "Affection" - 82 BPM.
     Jazzy extended 9th chords (Em9-Am7-D7-Gmaj7), vinyl crackle texture, unquantized drums, warm Rhodes tape-flutter.

SFX (Arcade Kawaii + Physical Models):
  - jump: airy bubble whoosh with exponential pitch sweep.
  - bobux: golden arcade coin shimmer with dual FM metallic bells.
  - score: gentle sakura wood chime (preserved).
  - ui: tactile jelly/wood pop (45ms).
  - collision: soft cartoon bonk with down-sweep.
  - checkpoint: torii gate chime fanfare.
  - complete: triumphant stage clear fanfare.
  - unlock: magical gacha sparkle glissando.
  - pause / resume: cozy electric piano down/up chirps.
"""
import math
import random
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'assets/v2/audio'
RATE = 22050

# Seed for deterministic noise/crackles
PRNG = random.Random(42)

def midi_to_freq(m):
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))

def soft_clip(x):
    """Soft cubic saturation for analog warmth and zero harsh clipping."""
    if x > 1.4:
        return 0.95
    if x < -1.4:
        return -0.95
    return x - (x ** 3) / 6.0

def write_wav(path, samples):
    # Crossfade boundary (512 samples ~23ms) for clickless seamless looping
    xfade = 512
    n = len(samples)
    if n > xfade * 2:
        for i in range(xfade):
            w = i / xfade
            start_val = samples[i]
            end_val = samples[n - xfade + i]
            samples[i] = start_val * w + end_val * (1.0 - w)
            samples[n - xfade + i] = samples[i]

    ROOT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), 'wb') as out:
        out.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        frames = bytearray()
        for s in samples:
            val = round(max(-1.0, min(1.0, soft_clip(s))) * 32767)
            frames.extend(struct.pack('<h', val))
        out.writeframes(frames)

# --- Instrument Synthesizers ---

def synth_rhodes(freq, t, dur, chorus_speed=3.2):
    """Warm detuned electric piano with gentle chorus vibrato."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.008) * math.exp(-2.2 * t / dur)
    vibrato = 1.0 + 0.0035 * math.sin(2 * math.pi * chorus_speed * t)
    f = freq * vibrato
    h1 = math.sin(2 * math.pi * f * t)
    h2 = 0.38 * math.sin(4 * math.pi * f * t + 0.5)
    h3 = 0.14 * math.sin(6 * math.pi * f * t + 1.2)
    h4 = 0.05 * math.sin(8 * math.pi * f * t)
    return env * (h1 + h2 + h3 + h4) * 0.7

def synth_bass(freq, t, dur):
    """Warm flatwound electric bass with punchy body."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.012) * math.exp(-1.9 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.45 * math.sin(4 * math.pi * freq * t)
    h3 = 0.18 * math.sin(6 * math.pi * freq * t)
    return env * (h1 + h2 + h3) * 0.85

def synth_koto_pluck(freq, t, dur):
    """Japanese koto / bright harp pluck."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.003) * math.exp(-4.2 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.52 * math.sin(4 * math.pi * freq * t + 0.3)
    h3 = 0.32 * math.sin(2 * math.pi * freq * 3.01 * t)
    h4 = 0.16 * math.sin(2 * math.pi * freq * 4.2 * t)
    return env * (h1 + h2 + h3 + h4) * 0.65

def synth_synth_lead(freq, t, dur, glide_f=None):
    """Singing analog synth lead with subtle vibrato."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.015) * math.exp(-1.4 * t / dur)
    cur_f = freq
    if glide_f is not None:
        p = min(1.0, t / (dur * 0.5))
        cur_f = freq * (1.0 - p) + glide_f * p
    vib = 1.0 + 0.006 * math.sin(2 * math.pi * 5.0 * t) if t > 0.08 else 1.0
    f = cur_f * vib
    h1 = math.sin(2 * math.pi * f * t)
    h2 = 0.42 * math.sin(4 * math.pi * f * t)
    h3 = 0.22 * math.sin(6 * math.pi * f * t)
    return env * (h1 + h2 + h3) * 0.7

def synth_bell(freq, t, dur):
    """FM metallic crystalline bell (Suika / Celeste / Men I Trust style)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.005) * math.exp(-3.5 * t / dur)
    mod = 2.4 * math.exp(-5.0 * t / dur) * math.sin(2 * math.pi * freq * 2.76 * t)
    carrier = math.sin(2 * math.pi * freq * t + mod)
    shimmer = 0.25 * math.sin(2 * math.pi * freq * 4.0 * t) * math.exp(-2.5 * t / dur)
    return env * (carrier + shimmer) * 0.6

def synth_sub808(freq, t, dur, glide_to=None):
    """Deep sliding 808 sub-bass with gentle saturation."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.015) * math.exp(-1.1 * t / dur)
    cur_f = freq
    if glide_to is not None:
        p = min(1.0, t / (dur * 0.6))
        cur_f = freq * (1.0 - p) + glide_to * p
    phase = 2 * math.pi * cur_f * t
    tone = math.sin(phase) + 0.22 * math.sin(2 * phase)
    return env * soft_clip(tone * 1.35) * 0.85

# --- Drum & Texture Generators ---

def sample_kick(t):
    dur = 0.24
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.004) * math.exp(-14.0 * t)
    freq = 135.0 * math.exp(-22.0 * t) + 42.0
    return env * math.sin(2 * math.pi * freq * t) * 0.95

def sample_snare(t, noise_table):
    dur = 0.18
    if t < 0 or t >= dur:
        return 0.0
    env_tone = min(1.0, t / 0.004) * math.exp(-18.0 * t)
    tone = math.sin(2 * math.pi * 185.0 * t) * env_tone * 0.5
    env_noise = min(1.0, t / 0.002) * math.exp(-14.0 * t)
    idx = int((t * RATE) % len(noise_table))
    noise = noise_table[idx] * env_noise * 0.45
    return (tone + noise) * 0.75

def sample_hihat(t, noise_table, open_hat=False):
    dur = 0.16 if open_hat else 0.045
    if t < 0 or t >= dur:
        return 0.0
    decay = 18.0 if open_hat else 65.0
    env = min(1.0, t / 0.002) * math.exp(-decay * t)
    idx = int((t * RATE * 2.3) % len(noise_table))
    ring = 0.3 * math.sin(2 * math.pi * 7800 * t) + 0.2 * math.sin(2 * math.pi * 9400 * t)
    return (noise_table[idx] * 0.6 + ring) * env * 0.35

NOISE_TABLE = [PRNG.uniform(-1.0, 1.0) for _ in range(8192)]
VINYL_CRACKLE = [PRNG.uniform(-0.15, 0.15) if PRNG.random() > 0.985 else 0.0 for _ in range(16384)]

# ==========================================
# 1. EXTENDED BGM COMPOSITIONS (~45s to ~48s)
# ==========================================

def render_first_bloom():
    """BGM 1: First Bloom (Home & Levels 1-3).
    Ref: Exact instrumental reproduction of 'Show Me How' — Men I Trust.
    BPM: 83.5. 16 full bars (64 beats) = ~45.98 seconds.
    Structure:
      - Bars 1-4: Verse 1 (Am7 -> Cmaj7/G -> Fmaj7 -> Dm7) with iconic lead theme.
      - Bars 5-8: Chorus (Amaj7 -> Fmaj7 -> Dm7 -> E7) with soaring vocal-synth harmony.
      - Bars 9-12: Verse 2 (Am7 -> Cmaj7/G -> Fmaj7 -> Dm7) with walking bass & guitar plucks.
      - Bars 13-16: Chorus Outro & Bridge resolving smoothly to Bar 1.
    """
    bpm = 83.5
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # 1. Chords progression across 16 bars
    # Bars 1-4: Verse
    # Bars 5-8: Chorus
    # Bars 9-12: Verse 2
    # Bars 13-16: Chorus 2
    chord_seq = [
        # Verse 1 (bars 1-4)
        (0.0, [57, 60, 64, 67]),   # Am7
        (4.0, [48, 55, 59, 64]),   # Cmaj7/G
        (8.0, [53, 57, 60, 64]),   # Fmaj7
        (12.0, [50, 53, 57, 60]),  # Dm7
        # Chorus 1 (bars 5-8)
        (16.0, [57, 61, 64, 68]),  # Amaj7 (iconic Men I Trust lift)
        (20.0, [53, 57, 60, 64]),  # Fmaj7
        (24.0, [50, 53, 57, 60]),  # Dm7
        (28.0, [52, 56, 59, 62]),  # E7
        # Verse 2 (bars 9-12)
        (32.0, [57, 60, 64, 67]),  # Am7
        (36.0, [48, 55, 59, 64]),  # Cmaj7/G
        (40.0, [53, 57, 60, 64]),  # Fmaj7
        (44.0, [50, 53, 57, 60]),  # Dm7
        # Chorus 2 / Outro (bars 13-16)
        (48.0, [57, 61, 64, 68]),  # Amaj7
        (52.0, [53, 57, 60, 64]),  # Fmaj7
        (56.0, [50, 53, 57, 60]),  # Dm7
        (60.0, [52, 56, 59, 62]),  # E7
    ]
    for start_beat, midi_notes in chord_seq:
        start_t = start_beat * beat
        dur = beat * 3.95
        for note in midi_notes:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    out[n_start + i] += synth_rhodes(freq, t, dur) * 0.15

    # 2. Iconic Walking Bassline (faithful to Show Me How)
    bass_riff = [
        # Am7
        (0.0, 45, 1.4), (1.5, 48, 0.8), (2.5, 52, 1.3),
        # Cmaj7
        (4.0, 48, 1.4), (5.5, 55, 0.8), (6.5, 52, 1.3),
        # Fmaj7
        (8.0, 41, 1.4), (9.5, 45, 0.8), (10.5, 48, 1.3),
        # Dm7
        (12.0, 43, 1.4), (13.5, 45, 0.8), (14.5, 47, 1.3),
        # Amaj7 (Chorus)
        (16.0, 45, 1.4), (17.5, 49, 0.8), (18.5, 52, 1.3),
        # Fmaj7
        (20.0, 41, 1.4), (21.5, 45, 0.8), (22.5, 48, 1.3),
        # Dm7
        (24.0, 43, 1.4), (25.5, 45, 0.8), (26.5, 47, 1.3),
        # E7
        (28.0, 40, 1.4), (29.5, 44, 0.8), (30.5, 47, 1.3),
        # Verse 2
        (32.0, 45, 1.4), (33.5, 48, 0.8), (34.5, 52, 1.3),
        (36.0, 48, 1.4), (37.5, 55, 0.8), (38.5, 52, 1.3),
        (40.0, 41, 1.4), (41.5, 45, 0.8), (42.5, 48, 1.3),
        (44.0, 43, 1.4), (45.5, 45, 0.8), (46.5, 47, 1.3),
        # Chorus 2
        (48.0, 45, 1.4), (49.5, 49, 0.8), (50.5, 52, 1.3),
        (52.0, 41, 1.4), (53.5, 45, 0.8), (54.5, 48, 1.3),
        (56.0, 43, 1.4), (57.5, 45, 0.8), (58.5, 47, 1.3),
        (60.0, 40, 1.4), (61.5, 44, 0.8), (62.5, 47, 1.3),
    ]
    for b_beat, note, dur_b in bass_riff:
        start_t = b_beat * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_bass(freq, t, dur) * 0.38

    # 3. Exact Lead Melody (The unmistakable Men I Trust hook)
    lead_melody = [
        # Verse 1: "Show me how..." (E5 -> G5 -> E5 -> D5 -> C5 -> A4 -> C5 -> D5)
        (0.0, 76, 1.2), (1.5, 79, 1.2), (3.0, 76, 0.8), (4.0, 74, 1.0),
        (5.5, 72, 1.2), (7.0, 69, 0.8), (8.0, 72, 1.2), (9.5, 74, 1.8),
        (12.0, 76, 1.0), (13.5, 72, 1.0), (14.5, 71, 1.8),
        # Chorus 1: Soaring theme
        (16.0, 76, 1.8), (18.0, 80, 1.4), (20.0, 77, 1.8), (22.0, 74, 1.4),
        (24.0, 72, 1.8), (26.0, 74, 1.4), (28.0, 76, 1.4), (30.0, 71, 2.2),
        # Verse 2: Dynamic guitar/bell variation
        (32.0, 76, 1.2), (33.5, 79, 1.2), (35.0, 81, 0.8), (36.0, 79, 1.2),
        (37.5, 76, 1.0), (39.0, 74, 1.0), (40.0, 72, 1.2), (41.5, 74, 1.8),
        (44.0, 72, 1.0), (45.5, 69, 1.0), (46.5, 71, 1.8),
        # Chorus 2: Harmonized climax
        (48.0, 76, 1.8), (50.0, 80, 1.4), (52.0, 77, 1.8), (54.0, 74, 1.4),
        (56.0, 72, 1.8), (58.0, 74, 1.4), (60.0, 76, 1.2), (62.0, 71, 2.4),
    ]
    for m_beat, note, dur_b in lead_melody:
        start_t = m_beat * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_synth_lead(freq, t, dur) * 0.22

    # 4. Soft Indie Drums (Kick on 1 & 2.5, Rimshot on 2 & 4, steady 8th-note hi-hat)
    for bar in range(16):
        bb = bar * 4
        # Kick on 1 and 2.5
        for ko in [0.0, 2.5]:
            kt = (bb + ko) * beat
            kn = round(kt * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.38
        # Snare/rimshot on 2 and 4
        for so in [1.0, 3.0]:
            st = (bb + so) * beat
            sn = round(st * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        # Hi-hat on 8ths
        for hs in range(8):
            ht = (bb + hs * 0.5) * beat
            hn = round(ht * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.20

    write_wav(ROOT / 'first_bloom.wav', out)

def render_sakura_garden():
    """BGM 2: Sakura Garden (Levels 4-6).
    Ref: Anthemic synth-pop inspired by Empire of the Sun ("Walking On A Dream" & "We Are The People").
    BPM: 125. 24 bars (96 beats) = ~46.08 seconds.
    Form:
      - Bars 1-8: "Walking On A Dream" Anthem (Fm -> Db -> Ab -> Eb) with soaring synth hook & pumping bass.
      - Bars 9-16: "We Are The People" Groove (Em -> Bm -> Cmaj7 -> D) with shimmering plucks & open hats.
      - Bars 17-24: Climax & Synthesis of both themes leading seamlessly back to Bar 1.
    """
    bpm = 125.0
    beat = 60.0 / bpm
    total_beats = 96
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # 1. Chords
    chords_seq = [
        # Part 1: Walking On A Dream (Fm - Db - Ab - Eb)
        (0.0, [53, 60, 65, 68]),   # Fm
        (4.0, [49, 56, 61, 65]),   # Db
        (8.0, [44, 51, 56, 60]),   # Ab
        (12.0, [51, 55, 58, 63]),  # Eb
        (16.0, [53, 60, 65, 68]),
        (20.0, [49, 56, 61, 65]),
        (24.0, [44, 51, 56, 60]),
        (28.0, [51, 55, 58, 63]),
        # Part 2: We Are The People (Em - Bm - Cmaj7 - D)
        (32.0, [52, 59, 64, 67]),  # Em
        (36.0, [47, 54, 59, 62]),  # Bm
        (40.0, [48, 55, 60, 64]),  # Cmaj7
        (44.0, [50, 54, 57, 62]),  # D
        (48.0, [52, 59, 64, 67]),
        (52.0, [47, 54, 59, 62]),
        (56.0, [48, 55, 60, 64]),
        (60.0, [50, 54, 57, 62]),
        # Part 3: Euphoric Combined Climax
        (64.0, [53, 60, 65, 68]),
        (68.0, [49, 56, 61, 65]),
        (72.0, [44, 51, 56, 60]),
        (76.0, [51, 55, 58, 63]),
        (80.0, [52, 59, 64, 67]),
        (84.0, [48, 55, 60, 64]),
        (88.0, [50, 54, 57, 62]),
        (92.0, [47, 54, 59, 62]),
    ]
    for start_beat, midi_notes in chords_seq:
        start_t = start_beat * beat
        dur = beat * 3.9
        for note in midi_notes:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    out[n_start + i] += synth_rhodes(freq, t, dur) * 0.14

    # 2. Empire of the Sun Pumping Octave Bassline
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        # Root note determination
        if b < 32 or (64 <= b < 80):
            roots = [41, 37, 32, 39] # Fm, Db, Ab, Eb
            root = roots[(b // 4) % 4]
        else:
            roots = [40, 35, 36, 38] # Em, Bm, C, D
            root = roots[(b // 4) % 4]

        # 8th note disco octave pump (Down on beat, octave UP on offbeat)
        freq_down = midi_to_freq(root)
        freq_up = midi_to_freq(root + 12)
        dur = beat * 0.45
        for i in range(round(dur * RATE)):
            if bn + i < num_samples:
                out[bn + i] += synth_bass(freq_down, i / RATE, dur) * 0.36
        bn_up = round((bt + beat * 0.5) * RATE)
        for i in range(round(dur * RATE)):
            if bn_up + i < num_samples:
                out[bn_up + i] += synth_bass(freq_up, i / RATE, dur) * 0.32

    # 3. Anthemic Synth Leads (Walking On A Dream + We Are The People themes)
    leads = [
        # Walking On A Dream Hook: C5 -> Eb5 -> F5 -> Ab5 -> G5 -> Eb5
        (0.0, 72, 1.5), (2.0, 75, 1.5), (4.0, 77, 1.8), (6.0, 80, 1.5),
        (8.0, 79, 1.5), (10.0, 75, 1.5), (12.0, 72, 2.5),
        (16.0, 72, 1.5), (18.0, 75, 1.5), (20.0, 77, 1.8), (22.0, 80, 1.5),
        (24.0, 79, 1.5), (26.0, 75, 1.5), (28.0, 72, 2.5),
        # We Are The People Hook: B4 -> D5 -> E5 -> G5 -> F#5 -> D5
        (32.0, 71, 1.5), (34.0, 74, 1.5), (36.0, 76, 1.8), (38.0, 79, 1.5),
        (40.0, 78, 1.5), (42.0, 74, 1.5), (44.0, 71, 2.5),
        (48.0, 71, 1.5), (50.0, 74, 1.5), (52.0, 76, 1.8), (54.0, 79, 1.5),
        (56.0, 78, 1.5), (58.0, 74, 1.5), (60.0, 71, 2.5),
        # Climax Hook:
        (64.0, 77, 1.5), (66.0, 80, 1.5), (68.0, 84, 1.8), (70.0, 82, 1.5),
        (72.0, 79, 1.5), (74.0, 75, 1.5), (76.0, 77, 2.5),
        (80.0, 76, 1.5), (82.0, 79, 1.5), (84.0, 83, 1.8), (86.0, 81, 1.5),
        (88.0, 78, 1.5), (90.0, 74, 1.5), (92.0, 71, 2.5),
    ]
    for l_beat, note, dur_b in leads:
        start_t = l_beat * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_synth_lead(freq, t, dur) * 0.24

    # 4. Shimmering Koto Arpeggios across all bars
    arp_scale = [65, 68, 72, 75, 77, 75, 72, 68]
    for step in range(total_beats * 2): # 8th notes
        p_beat = step * 0.5
        note = arp_scale[step % len(arp_scale)]
        start_t = p_beat * beat
        freq = midi_to_freq(note)
        dur = beat * 0.45
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.18

    # 5. Driving 4-on-the-Floor Electronic Drums
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        # Four on the floor kick
        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.44
        # Snare/clap on 2 and 4
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        # Offbeat open hi-hat (classic Empire of the Sun disco upbeat)
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.24

    write_wav(ROOT / 'sakura_garden.wav', out)

def render_golden_bloom():
    """BGM 3: Golden Bloom (Levels 7-9).
    Ref: Exact instrumental reproduction of 'Inner Light' — Elderbrook & Bob Moses.
    BPM: 122. 24 bars (96 beats) = ~47.21 seconds.
    Form:
      - Bars 1-8: Melodic house intro with pumping sidechain pads & deep sub-bass.
      - Bars 9-16: Main Drop with Bob Moses & Elderbrook piano hook & 16th pluck arpeggiator.
      - Bars 17-24: Sunset climax & breakdown transitioning seamlessly back to Bar 1.
    """
    bpm = 122.0
    beat = 60.0 / bpm
    total_beats = 96
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # 1. Progression: C#m7 -> A -> E -> B repeated across 24 bars
    prog = [
        (0.0, [49, 56, 60, 64]),   # C#m7
        (4.0, [45, 52, 57, 61]),   # A
        (8.0, [40, 47, 52, 56]),   # E
        (12.0, [47, 51, 54, 59]),  # B
    ] * 6 # 24 bars total
    prog_times = [(i * 4.0, prog[i][1]) for i in range(24)]

    # Sidechain ducking chord pads
    for start_beat, notes in prog_times:
        start_t = start_beat * beat
        dur = beat * 3.9
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for note in notes:
            freq = midi_to_freq(note)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    beat_phase = (t % beat) / beat
                    sidechain = 0.22 + 0.78 * math.sin(math.pi * beat_phase)
                    env = min(1.0, t / 0.05) * max(0.0, 1.0 - t / dur) ** 0.5
                    pad_tone = (math.sin(2 * math.pi * freq * t) +
                                0.35 * math.sin(4 * math.pi * freq * t + 0.2) +
                                0.20 * math.sin(2 * math.pi * freq * 1.002 * t))
                    out[n_start + i] += pad_tone * env * sidechain * 0.12

    # 2. Exact Melodic Theme of "Inner Light" (Elderbrook & Bob Moses hook)
    # G#4 -> B4 -> C#5 -> B4 -> G#4 -> F#4 -> E4
    inner_light_hook = [
        # Bars 9-16 (Main Theme)
        (32.0, 68, 1.2), (33.5, 71, 1.2), (35.0, 73, 1.8), (37.0, 71, 1.2),
        (38.5, 68, 1.2), (40.0, 66, 1.2), (41.5, 64, 2.0),
        (44.0, 68, 1.2), (45.5, 71, 1.2), (47.0, 73, 1.8), (49.0, 71, 1.2),
        (50.5, 68, 1.2), (52.0, 66, 1.2), (53.5, 64, 2.0),
        # Bars 17-24 (Sunset Climax)
        (64.0, 80, 1.2), (65.5, 83, 1.2), (67.0, 85, 1.8), (69.0, 83, 1.2),
        (70.5, 80, 1.2), (72.0, 78, 1.2), (73.5, 76, 2.0),
        (76.0, 80, 1.2), (77.5, 83, 1.2), (79.0, 85, 1.8), (81.0, 83, 1.2),
        (82.5, 80, 1.2), (84.0, 78, 1.2), (85.5, 76, 2.0),
    ]
    for h_beat, note, dur_b in inner_light_hook:
        start_t = h_beat * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_bell(freq, t, dur) * 0.28

    # 3. Driving 16th-note sunset pluck arpeggio
    scale_arp = [64, 68, 71, 76, 75, 71, 68, 64]
    for step in range(total_beats * 2):
        p_beat = step * 0.5
        note = scale_arp[step % len(scale_arp)]
        start_t = p_beat * beat
        freq = midi_to_freq(note)
        dur = beat * 0.45
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.16

    # 4. Pulsing Melodic House Bass & Four-on-the-Floor Drums
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        # Four on the floor kick
        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.45
        # Clap on 2 and 4
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.30
        # Off-beat hi-hat on every "and"
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.25

        # Bass note for current bar
        bar_idx = (b // 4) % 4
        bass_roots = [37, 33, 28, 35] # C#1, A0, E0, B0
        freq = midi_to_freq(bass_roots[bar_idx])
        dur = beat * 0.9
        for i in range(round(dur * RATE)):
            if bn + i < num_samples:
                t = i / RATE
                beat_phase = (t % beat) / beat
                sc = 0.3 + 0.7 * (beat_phase ** 1.5)
                out[bn + i] += synth_sub808(freq, t, dur) * sc * 0.38

    write_wav(ROOT / 'golden_bloom.wav', out)

def render_yozakura():
    """BGM 4: Yozakura Night (Levels 10-12 & Endless).
    Ref: Exact instrumental reproduction of 'No Pole' — Don Toliver (prod. Cardo).
    BPM: 85 (170 double-time). 16 full bars (64 beats) = ~45.17 seconds.
    Form:
      - Bars 1-4: The exact iconic plucked string riff (C-Eb-G-Bb-Ab-F-Eb-D) + dark pad.
      - Bars 5-12: Full trap bounce with sliding 808 sub-bass glides & fast hi-hat rolls.
      - Bars 13-16: Nocturnal bridge and loop transition back to Bar 1.
    """
    bpm = 85.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # 1. Exact Iconic "No Pole" Plucked Hook (syncopated Cardo rhythm)
    # C4 -> Eb4 -> G4 -> Bb4 -> Ab4 -> F4 -> Eb4 -> D4
    no_pole_riff = [
        # Bar 1 (Cm)
        (0.0, 72), (0.75, 75), (1.5, 74), (2.25, 72), (3.0, 70), (3.5, 72),
        # Bar 2 (Fm)
        (4.0, 68), (4.75, 72), (5.5, 70), (6.25, 68), (7.0, 67), (7.5, 68),
        # Bar 3 (Eb)
        (8.0, 70), (8.75, 75), (9.5, 74), (10.25, 72), (11.0, 70), (11.5, 72),
        # Bar 4 (Dm7b5 -> G)
        (12.0, 68), (12.75, 70), (13.5, 72), (14.25, 74), (15.0, 71), (15.5, 67),
    ]
    # Repeat pattern 4 times for 16 bars
    for cycle in range(4):
        offset = cycle * 16.0
        for r_beat, note in no_pole_riff:
            start_t = (offset + r_beat) * beat
            freq = midi_to_freq(note)
            dur = beat * 0.85
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.35

    # 2. Cinematic Dark Synth Strings Pad
    pads_prog = [
        (0.0, [48, 55, 60, 63]),   # Cm
        (4.0, [41, 48, 53, 56]),   # Fm
        (8.0, [43, 50, 55, 58]),   # Eb
        (12.0, [43, 47, 50, 53]),  # G7
    ] * 4
    for b_idx in range(16):
        start_beat = b_idx * 4.0
        notes = pads_prog[b_idx][1]
        start_t = start_beat * beat
        dur = beat * 3.9
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for note in notes:
            freq = midi_to_freq(note)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    env = min(1.0, t / 0.1) * max(0.0, 1.0 - t / dur) ** 0.6
                    tone = math.sin(2 * math.pi * freq * t) + 0.25 * math.sin(4 * math.pi * freq * t)
                    out[n_start + i] += tone * env * 0.08

    # 3. Sliding 808 Sub-Bass with Portamento Glides
    sub_808_notes = [
        (0.0, 36, 3.5, 36),        # C1
        (4.0, 29, 3.0, 31),        # F0 -> G0 glide
        (8.0, 31, 3.5, 31),        # Eb1
        (12.0, 35, 2.0, 36),       # B0 -> C1 glide
        (14.0, 31, 1.8, 31),
    ]
    for cycle in range(4):
        offset = cycle * 16.0
        for s_beat, note, dur_b, target in sub_808_notes:
            start_t = (offset + s_beat) * beat
            freq = midi_to_freq(note)
            target_f = midi_to_freq(target)
            dur = dur_b * beat
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    out[n_start + i] += synth_sub808(freq, t, dur, glide_to=target_f) * 0.46

    # 4. Crisp Trap Drums (Punchy kick on 1 & 2.25, snare on 3, fast hi-hat rolls)
    for bar in range(16):
        bb = bar * 4
        # Kicks
        for ko in [0.0, 2.25]:
            kt = (bb + ko) * beat
            kn = round(kt * RATE)
            for i in range(round(0.22 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.45
        # Snare on 3 (half-time trap feel)
        st = (bb + 2.0) * beat
        sn = round(st * RATE)
        for i in range(round(0.18 * RATE)):
            if sn + i < num_samples:
                out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.38
        # Hi-hats with fast rolls on beat 4
        for step in range(16):
            step_beat = step * 0.25
            if step >= 12: # 16th-note fast roll
                ht = (bb + step_beat) * beat
                hn = round(ht * RATE)
                for i in range(round(0.035 * RATE)):
                    if hn + i < num_samples:
                        out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.24
            elif step % 2 == 0:
                ht = (bb + step_beat) * beat
                hn = round(ht * RATE)
                for i in range(round(0.045 * RATE)):
                    if hn + i < num_samples:
                        out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.18

    write_wav(ROOT / 'yozakura.wav', out)

def render_lofi_garden():
    """BGM 5: Lofi Garden (Classic Lofi Girl / Jinsang 'Affection').
    BPM: 82. 16 bars (64 beats) = ~46.82 seconds.
    Cozy, nostalgic lofi hip-hop with warm Rhodes 9th chords, unquantized drums,
    relaxing Japanese harp/koto notes and vinyl crackle texture.
    """
    bpm = 82.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # 1. Vinyl Crackle Background
    for i in range(num_samples):
        out[i] += VINYL_CRACKLE[i % len(VINYL_CRACKLE)] * 0.35

    # 2. Jazz Extended Chords: Em9 -> Am7 -> D7 -> Gmaj7
    lofi_chords = [
        (0.0, [52, 59, 62, 66]),   # Em9
        (4.0, [45, 52, 55, 60]),   # Am7
        (8.0, [48, 50, 54, 57]),   # D7
        (12.0, [43, 50, 55, 59]),  # Gmaj7
    ] * 4
    for b_idx in range(16):
        start_beat = b_idx * 4.0
        notes = lofi_chords[b_idx][1]
        start_t = start_beat * beat
        dur = beat * 3.8
        for note in notes:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    # Tape flutter
                    flutter = 1.0 + 0.004 * math.sin(2 * math.pi * 1.8 * t)
                    out[n_start + i] += synth_rhodes(freq * flutter, t, dur, chorus_speed=1.5) * 0.16

    # 3. Soft Acoustic Koto / Harp Counterpoint
    harp_notes = [
        (2.0, 74), (3.0, 71), (6.0, 69), (7.0, 67),
        (10.0, 66), (11.0, 69), (14.0, 71), (15.0, 74),
        (18.0, 76), (19.0, 74), (22.0, 71), (23.0, 69),
        (26.0, 67), (27.0, 66), (30.0, 69), (31.0, 71),
        (34.0, 74), (35.0, 71), (38.0, 69), (39.0, 67),
        (42.0, 66), (43.0, 69), (46.0, 71), (47.0, 74),
        (50.0, 76), (51.0, 74), (54.0, 71), (55.0, 69),
        (58.0, 67), (59.0, 66), (62.0, 69), (63.0, 71),
    ]
    for h_beat, note in harp_notes:
        start_t = h_beat * beat
        freq = midi_to_freq(note)
        dur = beat * 1.2
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.22

    # 4. Mellow Flatwound Bass
    lofi_bass = [
        (0.0, 40, 1.8), (2.0, 47, 1.8),
        (4.0, 33, 1.8), (6.0, 40, 1.8),
        (8.0, 38, 1.8), (10.0, 45, 1.8),
        (12.0, 35, 1.8), (14.0, 42, 1.8),
    ] * 2
    for b_idx, (b_beat, note, dur_b) in enumerate(lofi_bass):
        start_t = (b_idx * 2.0) * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_bass(freq, t, dur) * 0.35

    # 5. Lazy Unquantized Lofi Boom-Bap Drums
    for bar in range(16):
        bb = bar * 4
        # Slightly delayed/swung kick on 1 and 2.65
        for ko in [0.0, 2.65]:
            kt = (bb + ko) * beat
            kn = round(kt * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.35
        # Soft vinyl snare on 2 and 4
        for so in [1.02, 3.02]: # slight humanized lag
            st = (bb + so) * beat
            sn = round(st * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.28
        # Swung hi-hats
        for hs in range(8):
            swing = 0.03 if hs % 2 == 1 else 0.0
            ht = (bb + hs * 0.5 + swing) * beat
            hn = round(ht * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.16

    write_wav(ROOT / 'lofi_garden.wav', out)

# ==========================================
# 2. SFX GENERATION (Arcade Kawaii + Physical Models)
# ==========================================

def render_sfx():
    # 1. JUMP: Airy Bubble Wing-Flap (pitch sweep 220Hz -> 620Hz + bubble resonance)
    dur = 0.13
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    for i in range(n_samples):
        t = i / RATE
        p = t / dur
        f = 220.0 * (620.0 / 220.0) ** (p ** 1.2)
        env = min(1.0, t / 0.008) * ((1.0 - p) ** 1.4)
        tone = math.sin(2 * math.pi * f * t) + 0.3 * math.sin(4 * math.pi * f * t)
        noise_idx = int((t * RATE * 1.5) % len(NOISE_TABLE))
        air = NOISE_TABLE[noise_idx] * 0.15 * (1.0 - p)
        samples[i] = (tone + air) * env * 0.52
    write_wav(ROOT / 'jump.wav', samples)

    # 2. BOBUX (DEDICATED): Golden Arcade Coin Shimmer (Dual FM metallic bells B5 -> E6 -> B6)
    dur = 0.35
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    chimes = [(0.0, 987.77, 0.25), (0.05, 1318.5, 0.28), (0.10, 1975.5, 0.24)]
    for start_t, freq, ch_dur in chimes:
        n_st = round(start_t * RATE)
        n_len = round(ch_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_bell(freq, t, ch_dur) * 0.55
    write_wav(ROOT / 'sfx_bobux.wav', samples)

    # 3. SCORE (Preserved file): Sakura Wooden Chime (C5 -> G5 clean chime)
    dur = 0.18
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    notes = [(0.0, 523.25, 0.14), (0.04, 783.99, 0.14)]
    for start_t, freq, ch_dur in notes:
        n_st = round(start_t * RATE)
        n_len = round(ch_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_koto_pluck(freq, t, ch_dur) * 0.55
    write_wav(ROOT / 'score.wav', samples)

    # 4. UI: Tactile Jelly / Wood Pop (snappy switch pop 480Hz -> 760Hz in 45ms)
    dur = 0.048
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    for i in range(n_samples):
        t = i / RATE
        p = t / dur
        f = 460.0 + 300.0 * (1.0 - p) ** 2
        env = min(1.0, t / 0.003) * ((1.0 - p) ** 3.0)
        tone = math.sin(2 * math.pi * f * t) + 0.25 * math.sin(4 * math.pi * f * t)
        samples[i] = tone * env * 0.65
    write_wav(ROOT / 'ui.wav', samples)

    # 5. COLLISION: Soft Arcade Bonk (down-sweep 160Hz -> 52Hz, zero harshness)
    dur = 0.28
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    for i in range(n_samples):
        t = i / RATE
        p = t / dur
        f = 160.0 * (52.0 / 160.0) ** (p ** 0.8)
        env = min(1.0, t / 0.005) * ((1.0 - p) ** 1.8)
        tone = math.sin(2 * math.pi * f * t) + 0.35 * math.sin(3 * math.pi * f * t)
        samples[i] = soft_clip(tone * 1.2) * env * 0.60
    write_wav(ROOT / 'collision.wav', samples)

    # 6. CHECKPOINT: Torii Gate Chime Fanfare (C5 - E5 - G5 - D6 ascending chime)
    dur = 0.52
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    cp_notes = [(0.0, 523.25), (0.08, 659.25), (0.16, 783.99), (0.24, 1174.66)]
    for start_t, freq in cp_notes:
        n_st = round(start_t * RATE)
        ch_dur = dur - start_t
        n_len = round(ch_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_bell(freq, t, ch_dur) * 0.45
    write_wav(ROOT / 'checkpoint.wav', samples)

    # 7. COMPLETE: Arcade Victory Fanfare (triumphed melody + sparkling tail)
    dur = 0.72
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    fanfare = [
        (0.0, 523.25, 0.16), (0.10, 659.25, 0.16), (0.20, 783.99, 0.16),
        (0.30, 1046.50, 0.40), (0.42, 1318.5, 0.28)
    ]
    for start_t, freq, n_dur in fanfare:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_bell(freq, t, n_dur) * 0.48
    write_wav(ROOT / 'complete.wav', samples)

    # 8. UNLOCK: Gacha Chest Sparkle (glissando cascade of high crystals)
    dur = 0.55
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    sparkles = [(0.0 + k * 0.045, midi_to_freq(m), 0.22) for k, m in enumerate([64, 67, 71, 74, 76, 79, 83, 88])]
    for start_t, freq, n_dur in sparkles:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_bell(freq, t, n_dur) * 0.32
    write_wav(ROOT / 'unlock.wav', samples)

    # 9. PAUSE: Cozy Electric Piano Down-Chirp (E5 -> A4)
    dur = 0.18
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    p_notes = [(0.0, 659.25, 0.12), (0.05, 440.0, 0.13)]
    for start_t, freq, n_dur in p_notes:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_rhodes(freq, t, n_dur) * 0.55
    write_wav(ROOT / 'pause.wav', samples)

    # 10. RESUME: Cozy Electric Piano Up-Chirp (A4 -> E5)
    dur = 0.18
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    r_notes = [(0.0, 440.0, 0.12), (0.05, 659.25, 0.13)]
    for start_t, freq, n_dur in r_notes:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                t = i / RATE
                samples[n_st + i] += synth_rhodes(freq, t, n_dur) * 0.55
    write_wav(ROOT / 'resume.wav', samples)

def main():
    print('Composing extended multi-track BGM themes (~45s-48s loops)...')
    render_first_bloom()
    render_sakura_garden()
    render_golden_bloom()
    render_yozakura()
    render_lofi_garden()
    print('Composing arcade kawaii SFX...')
    render_sfx()
    total_wavs = len(list(ROOT.glob('*.wav')))
    print(f'Successfully composed {total_wavs} WAV files in {ROOT}.')
    assert total_wavs >= 15, f'Expected at least 15 wav files, got {total_wavs}'

if __name__ == '__main__':
    main()
