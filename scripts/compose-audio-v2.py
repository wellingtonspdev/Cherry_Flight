"""Compose extended multi-track BGM themes and tactile arcade kawaii SFX for Cherry Bloom.

12 Unique Non-Repeated Level Soundtracks (Extended 42s-48s loops):
  - Level 1: first_bloom - "Show Me How" (Men I Trust) [83.5 BPM]
  - Level 2: ye_flashing_lights - "Flashing Lights" (Kanye West) [90 BPM]
  - Level 3: ye_ghost_town - "Ghost Town" (Kanye West) [83 BPM]
  - Level 4: sakura_garden - "Walking On A Dream" (Empire of the Sun) [125 BPM]
  - Level 5: ye_stronger - "Stronger" (Kanye West) [104 BPM]
  - Level 6: eots_we_are_the_people - "We Are The People" (Empire of the Sun) [123 BPM]
  - Level 7: golden_bloom - "Inner Light" (Elderbrook & Bob Moses) [122 BPM]
  - Level 8: ye_father_stretch - "Father Stretch My Hands Pt. 1" (Kanye West) [113 BPM]
  - Level 9: ye_heartless - "Heartless" (Kanye West) [88 BPM]
  - Level 10: yozakura - "No Pole" (Don Toliver prod. Cardo) [85 BPM]
  - Level 11: lofi_garden - "Affection" (Jinsang / Classic Lofi Girl) [82 BPM]
  - Level 12: ye_runaway - "Runaway" (Kanye West) [85 BPM]

10 SFX (Arcade Kawaii + Physical Models):
  - jump, bobux, score, ui, collision, checkpoint, complete, unlock, pause, resume.
"""
import math
import random
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'assets/v2/audio'
RATE = 22050

PRNG = random.Random(42)

def midi_to_freq(m):
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))

def soft_clip(x):
    if x > 1.4:
        return 0.95
    if x < -1.4:
        return -0.95
    return x - (x ** 3) / 6.0

def write_wav(path, samples):
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
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.008) * math.exp(-2.2 * t / dur)
    vibrato = 1.0 + 0.0035 * math.sin(2 * math.pi * chorus_speed * t)
    f = freq * vibrato
    h1 = math.sin(2 * math.pi * f * t)
    h2 = 0.38 * math.sin(4 * math.pi * f * t + 0.5)
    h3 = 0.14 * math.sin(6 * math.pi * f * t + 1.2)
    return env * (h1 + h2 + h3) * 0.7

def synth_organ(freq, t, dur):
    """Warm vintage Hammond / Gospel organ (Father Stretch & Ghost Town)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.015) * max(0.0, 1.0 - t / dur) ** 0.5
    vib = 1.0 + 0.005 * math.sin(2 * math.pi * 5.8 * t)
    f = freq * vib
    h1 = math.sin(2 * math.pi * f * t)
    h2 = 0.6 * math.sin(4 * math.pi * f * t)
    h3 = 0.45 * math.sin(6 * math.pi * f * t)
    h4 = 0.25 * math.sin(8 * math.pi * f * t)
    return env * (h1 + h2 + h3 + h4) * 0.45

def synth_strings(freq, t, dur):
    """Lush synthetic orchestra strings (Flashing Lights & Runaway)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.04) * max(0.0, 1.0 - t / dur) ** 0.4
    detune1 = freq * 1.003
    detune2 = freq * 0.997
    s1 = math.sin(2 * math.pi * freq * t)
    s2 = 0.6 * math.sin(2 * math.pi * detune1 * t)
    s3 = 0.6 * math.sin(2 * math.pi * detune2 * t)
    s4 = 0.3 * math.sin(4 * math.pi * freq * t)
    return env * (s1 + s2 + s3 + s4) * 0.38

def synth_piano(freq, t, dur):
    """Sharp dynamic grand piano (Runaway E6 intro & Heartless stabs)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.003) * math.exp(-3.2 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.5 * math.sin(4 * math.pi * freq * t + 0.2)
    h3 = 0.25 * math.sin(6 * math.pi * freq * t + 0.8)
    h4 = 0.12 * math.sin(8 * math.pi * freq * t + 1.2)
    return env * (h1 + h2 + h3 + h4) * 0.75

def synth_bass(freq, t, dur):
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.012) * math.exp(-1.9 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.45 * math.sin(4 * math.pi * freq * t)
    h3 = 0.18 * math.sin(6 * math.pi * freq * t)
    return env * (h1 + h2 + h3) * 0.85

def synth_fuzz_bass(freq, t, dur):
    """Saturated fuzz electric bass (Ghost Town & Stronger)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.01) * math.exp(-1.6 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.7 * math.sin(4 * math.pi * freq * t)
    h3 = 0.4 * math.sin(6 * math.pi * freq * t)
    raw = (h1 + h2 + h3) * 1.8
    return env * soft_clip(raw) * 0.65

def synth_koto_pluck(freq, t, dur):
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.003) * math.exp(-4.2 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.52 * math.sin(4 * math.pi * freq * t + 0.3)
    h3 = 0.32 * math.sin(2 * math.pi * freq * 3.01 * t)
    h4 = 0.16 * math.sin(2 * math.pi * freq * 4.2 * t)
    return env * (h1 + h2 + h3 + h4) * 0.65

def synth_synth_lead(freq, t, dur, glide_f=None):
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
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.005) * math.exp(-3.5 * t / dur)
    mod = 2.4 * math.exp(-5.0 * t / dur) * math.sin(2 * math.pi * freq * 2.76 * t)
    carrier = math.sin(2 * math.pi * freq * t + mod)
    shimmer = 0.25 * math.sin(2 * math.pi * freq * 4.0 * t) * math.exp(-2.5 * t / dur)
    return env * (carrier + shimmer) * 0.6

def synth_sub808(freq, t, dur, glide_to=None):
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

# --- Drums ---

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

def sample_clap(t, noise_table):
    dur = 0.22
    if t < 0 or t >= dur:
        return 0.0
    # Multi-burst clap
    env = 0.0
    for burst_t in [0.0, 0.012, 0.024]:
        if t >= burst_t:
            dt = t - burst_t
            env += min(1.0, dt / 0.002) * math.exp(-28.0 * dt)
    idx = int((t * RATE * 1.8) % len(noise_table))
    return noise_table[idx] * min(1.0, env) * 0.75

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
# 12 LEVEL COMPOSITIONS
# ==========================================

# Level 1: "Show Me How" (Men I Trust) - 83.5 BPM (~46s)
def render_first_bloom():
    bpm = 83.5
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    chord_seq = [
        (0.0, [57, 60, 64, 67]), (4.0, [48, 55, 59, 64]), (8.0, [53, 57, 60, 64]), (12.0, [50, 53, 57, 60]),
        (16.0, [57, 61, 64, 68]), (20.0, [53, 57, 60, 64]), (24.0, [50, 53, 57, 60]), (28.0, [52, 56, 59, 62]),
        (32.0, [57, 60, 64, 67]), (36.0, [48, 55, 59, 64]), (40.0, [53, 57, 60, 64]), (44.0, [50, 53, 57, 60]),
        (48.0, [57, 61, 64, 68]), (52.0, [53, 57, 60, 64]), (56.0, [50, 53, 57, 60]), (60.0, [52, 56, 59, 62]),
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
                    out[n_start + i] += synth_rhodes(freq, i / RATE, dur) * 0.15

    bass_riff = [
        (0.0, 45, 1.4), (1.5, 48, 0.8), (2.5, 52, 1.3),
        (4.0, 48, 1.4), (5.5, 55, 0.8), (6.5, 52, 1.3),
        (8.0, 41, 1.4), (9.5, 45, 0.8), (10.5, 48, 1.3),
        (12.0, 43, 1.4), (13.5, 45, 0.8), (14.5, 47, 1.3),
        (16.0, 45, 1.4), (17.5, 49, 0.8), (18.5, 52, 1.3),
        (20.0, 41, 1.4), (21.5, 45, 0.8), (22.5, 48, 1.3),
        (24.0, 43, 1.4), (25.5, 45, 0.8), (26.5, 47, 1.3),
        (28.0, 40, 1.4), (29.5, 44, 0.8), (30.5, 47, 1.3),
    ] * 2
    for b_idx, (b_beat, note, dur_b) in enumerate(bass_riff):
        start_t = ((b_idx // len(bass_riff[:8])) * 32.0 + b_beat) * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_bass(freq, i / RATE, dur) * 0.38

    lead_melody = [
        (0.0, 76, 1.2), (1.5, 79, 1.2), (3.0, 76, 0.8), (4.0, 74, 1.0),
        (5.5, 72, 1.2), (7.0, 69, 0.8), (8.0, 72, 1.2), (9.5, 74, 1.8),
        (12.0, 76, 1.0), (13.5, 72, 1.0), (14.5, 71, 1.8),
        (16.0, 76, 1.8), (18.0, 80, 1.4), (20.0, 77, 1.8), (22.0, 74, 1.4),
        (24.0, 72, 1.8), (26.0, 74, 1.4), (28.0, 76, 1.4), (30.0, 71, 2.2),
        (32.0, 76, 1.2), (33.5, 79, 1.2), (35.0, 81, 0.8), (36.0, 79, 1.2),
        (37.5, 76, 1.0), (39.0, 74, 1.0), (40.0, 72, 1.2), (41.5, 74, 1.8),
        (44.0, 72, 1.0), (45.5, 69, 1.0), (46.5, 71, 1.8),
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
                out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.22

    for bar in range(16):
        bb = bar * 4
        for ko in [0.0, 2.5]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.38
        for so in [1.0, 3.0]:
            sn = round((bb + so) * beat * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        for hs in range(8):
            hn = round((bb + hs * 0.5) * beat * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.20
    write_wav(ROOT / 'first_bloom.wav', out)

# Level 2: "Flashing Lights" (Kanye West feat. Dwele) - 90 BPM (~42.7s)
def render_ye_flashing_lights():
    bpm = 90.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Iconic Flashing Lights Synth Strings Hook (C#5 -> F#5 -> G#5 -> A5 -> G#5 -> F#5 -> C#5)
    strings_riff = [
        # Bar 1 (Dmaj7)
        (0.0, 73, 0.4), (0.5, 78, 0.4), (1.0, 80, 0.4), (1.5, 81, 0.8), (2.5, 80, 0.4), (3.0, 78, 0.4), (3.5, 73, 0.4),
        # Bar 2 (F#m7)
        (4.0, 73, 0.4), (4.5, 78, 0.4), (5.0, 80, 0.4), (5.5, 81, 0.8), (6.5, 80, 0.4), (7.0, 78, 0.4), (7.5, 73, 0.4),
        # Bar 3 (Dmaj7)
        (8.0, 74, 0.4), (8.5, 78, 0.4), (9.0, 80, 0.4), (9.5, 81, 0.8), (10.5, 80, 0.4), (11.0, 78, 0.4), (11.5, 74, 0.4),
        # Bar 4 (Bm7)
        (12.0, 71, 0.4), (12.5, 74, 0.4), (13.0, 76, 0.4), (13.5, 78, 0.8), (14.5, 76, 0.4), (15.0, 74, 0.4), (15.5, 71, 0.4),
    ]
    for cycle in range(4):
        offset = cycle * 16.0
        for r_beat, note, dur_b in strings_riff:
            start_t = (offset + r_beat) * beat
            freq = midi_to_freq(note)
            dur = dur_b * beat
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_strings(freq, i / RATE, dur) * 0.38

    # Chords Pad (Dmaj7, F#m7, Dmaj7, Bm7)
    chords = [
        (0.0, [50, 57, 61, 66]), (4.0, [54, 57, 61, 64]),
        (8.0, [50, 57, 61, 66]), (12.0, [47, 54, 57, 62]),
    ] * 4
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.9
        for note in chords[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_rhodes(freq, i / RATE, dur) * 0.12

    # Bassline
    bass_notes = [(0.0, 38, 3.8), (4.0, 42, 3.8), (8.0, 38, 3.8), (12.0, 35, 3.8)] * 4
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        freq = midi_to_freq(bass_notes[b_idx][1])
        dur = beat * 3.8
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_bass(freq, i / RATE, dur) * 0.36

    # Hip-hop drums (Electronic kick, crisp snare with double hit, 16th rolling hats)
    for bar in range(16):
        bb = bar * 4
        # Kicks
        for ko in [0.0, 1.5, 2.5]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.42
        # Snares on 2 and 4
        for so in [1.0, 3.0]:
            sn = round((bb + so) * beat * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.36
        # 16th hats
        for hs in range(16):
            hn = round((bb + hs * 0.25) * beat * RATE)
            for i in range(round(0.04 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.18
    write_wav(ROOT / 'ye_flashing_lights.wav', out)

# Level 3: "Ghost Town" (Kanye West feat. 070 Shake) - 83 BPM (~46.3s)
def render_ye_ghost_town():
    bpm = 83.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Soul organ chords: F -> Am -> Eb -> D7 | Gm -> Am -> Bb -> C
    organ_prog = [
        (0.0, [53, 57, 60, 65]), (4.0, [57, 60, 64, 69]),
        (8.0, [51, 55, 58, 63]), (12.0, [50, 54, 57, 62]),
        (16.0, [55, 58, 62, 67]), (20.0, [57, 60, 64, 69]),
        (24.0, [58, 62, 65, 70]), (28.0, [60, 64, 67, 72]),
    ] * 2
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.8
        for note in organ_prog[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_organ(freq, i / RATE, dur) * 0.16

    # Fuzz bass
    fuzz_roots = [41, 45, 39, 38, 43, 45, 46, 48] * 2
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        freq = midi_to_freq(fuzz_roots[b_idx])
        dur = beat * 3.8
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_fuzz_bass(freq, i / RATE, dur) * 0.42

    # 070 Shake Soaring Hook ("I feel kinda freeeeee...")
    shake_hook = [
        (0.0, 69, 1.8), (2.0, 72, 1.8), (4.0, 74, 1.8), (6.0, 72, 1.8),
        (8.0, 70, 1.8), (10.0, 69, 1.8), (12.0, 67, 3.5),
        (16.0, 67, 1.8), (18.0, 69, 1.8), (20.0, 70, 1.8), (22.0, 72, 1.8),
        (24.0, 74, 2.5), (28.0, 72, 3.5),
    ] * 2
    for c_idx in range(2):
        offset = c_idx * 32.0
        for h_beat, note, dur_b in shake_hook[:7]:
            start_t = (offset + h_beat) * beat
            freq = midi_to_freq(note + 12)
            dur = dur_b * beat
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.28

    # Live-feel acoustic drums
    for bar in range(16):
        bb = bar * 4
        for ko in [0.0, 2.5]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.40
        for so in [1.0, 3.0]:
            sn = round((bb + so) * beat * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.35
        for hs in range(8):
            hn = round((bb + hs * 0.5) * beat * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.18
    write_wav(ROOT / 'ye_ghost_town.wav', out)

# Level 4: "Walking On A Dream" (Empire of the Sun) - 125 BPM (~46.1s)
def render_sakura_garden():
    bpm = 125.0
    beat = 60.0 / bpm
    total_beats = 96
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    chords_seq = [
        (0.0, [53, 60, 65, 68]), (4.0, [49, 56, 61, 65]),
        (8.0, [44, 51, 56, 60]), (12.0, [51, 55, 58, 63]),
    ] * 6
    for b_idx in range(24):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.9
        for note in chords_seq[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_rhodes(freq, i / RATE, dur) * 0.14

    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        roots = [41, 37, 32, 39]
        root = roots[(b // 4) % 4]
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

    leads = [
        (0.0, 72, 1.5), (2.0, 75, 1.5), (4.0, 77, 1.8), (6.0, 80, 1.5),
        (8.0, 79, 1.5), (10.0, 75, 1.5), (12.0, 72, 2.5),
    ] * 6
    for l_idx, (l_beat, note, dur_b) in enumerate(leads):
        start_t = ((l_idx // 7) * 16.0 + l_beat) * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.24

    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.44
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.24
    write_wav(ROOT / 'sakura_garden.wav', out)

# Level 5: "Stronger" (Kanye West) - 104 BPM (~46.2s)
def render_ye_stronger():
    bpm = 104.0
    beat = 60.0 / bpm
    total_beats = 80
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Daft Punk Electro Vocoder Synth Hook (Eb4 -> Gb4 -> Bb4 -> Ab4 -> Gb4 -> Eb4)
    stronger_lead = [
        (0.0, 63, 0.5), (0.5, 66, 0.5), (1.0, 70, 0.8), (2.0, 68, 0.8), (3.0, 66, 0.5), (3.5, 63, 0.5),
        (4.0, 63, 0.5), (4.5, 66, 0.5), (5.0, 70, 0.8), (6.0, 68, 0.8), (7.0, 73, 0.8),
        (8.0, 70, 0.5), (8.5, 68, 0.5), (9.0, 66, 0.8), (10.0, 63, 0.8), (11.0, 61, 0.8),
        (12.0, 63, 1.8), (14.0, 66, 1.8),
    ]
    for cycle in range(5):
        offset = cycle * 16.0
        for l_beat, note, dur_b in stronger_lead:
            start_t = (offset + l_beat) * beat
            freq = midi_to_freq(note)
            dur = dur_b * beat
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.32

    # Pumping French-touch synth bass (Ebm -> Db -> Ab/C -> B)
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        roots = [39, 37, 36, 35]
        root = roots[(b // 4) % 4]
        freq = midi_to_freq(root)
        dur = beat * 0.45
        for i in range(round(dur * RATE)):
            if bn + i < num_samples:
                out[bn + i] += synth_fuzz_bass(freq, i / RATE, dur) * 0.42
        # Offbeat 16th octave bounce
        bn_up = round((bt + beat * 0.5) * RATE)
        for i in range(round(dur * RATE)):
            if bn_up + i < num_samples:
                out[bn_up + i] += synth_fuzz_bass(freq * 2, i / RATE, dur) * 0.35

    # Heavy electro 4-on-the-floor beat
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.48
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_clap(i / RATE, NOISE_TABLE) * 0.38
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.25
    write_wav(ROOT / 'ye_stronger.wav', out)

# Level 6: "We Are The People" (Empire of the Sun) - 123 BPM (~46.8s)
def render_eots_we_are_the_people():
    bpm = 123.0
    beat = 60.0 / bpm
    total_beats = 96
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Progression: Em -> Bm -> Cmaj7 -> D
    chords = [
        (0.0, [52, 59, 64, 67]), (4.0, [47, 54, 59, 62]),
        (8.0, [48, 55, 60, 64]), (12.0, [50, 54, 57, 62]),
    ] * 6
    for b_idx in range(24):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.9
        for note in chords[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_rhodes(freq, i / RATE, dur) * 0.14

    # Anthemic Hook (B4 -> D5 -> E5 -> G5 -> F#5 -> D5)
    hook = [
        (0.0, 71, 1.5), (2.0, 74, 1.5), (4.0, 76, 1.8), (6.0, 79, 1.5),
        (8.0, 78, 1.5), (10.0, 74, 1.5), (12.0, 71, 2.5),
    ] * 6
    for l_idx, (l_beat, note, dur_b) in enumerate(hook):
        start_t = ((l_idx // 7) * 16.0 + l_beat) * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.26

    # Driving Bass & Drums
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        roots = [40, 35, 36, 38]
        root = roots[(b // 4) % 4]
        freq = midi_to_freq(root)
        for i in range(round(beat * 0.45 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += synth_bass(freq, i / RATE, beat * 0.45) * 0.38

        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.44
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.22
    write_wav(ROOT / 'eots_we_are_the_people.wav', out)

# Level 7: "Inner Light" (Elderbrook & Bob Moses) - 122 BPM (~47.2s)
def render_golden_bloom():
    bpm = 122.0
    beat = 60.0 / bpm
    total_beats = 96
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    prog = [(0.0, [49, 56, 60, 64]), (4.0, [45, 52, 57, 61]), (8.0, [40, 47, 52, 56]), (12.0, [47, 51, 54, 59])] * 6
    for b_idx in range(24):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.9
        for note in prog[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    beat_phase = (t % beat) / beat
                    sidechain = 0.22 + 0.78 * math.sin(math.pi * beat_phase)
                    env = min(1.0, t / 0.05) * max(0.0, 1.0 - t / dur) ** 0.5
                    pad = math.sin(2 * math.pi * freq * t) + 0.35 * math.sin(4 * math.pi * freq * t + 0.2)
                    out[n_start + i] += pad * env * sidechain * 0.12

    hook = [
        (0.0, 68, 1.2), (1.5, 71, 1.2), (3.0, 73, 1.8), (5.0, 71, 1.2),
        (6.5, 68, 1.2), (8.0, 66, 1.2), (9.5, 64, 2.0),
    ] * 6
    for h_idx, (h_beat, note, dur_b) in enumerate(hook):
        start_t = ((h_idx // 7) * 16.0 + h_beat) * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_bell(freq, i / RATE, dur) * 0.28

    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.45
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.30
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.25

        roots = [37, 33, 28, 35]
        root = roots[(b // 4) % 4]
        freq = midi_to_freq(root)
        dur = beat * 0.9
        for i in range(round(dur * RATE)):
            if bn + i < num_samples:
                t = i / RATE
                beat_phase = (t % beat) / beat
                sc = 0.3 + 0.7 * (beat_phase ** 1.5)
                out[bn + i] += synth_sub808(freq, t, dur) * sc * 0.38
    write_wav(ROOT / 'golden_bloom.wav', out)

# Level 8: "Father Stretch My Hands Pt. 1" (Kanye West) - 113 BPM (~42.5s)
def render_ye_father_stretch():
    bpm = 113.0
    beat = 60.0 / bpm
    total_beats = 80
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Gospel Synth Organ: Am7 -> C -> Em7 -> G
    gospel_prog = [
        (0.0, [57, 60, 64, 67]), (4.0, [48, 55, 60, 64]),
        (8.0, [52, 55, 59, 64]), (12.0, [55, 59, 62, 67]),
    ] * 5
    for b_idx in range(20):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.8
        for note in gospel_prog[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_organ(freq, i / RATE, dur) * 0.18

    # Kid Cudi "Beautiful Morning" Vocal Synth Hook (B4 -> G4 -> E4 -> G4 -> A4 -> B4)
    cudi_hook = [
        (0.0, 71, 1.8), (2.0, 67, 1.2), (3.5, 64, 1.2), (5.0, 67, 1.2),
        (6.5, 69, 1.2), (8.0, 71, 2.5),
        (11.0, 69, 1.2), (12.5, 67, 1.2), (14.0, 64, 2.2),
    ] * 5
    for c_idx in range(5):
        offset = c_idx * 16.0
        for h_beat, note, dur_b in cudi_hook[:9]:
            start_t = (offset + h_beat) * beat
            freq = midi_to_freq(note)
            dur = dur_b * beat
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.30

    # Metro Boomin Trap 808 Drop
    for bar in range(20):
        bb = bar * 4
        # Giant 808 kick drop
        for ko in [0.0, 2.25]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.28 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.48
            # Sub bass tone
            roots = [33, 36, 40, 43]
            root = roots[bar % 4]
            freq = midi_to_freq(root)
            for i in range(round(beat * 1.5 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += synth_sub808(freq, i / RATE, beat * 1.5) * 0.42
        # Metro clap on 2 and 4
        for co in [1.0, 3.0]:
            cn = round((bb + co) * beat * RATE)
            for i in range(round(0.18 * RATE)):
                if cn + i < num_samples:
                    out[cn + i] += sample_clap(i / RATE, NOISE_TABLE) * 0.35
        # Hi-hats
        for hs in range(8):
            hn = round((bb + hs * 0.5) * beat * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.20
    write_wav(ROOT / 'ye_father_stretch.wav', out)

# Level 9: "Heartless" (Kanye West) - 88 BPM (~43.6s)
def render_ye_heartless():
    bpm = 88.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Iconic 808s Melancholic Piano Stabs (Bbm -> Db -> Ab -> Ebm)
    stabs = [
        (0.0, [58, 61, 65]), (4.0, [49, 56, 61]),
        (8.0, [56, 60, 63]), (12.0, [51, 54, 58]),
    ] * 4
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        dur = beat * 1.5
        for note in stabs[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_piano(freq, i / RATE, dur) * 0.32

    # Melancholic Vocoder Lead Theme ("In the night I hear 'em talk...")
    heartless_lead = [
        (0.0, 70, 1.0), (1.0, 73, 1.0), (2.0, 72, 1.2), (3.5, 70, 0.8),
        (4.0, 68, 1.0), (5.0, 70, 1.0), (6.0, 66, 1.8),
        (8.0, 68, 1.0), (9.0, 70, 1.0), (10.0, 68, 1.2), (11.5, 66, 0.8),
        (12.0, 65, 1.5), (14.0, 63, 2.0),
    ] * 4
    for c_idx in range(4):
        offset = c_idx * 16.0
        for l_beat, note, dur_b in heartless_lead[:13]:
            start_t = (offset + l_beat) * beat
            freq = midi_to_freq(note)
            dur = dur_b * beat
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_synth_lead(freq, i / RATE, dur) * 0.28

    # Roland TR-808 drums (heavy sub kick, classic snare, 808 toms)
    for bar in range(16):
        bb = bar * 4
        # 808 Kicks
        for ko in [0.0, 1.5, 2.5]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.45
            roots = [34, 37, 32, 39]
            freq = midi_to_freq(roots[bar % 4])
            for i in range(round(beat * 1.2 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += synth_sub808(freq, i / RATE, beat * 1.2) * 0.38
        # Snare on 2 and 4
        for so in [1.0, 3.0]:
            sn = round((bb + so) * beat * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.35
        # 8th-note hats
        for hs in range(8):
            hn = round((bb + hs * 0.5) * beat * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.18
    write_wav(ROOT / 'ye_heartless.wav', out)

# Level 10: "No Pole" (Don Toliver prod. Cardo) - 85 BPM (~45.2s)
def render_yozakura():
    bpm = 85.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    no_pole_riff = [
        (0.0, 72), (0.75, 75), (1.5, 74), (2.25, 72), (3.0, 70), (3.5, 72),
        (4.0, 68), (4.75, 72), (5.5, 70), (6.25, 68), (7.0, 67), (7.5, 68),
        (8.0, 70), (8.75, 75), (9.5, 74), (10.25, 72), (11.0, 70), (11.5, 72),
        (12.0, 68), (12.75, 70), (13.5, 72), (14.25, 74), (15.0, 71), (15.5, 67),
    ]
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
                    out[n_start + i] += synth_koto_pluck(freq, i / RATE, dur) * 0.35

    pads_prog = [(0.0, [48, 55, 60, 63]), (4.0, [41, 48, 53, 56]), (8.0, [43, 50, 55, 58]), (12.0, [43, 47, 50, 53])] * 4
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.9
        for note in pads_prog[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    env = min(1.0, t / 0.1) * max(0.0, 1.0 - t / dur) ** 0.6
                    out[n_start + i] += (math.sin(2 * math.pi * freq * t) + 0.25 * math.sin(4 * math.pi * freq * t)) * env * 0.08

    sub_808_notes = [(0.0, 36, 3.5, 36), (4.0, 29, 3.0, 31), (8.0, 31, 3.5, 31), (12.0, 35, 2.0, 36), (14.0, 31, 1.8, 31)]
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
                    out[n_start + i] += synth_sub808(freq, i / RATE, dur, glide_to=target_f) * 0.46

    for bar in range(16):
        bb = bar * 4
        for ko in [0.0, 2.25]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.22 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.45
        st = (bb + 2.0) * beat
        sn = round(st * RATE)
        for i in range(round(0.18 * RATE)):
            if sn + i < num_samples:
                out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.38
        for step in range(16):
            if step >= 12:
                ht = (bb + step * 0.25) * beat
                hn = round(ht * RATE)
                for i in range(round(0.035 * RATE)):
                    if hn + i < num_samples:
                        out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.24
            elif step % 2 == 0:
                ht = (bb + step * 0.25) * beat
                hn = round(ht * RATE)
                for i in range(round(0.045 * RATE)):
                    if hn + i < num_samples:
                        out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.18
    write_wav(ROOT / 'yozakura.wav', out)

# Level 11: "Affection" (Jinsang / Classic Lofi Girl) - 82 BPM (~46.8s)
def render_lofi_garden():
    bpm = 82.0
    beat = 60.0 / bpm
    total_beats = 64
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    for i in range(num_samples):
        out[i] += VINYL_CRACKLE[i % len(VINYL_CRACKLE)] * 0.35

    lofi_chords = [(0.0, [52, 59, 62, 66]), (4.0, [45, 52, 55, 60]), (8.0, [48, 50, 54, 57]), (12.0, [43, 50, 55, 59])] * 4
    for b_idx in range(16):
        start_t = b_idx * 4.0 * beat
        dur = beat * 3.8
        for note in lofi_chords[b_idx][1]:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    flutter = 1.0 + 0.004 * math.sin(2 * math.pi * 1.8 * t)
                    out[n_start + i] += synth_rhodes(freq * flutter, t, dur, chorus_speed=1.5) * 0.16

    harp_notes = [
        (2.0, 74), (3.0, 71), (6.0, 69), (7.0, 67),
        (10.0, 66), (11.0, 69), (14.0, 71), (15.0, 74),
    ] * 4
    for h_idx, (h_beat, note) in enumerate(harp_notes):
        start_t = ((h_idx // 8) * 16.0 + h_beat) * beat
        freq = midi_to_freq(note)
        dur = beat * 1.2
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_koto_pluck(freq, i / RATE, dur) * 0.22

    lofi_bass = [(0.0, 40, 1.8), (2.0, 47, 1.8), (4.0, 33, 1.8), (6.0, 40, 1.8), (8.0, 38, 1.8), (10.0, 45, 1.8), (12.0, 35, 1.8), (14.0, 42, 1.8)] * 2
    for b_idx, (b_beat, note, dur_b) in enumerate(lofi_bass):
        start_t = (b_idx * 2.0) * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_bass(freq, i / RATE, dur) * 0.35

    for bar in range(16):
        bb = bar * 4
        for ko in [0.0, 2.65]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.35
        for so in [1.02, 3.02]:
            sn = round((bb + so) * beat * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.28
        for hs in range(8):
            swing = 0.03 if hs % 2 == 1 else 0.0
            hn = round((bb + hs * 0.5 + swing) * beat * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.16
    write_wav(ROOT / 'lofi_garden.wav', out)

def synth_vocoder_guitar(freq, t, dur, glide_f=None):
    """Distorted singing vocoder / electric guitar lead (Runaway Climax Solo)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.02) * max(0.0, 1.0 - t / dur) ** 0.55
    cur_f = freq
    if glide_f is not None:
        p = min(1.0, t / (dur * 0.35))
        cur_f = freq * (1.0 - p) + glide_f * p
    vib = 1.0 + 0.012 * math.sin(2 * math.pi * 5.2 * t) if t > 0.09 else 1.0
    f = cur_f * vib
    # Saturated vocal-synthesizer / tube guitar waveform
    tone = math.sin(2 * math.pi * f * t) + 0.62 * math.sin(4 * math.pi * f * t) + 0.42 * math.sin(6 * math.pi * f * t)
    fuzz = soft_clip(tone * 2.6)
    throat = 0.25 * math.sin(2 * math.pi * 1280.0 * t) * math.exp(-2.2 * t / dur)
    return env * (fuzz * 0.72 + throat) * 0.42

# Level 12 (Grand Finale): "Runaway" (Kanye West feat. Pusha T) - 85 BPM (~90.4s)
def render_ye_runaway():
    bpm = 85.0
    beat = 60.0 / bpm
    total_beats = 128  # 32 Full Bars - Complete Masterpiece Progression
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # 1. The Immortal High Piano Note (E6 = MIDI 88) & Melodic Motif
    # Bars 1-4 (Solo hammer), Bars 5-8 (Descent), Bars 9-16 (With Strings),
    # Bars 17-24 (With Drums/808), Bars 25-32 (With Vocoder Guitar Solo)
    piano_pattern = [
        # Bars 1-4: The iconic solitary single E6 note
        (0.0, 88, 0.8), (1.0, 88, 0.8), (2.0, 88, 0.8), (3.0, 88, 0.8),
        (4.0, 88, 0.8), (5.0, 88, 0.8), (6.0, 88, 0.8), (7.0, 88, 0.8),
        (8.0, 88, 0.8), (9.0, 88, 0.8), (10.0, 88, 0.8), (11.0, 88, 0.8),
        (12.0, 88, 0.8), (13.0, 88, 0.8), (14.0, 88, 0.8),
        # Bars 5-8: The stepping down phrase (E -> C#m -> A -> B)
        (16.0, 88, 0.8), (17.0, 88, 0.8), (18.0, 85, 0.8), (19.0, 83, 0.8),
        (20.0, 81, 0.8), (21.0, 80, 0.8), (22.0, 76, 0.8), (23.0, 73, 0.8),
        (24.0, 88, 0.8), (25.0, 88, 0.8), (26.0, 85, 0.8), (27.0, 83, 0.8),
        (28.0, 81, 0.8), (29.0, 80, 0.8), (30.0, 76, 0.8), (31.0, 75, 0.8),
    ]
    # Bars 9-16 & Bars 17-24 & Bars 25-32: Full descending motif with octave reinforcements
    for cycle in range(3):
        cycle_offset = 32.0 + cycle * 32.0
        pattern_descent = [
            (0.0, 88, 0.8), (1.0, 88, 0.8), (2.0, 85, 0.8), (3.0, 83, 0.8),
            (4.0, 81, 0.8), (5.0, 80, 0.8), (6.0, 76, 0.8), (7.0, 73, 0.8),
            (8.0, 88, 0.8), (9.0, 88, 0.8), (10.0, 85, 0.8), (11.0, 83, 0.8),
            (12.0, 81, 0.8), (13.0, 80, 0.8), (14.0, 76, 0.8), (15.0, 75, 0.8),
            (16.0, 88, 0.8), (17.0, 88, 0.8), (18.0, 85, 0.8), (19.0, 83, 0.8),
            (20.0, 81, 0.8), (21.0, 80, 0.8), (22.0, 76, 0.8), (23.0, 73, 0.8),
            (24.0, 88, 0.8), (25.0, 88, 0.8), (26.0, 85, 0.8), (27.0, 83, 0.8),
            (28.0, 81, 0.8), (29.0, 80, 0.8), (30.0, 76, 0.8), (31.0, 75, 0.8),
        ]
        for p_beat, note, dur_b in pattern_descent:
            if cycle_offset + p_beat < total_beats:
                piano_pattern.append((cycle_offset + p_beat, note, dur_b))
                # Add lower octave for depth in heavy sections
                if cycle >= 1:
                    piano_pattern.append((cycle_offset + p_beat, note - 12, dur_b))

    for p_beat, note, dur_b in piano_pattern:
        start_t = p_beat * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_piano(freq, i / RATE, dur) * 0.35

    # 2. Majestic Orchestral Chamber Strings & Cello (From Bar 9 / Beat 32 onwards)
    # E -> C#m -> A -> B
    strings_chords = [
        (32.0, [40, 47, 52, 56, 59]), (36.0, [37, 44, 49, 52, 56]),
        (40.0, [33, 40, 45, 49, 52]), (44.0, [35, 42, 47, 51, 54]),
        (48.0, [40, 47, 52, 56, 59]), (52.0, [37, 44, 49, 52, 56]),
        (56.0, [33, 40, 45, 49, 52]), (60.0, [35, 42, 47, 51, 54]),
        # Bars 17-24 (With Beat)
        (64.0, [40, 47, 52, 56, 59]), (68.0, [37, 44, 49, 52, 56]),
        (72.0, [33, 40, 45, 49, 52]), (76.0, [35, 42, 47, 51, 54]),
        (80.0, [40, 47, 52, 56, 59]), (84.0, [37, 44, 49, 52, 56]),
        (88.0, [33, 40, 45, 49, 52]), (92.0, [35, 42, 47, 51, 54]),
        # Bars 25-32 (Climax)
        (96.0, [40, 47, 52, 56, 59, 64]), (100.0, [37, 44, 49, 52, 56, 61]),
        (104.0, [33, 40, 45, 49, 52, 57]), (108.0, [35, 42, 47, 51, 54, 59]),
        (112.0, [40, 47, 52, 56, 59, 64]), (116.0, [37, 44, 49, 52, 56, 61]),
        (120.0, [33, 40, 45, 49, 52, 57]), (124.0, [35, 42, 47, 51, 54, 59]),
    ]
    for start_beat, notes in strings_chords:
        start_t = start_beat * beat
        dur = beat * 3.92
        for note in notes:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    out[n_start + i] += synth_strings(freq, i / RATE, dur) * 0.24

    # 3. Rick Rubin Boom-Bap Drums & Heavy 808 Sub-Bass (Bars 17-32 / Beats 64 to 128)
    for bar in range(16, 32):
        bb = bar * 4
        # Heavy distorted kick on 0.0 and 2.5
        for ko in [0.0, 2.5]:
            kn = round((bb + ko) * beat * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.50
            # 808 sub bass rumbling on root notes [E, C#, A, B]
            roots = [28, 25, 21, 23]
            root = roots[bar % 4]
            freq = midi_to_freq(root + 12)  # E1, C#1, A0, B0 pitched for audible punch
            for i in range(round(beat * 1.6 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += synth_sub808(freq, i / RATE, beat * 1.6) * 0.44

        # Iconic explosive boom-bap snare on 1.0 and 3.0
        for so in [1.0, 3.0]:
            sn = round((bb + so) * beat * RATE)
            for i in range(round(0.20 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.44

        # Rolling 8th hi-hats with swing and open hat on 3.5
        for hs in range(8):
            open_h = (hs == 7)
            hn = round((bb + hs * 0.5) * beat * RATE)
            for i in range(round((0.12 if open_h else 0.045) * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=open_h) * (0.22 if open_h else 0.16)

    # 4. The Legendary Distorted Vocoder Guitar Solo (Bars 25-32 / Beats 96 to 128)
    # Kanye's soaring singing melody ("Baby, I got a plan... Run away as fast as you can")
    runaway_solo = [
        # Bar 25
        (96.0, 71, 1.0), (97.0, 68, 1.0), (98.0, 64, 1.5), (99.5, 66, 0.5),
        # Bar 26
        (100.0, 68, 1.5), (101.5, 66, 0.5), (102.0, 64, 1.0), (103.0, 61, 1.0),
        # Bar 27
        (104.0, 64, 1.0), (105.0, 66, 1.0), (106.0, 68, 1.0), (107.0, 71, 0.8), (107.8, 73, 1.2),
        # Bar 28
        (108.0, 71, 1.5), (109.5, 68, 0.5), (110.0, 66, 1.0), (111.0, 64, 2.0),
        # Bar 29
        (112.0, 71, 1.0), (113.0, 68, 1.0), (114.0, 64, 1.5), (115.5, 66, 0.5),
        # Bar 30
        (116.0, 68, 1.5), (117.5, 66, 0.5), (118.0, 64, 1.0), (119.0, 61, 1.0),
        # Bar 31
        (120.0, 64, 1.0), (121.0, 66, 1.0), (122.0, 68, 1.0), (123.0, 71, 0.8), (123.8, 73, 1.2),
        # Bar 32: Sustained soaring high E5 (76) with vibrato decaying right into beat 127.8
        (124.0, 76, 3.4),
    ]
    for s_beat, note, dur_b in runaway_solo:
        start_t = s_beat * beat
        freq = midi_to_freq(note)
        dur = dur_b * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                out[n_start + i] += synth_vocoder_guitar(freq, i / RATE, dur) * 0.36

    write_wav(ROOT / 'ye_runaway.wav', out)

# ==========================================
# 2. SFX GENERATION
# ==========================================

def render_sfx():
    # 1. JUMP
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

    # 2. BOBUX
    dur = 0.35
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    chimes = [(0.0, 987.77, 0.25), (0.05, 1318.5, 0.28), (0.10, 1975.5, 0.24)]
    for start_t, freq, ch_dur in chimes:
        n_st = round(start_t * RATE)
        n_len = round(ch_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                samples[n_st + i] += synth_bell(freq, i / RATE, ch_dur) * 0.55
    write_wav(ROOT / 'sfx_bobux.wav', samples)

    # 3. SCORE
    dur = 0.18
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    notes = [(0.0, 523.25, 0.14), (0.04, 783.99, 0.14)]
    for start_t, freq, ch_dur in notes:
        n_st = round(start_t * RATE)
        n_len = round(ch_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                samples[n_st + i] += synth_koto_pluck(freq, i / RATE, ch_dur) * 0.55
    write_wav(ROOT / 'score.wav', samples)

    # 4. UI
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

    # 5. COLLISION
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

    # 6. CHECKPOINT
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
                samples[n_st + i] += synth_bell(freq, i / RATE, ch_dur) * 0.45
    write_wav(ROOT / 'checkpoint.wav', samples)

    # 7. COMPLETE
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
                samples[n_st + i] += synth_bell(freq, i / RATE, n_dur) * 0.48
    write_wav(ROOT / 'complete.wav', samples)

    # 8. UNLOCK
    dur = 0.55
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    sparkles = [(0.0 + k * 0.045, midi_to_freq(m), 0.22) for k, m in enumerate([64, 67, 71, 74, 76, 79, 83, 88])]
    for start_t, freq, n_dur in sparkles:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                samples[n_st + i] += synth_bell(freq, i / RATE, n_dur) * 0.32
    write_wav(ROOT / 'unlock.wav', samples)

    # 9. PAUSE
    dur = 0.18
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    p_notes = [(0.0, 659.25, 0.12), (0.05, 440.0, 0.13)]
    for start_t, freq, n_dur in p_notes:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                samples[n_st + i] += synth_rhodes(freq, i / RATE, n_dur) * 0.55
    write_wav(ROOT / 'pause.wav', samples)

    # 10. RESUME
    dur = 0.18
    n_samples = round(dur * RATE)
    samples = [0.0] * n_samples
    r_notes = [(0.0, 440.0, 0.12), (0.05, 659.25, 0.13)]
    for start_t, freq, n_dur in r_notes:
        n_st = round(start_t * RATE)
        n_len = round(n_dur * RATE)
        for i in range(n_len):
            if n_st + i < n_samples:
                samples[n_st + i] += synth_rhodes(freq, i / RATE, n_dur) * 0.55
    write_wav(ROOT / 'resume.wav', samples)

def main():
    print('Composing 12 unique level BGM soundtracks...')
    render_first_bloom()
    render_ye_flashing_lights()
    render_ye_ghost_town()
    render_sakura_garden()
    render_ye_stronger()
    render_eots_we_are_the_people()
    render_golden_bloom()
    render_ye_father_stretch()
    render_ye_heartless()
    render_yozakura()
    render_lofi_garden()
    render_ye_runaway()
    print('Composing arcade kawaii SFX...')
    render_sfx()
    total_wavs = len(list(ROOT.glob('*.wav')))
    print(f'Successfully composed {total_wavs} WAV files in {ROOT}.')
    assert total_wavs >= 22, f'Expected at least 22 wav files, got {total_wavs}'

if __name__ == '__main__':
    main()
