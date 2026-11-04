"""Compose arcade multi-track BGM themes and tactile kawaii SFX for Cherry Bloom.
BGM Themes:
  - first_bloom: inspired by "Show Me How" (Men I Trust) - dreamy bedroom pop, Rhodes, warm bass, soft indie drums.
  - sakura_garden: upbeat city-pop/dream-pop evolution of "Show Me How" - warm keys, koto plucks, groovy bass.
  - golden_bloom: inspired by "Inner Light" (Elderbrook & Bob Moses) - sunset melodic house, pumping sidechain pads, 4-on-the-floor.
  - yozakura: inspired by "No Pole" (Don Toliver) - nocturnal synth-trap, gliding lead, 808 sub, crisp trap hats.

SFX (Arcade Kawaii):
  - jump: airy bubble whoosh with pitch sweep.
  - bobux: golden arcade coin chime with FM shimmer.
  - score: gentle sakura wood chime.
  - ui: tactile arcade jelly/wood pop.
  - collision: soft cartoon bonk with down-sweep.
  - checkpoint: torii gate chime fanfare.
  - complete: triumphant stage clear fanfare.
  - unlock: magical gacha sparkle.
  - pause / resume: cozy electric piano down/up chirps.
"""
import math
import random
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'assets/v2/audio'
RATE = 22050

# Seed for deterministic noise generation
PRNG = random.Random(42)

def midi_to_freq(m):
    return 440.0 * (2.0 ** ((m - 69.0) / 12.0))

def soft_clip(x):
    """Soft tanh-like saturation to prevent digital distortion and add analog warmth."""
    if x > 1.5:
        return 0.96
    if x < -1.5:
        return -0.96
    return x - (x ** 3) / 6.0

def write_wav(path, samples):
    # Crossfade boundary (256 samples) for clickless looping
    xfade = 256
    n = len(samples)
    if n > xfade * 2:
        for i in range(xfade):
            w = i / xfade
            # blend end into beginning
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

def synth_rhodes(freq, t, dur):
    """Warm detuned electric piano with chorus vibrato."""
    if t < 0 or t >= dur:
        return 0.0
    # Gentle attack, warm exponential decay
    env = min(1.0, t / 0.008) * math.exp(-2.2 * t / dur)
    # Chorus vibrato
    vibrato = 1.0 + 0.003 * math.sin(2 * math.pi * 3.5 * t)
    f = freq * vibrato
    h1 = math.sin(2 * math.pi * f * t)
    h2 = 0.35 * math.sin(4 * math.pi * f * t + 0.5)
    h3 = 0.12 * math.sin(6 * math.pi * f * t + 1.2)
    h4 = 0.04 * math.sin(8 * math.pi * f * t)
    return env * (h1 + h2 + h3 + h4) * 0.7

def synth_bass(freq, t, dur):
    """Warm flatwound electric bass."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.012) * math.exp(-1.8 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.45 * math.sin(4 * math.pi * freq * t)
    h3 = 0.15 * math.sin(6 * math.pi * freq * t)
    return env * (h1 + h2 + h3) * 0.85

def synth_koto_pluck(freq, t, dur):
    """Japanese koto / bright harp pluck."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.004) * math.exp(-4.5 * t / dur)
    h1 = math.sin(2 * math.pi * freq * t)
    h2 = 0.5 * math.sin(4 * math.pi * freq * t + 0.3)
    h3 = 0.3 * math.sin(2 * math.pi * freq * 3.01 * t)
    h4 = 0.15 * math.sin(2 * math.pi * freq * 4.2 * t)
    return env * (h1 + h2 + h3 + h4) * 0.65

def synth_bell(freq, t, dur):
    """FM metallic crystalline bell (Suika / Celeste style)."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.005) * math.exp(-3.5 * t / dur)
    mod = 2.5 * math.exp(-5.0 * t / dur) * math.sin(2 * math.pi * freq * 2.76 * t)
    carrier = math.sin(2 * math.pi * freq * t + mod)
    shimmer = 0.25 * math.sin(2 * math.pi * freq * 4.0 * t) * math.exp(-2.5 * t / dur)
    return env * (carrier + shimmer) * 0.6

def synth_sub808(freq, t, dur, glide_to=None):
    """Deep sliding 808 sub-bass with gentle saturation."""
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.015) * math.exp(-1.2 * t / dur)
    cur_f = freq
    if glide_to is not None:
        p = min(1.0, t / (dur * 0.7))
        cur_f = freq * (1.0 - p) + glide_to * p
    phase = 2 * math.pi * cur_f * t
    tone = math.sin(phase) + 0.18 * math.sin(2 * phase)
    return env * soft_clip(tone * 1.3) * 0.85

# --- Drum Generators ---

def sample_kick(t):
    """Soft warm kick with pitch drop."""
    dur = 0.24
    if t < 0 or t >= dur:
        return 0.0
    env = min(1.0, t / 0.004) * math.exp(-14.0 * t)
    freq = 135.0 * math.exp(-22.0 * t) + 42.0
    return env * math.sin(2 * math.pi * freq * t) * 0.95

def sample_snare(t, noise_table):
    """Snare / rimshot with soft tonal snap and noise tail."""
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
    """Crisp high metallic percussion."""
    dur = 0.16 if open_hat else 0.045
    if t < 0 or t >= dur:
        return 0.0
    decay = 18.0 if open_hat else 65.0
    env = min(1.0, t / 0.002) * math.exp(-decay * t)
    idx = int((t * RATE * 2.3) % len(noise_table))
    # High metallic ring + noise
    ring = 0.3 * math.sin(2 * math.pi * 7800 * t) + 0.2 * math.sin(2 * math.pi * 9400 * t)
    return (noise_table[idx] * 0.6 + ring) * env * 0.35

# Build a precomputed deterministic noise table
NOISE_TABLE = [PRNG.uniform(-1.0, 1.0) for _ in range(8192)]

# ==========================================
# 1. BGM COMPOSITIONS
# ==========================================

def render_first_bloom():
    """BGM 1: First Bloom (Home & Levels 1-3).
    Ref: 'Show Me How' — Men I Trust.
    BPM: 84 (~0.714s/beat). 4 bars (16 beats) = 11.428s.
    Chord progression: Am7 -> Cmaj7/G -> Fmaj7 -> Dm7.
    """
    bpm = 84.0
    beat = 60.0 / bpm
    total_beats = 16
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Chords (Am7, Cmaj7, Fmaj7, Dm7)
    chords = [
        # Bar 1: Am7
        (0.0, [57, 60, 64, 67], beat * 4),
        # Bar 2: Cmaj7
        (4.0, [48, 55, 59, 64], beat * 4),
        # Bar 3: Fmaj7
        (8.0, [53, 57, 60, 64], beat * 4),
        # Bar 4: Dm7
        (12.0, [50, 53, 57, 60], beat * 4),
    ]
    for start_beat, midi_notes, dur in chords:
        start_t = start_beat * beat
        for note in midi_notes:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    out[n_start + i] += synth_rhodes(freq, t, dur) * 0.16

    # Melodic walking bassline (Show Me How warm picked bass)
    bass_line = [
        # Bar 1 (Am)
        (0.0, 45, beat * 1.4), (1.5, 48, beat * 0.8), (2.5, 52, beat * 1.3),
        # Bar 2 (C)
        (4.0, 48, beat * 1.4), (5.5, 55, beat * 0.8), (6.5, 52, beat * 1.3),
        # Bar 3 (F)
        (8.0, 41, beat * 1.4), (9.5, 45, beat * 0.8), (10.5, 48, beat * 1.3),
        # Bar 4 (Dm)
        (12.0, 43, beat * 1.4), (13.5, 45, beat * 0.8), (14.5, 47, beat * 1.3),
    ]
    for b_beat, note, dur in bass_line:
        start_t = b_beat * beat
        freq = midi_to_freq(note)
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_bass(freq, t, dur) * 0.38

    # Floating Lead Melody (Dreamy bell)
    melody = [
        (0.0, 76, beat * 1.5), (2.0, 79, beat * 1.5),
        (4.0, 76, beat * 1.0), (5.5, 74, beat * 1.8),
        (8.0, 72, beat * 1.5), (10.0, 76, beat * 1.5),
        (12.0, 74, beat * 1.0), (13.5, 71, beat * 2.0),
    ]
    for m_beat, note, dur in melody:
        start_t = m_beat * beat
        freq = midi_to_freq(note)
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_bell(freq, t, dur) * 0.18

    # Soft Indie Drums
    for bar in range(4):
        bar_b = bar * 4
        # Kicks on 1 and 2.5
        for k_offset in [0.0, 2.5]:
            kt = (bar_b + k_offset) * beat
            kn = round(kt * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.38
        # Snare/rim on 2 and 4
        for s_offset in [1.0, 3.0]:
            st = (bar_b + s_offset) * beat
            sn = round(st * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        # Hi-hats on 8ths
        for h_step in range(8):
            ht = (bar_b + h_step * 0.5) * beat
            hn = round(ht * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.22

    write_wav(ROOT / 'first_bloom.wav', out)

def render_sakura_garden():
    """BGM 2: Sakura Garden (Levels 4-6).
    Evolution of 'Show Me How' into upbeat Japanese dream-pop.
    BPM: 96 (~0.625s/beat). 4 bars (16 beats) = 10.0s.
    Chord progression: Dmaj7 -> Bm7 -> Em7 -> A7sus4.
    Koto arpeggio pattern + syncopated bass.
    """
    bpm = 96.0
    beat = 60.0 / bpm
    total_beats = 16
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Chords (warm rhodes pad)
    chords = [
        (0.0, [50, 57, 61, 66], beat * 4),  # Dmaj7
        (4.0, [47, 54, 59, 62], beat * 4),  # Bm7
        (8.0, [52, 55, 59, 64], beat * 4),  # Em7
        (12.0, [45, 52, 57, 62], beat * 4), # A7sus4
    ]
    for start_beat, midi_notes, dur in chords:
        start_t = start_beat * beat
        for note in midi_notes:
            freq = midi_to_freq(note)
            n_start = round(start_t * RATE)
            n_len = round(dur * RATE)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    out[n_start + i] += synth_rhodes(freq, t, dur) * 0.14

    # Japanese Koto Pluck Arpeggio
    koto_pattern = [
        # Bar 1 (Dmaj7)
        (0.0, 69), (0.5, 74), (1.0, 78), (1.5, 81), (2.0, 78), (2.5, 74), (3.0, 78), (3.5, 81),
        # Bar 2 (Bm7)
        (4.0, 66), (4.5, 71), (5.0, 74), (5.5, 78), (6.0, 74), (6.5, 71), (7.0, 74), (7.5, 78),
        # Bar 3 (Em7)
        (8.0, 67), (8.5, 71), (9.0, 76), (9.5, 79), (10.0, 76), (10.5, 71), (11.0, 74), (11.5, 76),
        # Bar 4 (A7sus4)
        (12.0, 69), (12.5, 74), (13.0, 76), (13.5, 81), (14.0, 79), (14.5, 76), (15.0, 74), (15.5, 69),
    ]
    for p_beat, note in koto_pattern:
        start_t = p_beat * beat
        freq = midi_to_freq(note)
        dur = beat * 0.95
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.26

    # Upbeat Walking Bassline
    bass_notes = [
        (0.0, 50, beat * 1.2), (1.5, 57, beat * 0.8), (2.0, 50, beat * 0.8), (3.0, 49, beat * 0.8),
        (4.0, 47, beat * 1.2), (5.5, 54, beat * 0.8), (6.0, 47, beat * 0.8), (7.0, 50, beat * 0.8),
        (8.0, 52, beat * 1.2), (9.5, 55, beat * 0.8), (10.0, 52, beat * 0.8), (11.0, 54, beat * 0.8),
        (12.0, 45, beat * 1.2), (13.5, 52, beat * 0.8), (14.0, 55, beat * 0.8), (15.0, 47, beat * 0.8),
    ]
    for b_beat, note, dur in bass_notes:
        start_t = b_beat * beat
        freq = midi_to_freq(note)
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_bass(freq, t, dur) * 0.36

    # Groovy Drums
    for bar in range(4):
        bb = bar * 4
        # Kicks on 1, 2.5, 3.5
        for ko in [0.0, 2.5, 3.5]:
            kt = (bb + ko) * beat
            kn = round(kt * RATE)
            for i in range(round(0.24 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.38
        # Snare on 2 and 4
        for so in [1.0, 3.0]:
            st = (bb + so) * beat
            sn = round(st * RATE)
            for i in range(round(0.18 * RATE)):
                if sn + i < num_samples:
                    out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.32
        # Hi-hats
        for hs in range(8):
            ht = (bb + hs * 0.5) * beat
            hn = round(ht * RATE)
            for i in range(round(0.045 * RATE)):
                if hn + i < num_samples:
                    out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.20

    write_wav(ROOT / 'sakura_garden.wav', out)

def render_golden_bloom():
    """BGM 3: Golden Bloom (Levels 7-9).
    Ref: 'Inner Light' — Elderbrook & Bob Moses.
    BPM: 120 (0.5s/beat). 8 bars (32 beats) = 16.0s loop.
    Chord progression: C#m7 -> Aadd9 -> E -> B.
    Sidechain ducking analog pads + driving 4-on-the-floor + sunset pluck arp.
    """
    bpm = 120.0
    beat = 60.0 / bpm
    total_beats = 32
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Sidechain pad chords (C#m7, Aadd9, E, B) repeated twice for 8 bars
    prog = [
        (0.0, [49, 56, 60, 64], beat * 4),  # C#m7
        (4.0, [45, 52, 57, 61], beat * 4),  # Aadd9
        (8.0, [40, 47, 52, 56], beat * 4),  # E
        (12.0, [47, 51, 54, 59], beat * 4), # B
        (16.0, [49, 56, 60, 64], beat * 4),
        (20.0, [45, 52, 57, 61], beat * 4),
        (24.0, [40, 47, 52, 56], beat * 4),
        (28.0, [47, 51, 54, 59], beat * 4),
    ]
    for start_beat, notes, dur in prog:
        start_t = start_beat * beat
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for note in notes:
            freq = midi_to_freq(note)
            for i in range(n_len):
                if n_start + i < num_samples:
                    t = i / RATE
                    # Sidechain pumping envelope: ducks on beat, swells in offbeat
                    beat_phase = (t % beat) / beat
                    sidechain = 0.25 + 0.75 * math.sin(math.pi * beat_phase)
                    env = min(1.0, t / 0.05) * max(0.0, 1.0 - t / dur) ** 0.5
                    pad_tone = (math.sin(2 * math.pi * freq * t) +
                                0.35 * math.sin(4 * math.pi * freq * t + 0.2) +
                                0.2 * math.sin(2 * math.pi * freq * 1.002 * t))
                    out[n_start + i] += pad_tone * env * sidechain * 0.10

    # Driving 16th-note sunset pluck arpeggio
    scale_notes = [64, 68, 71, 76, 75, 71, 68, 64]
    for step in range(total_beats * 2): # 8th note arps
        p_beat = step * 0.5
        note = scale_notes[step % len(scale_notes)]
        start_t = p_beat * beat
        freq = midi_to_freq(note)
        dur = beat * 0.45
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.16

    # Four-on-the-floor driving kick & sub-bass
    for b in range(total_beats):
        bt = b * beat
        bn = round(bt * RATE)
        # 4-on-the-floor kick
        for i in range(round(0.22 * RATE)):
            if bn + i < num_samples:
                out[bn + i] += sample_kick(i / RATE) * 0.46
        # Clap on 2 and 4
        if b % 2 == 1:
            for i in range(round(0.18 * RATE)):
                if bn + i < num_samples:
                    out[bn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.30
        # Off-beat hi-hat (on the "and" of every beat)
        ht = bt + beat * 0.5
        hn = round(ht * RATE)
        for i in range(round(0.08 * RATE)):
            if hn + i < num_samples:
                out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE, open_hat=True) * 0.25

    # Pulsing Sub-bass
    sub_bass_notes = [
        (0.0, 37, beat * 4), (4.0, 33, beat * 4), (8.0, 28, beat * 4), (12.0, 35, beat * 4),
        (16.0, 37, beat * 4), (20.0, 33, beat * 4), (24.0, 28, beat * 4), (28.0, 35, beat * 4),
    ]
    for sb_beat, note, dur in sub_bass_notes:
        start_t = sb_beat * beat
        freq = midi_to_freq(note)
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                # Sidechain ducking on bass too
                beat_phase = (t % beat) / beat
                sc = 0.3 + 0.7 * (beat_phase ** 1.5)
                out[n_start + i] += synth_sub808(freq, t, dur) * sc * 0.35

    write_wav(ROOT / 'golden_bloom.wav', out)

def render_yozakura():
    """BGM 4: Yozakura Night (Levels 10-12 & Endless).
    Ref: 'No Pole' — Don Toliver.
    BPM: 86 (~0.6976s/beat). 4 bars (16 beats) = 11.162s.
    Nocturnal synth-trap with gliding 808 sub, syncopated string riff, fast hi-hat rolls.
    """
    bpm = 86.0
    beat = 60.0 / bpm
    total_beats = 16
    total_dur = total_beats * beat
    num_samples = round(total_dur * RATE)
    out = [0.0] * num_samples

    # Iconic Nocturnal Plucked Riff (No Pole style koto/string hook)
    riff = [
        # Bar 1 (Cm)
        (0.0, 72), (0.75, 75), (1.5, 74), (2.25, 72), (3.0, 70), (3.5, 72),
        # Bar 2 (Fm)
        (4.0, 68), (4.75, 72), (5.5, 70), (6.25, 68), (7.0, 67), (7.5, 68),
        # Bar 3 (Eb)
        (8.0, 70), (8.75, 75), (9.5, 74), (10.25, 72), (11.0, 70), (11.5, 72),
        # Bar 4 (Dm7b5 -> G)
        (12.0, 68), (12.75, 70), (13.5, 72), (14.25, 74), (15.0, 71), (15.5, 67),
    ]
    for r_beat, note in riff:
        start_t = r_beat * beat
        freq = midi_to_freq(note)
        dur = beat * 0.8
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_koto_pluck(freq, t, dur) * 0.32

    # Cinematic Dark Synth Strings / Pad
    pads = [
        (0.0, [48, 55, 60, 63], beat * 4),  # Cm
        (4.0, [41, 48, 53, 56], beat * 4),  # Fm
        (8.0, [43, 50, 55, 58], beat * 4),  # Eb
        (12.0, [43, 47, 50, 53], beat * 4), # G7
    ]
    for start_beat, notes, dur in pads:
        start_t = start_beat * beat
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

    # Sliding 808 Sub-Bass
    sub_808 = [
        (0.0, 36, beat * 3.5, 36),        # C1
        (4.0, 29, beat * 3.0, 31),        # F0 -> G0 glide
        (8.0, 31, beat * 3.5, 31),        # Eb1
        (12.0, 35, beat * 2.0, 36),       # B0 -> C1 glide
        (14.0, 31, beat * 1.8, 31),
    ]
    for s_beat, note, dur, target in sub_808:
        start_t = s_beat * beat
        freq = midi_to_freq(note)
        target_f = midi_to_freq(target)
        n_start = round(start_t * RATE)
        n_len = round(dur * RATE)
        for i in range(n_len):
            if n_start + i < num_samples:
                t = i / RATE
                out[n_start + i] += synth_sub808(freq, t, dur, glide_to=target_f) * 0.45

    # Trap Drum Groove (Punchy kick, snappy snare on 3, rapid hi-hat rolls)
    for bar in range(4):
        bb = bar * 4
        # Kicks
        for ko in [0.0, 2.25]:
            kt = (bb + ko) * beat
            kn = round(kt * RATE)
            for i in range(round(0.22 * RATE)):
                if kn + i < num_samples:
                    out[kn + i] += sample_kick(i / RATE) * 0.44
        # Trap Snare / Rim on beat 3 (half-time feel)
        st = (bb + 2.0) * beat
        sn = round(st * RATE)
        for i in range(round(0.18 * RATE)):
            if sn + i < num_samples:
                out[sn + i] += sample_snare(i / RATE, NOISE_TABLE) * 0.36
        # Hi-hats with roll on beat 4
        for step in range(16):
            step_beat = step * 0.25
            if step >= 12: # 16th-note fast rolls
                ht = (bb + step_beat) * beat
                hn = round(ht * RATE)
                for i in range(round(0.035 * RATE)):
                    if hn + i < num_samples:
                        out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.24
            elif step % 2 == 0: # 8th notes
                ht = (bb + step_beat) * beat
                hn = round(ht * RATE)
                for i in range(round(0.045 * RATE)):
                    if hn + i < num_samples:
                        out[hn + i] += sample_hihat(i / RATE, NOISE_TABLE) * 0.18

    write_wav(ROOT / 'yozakura.wav', out)

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
        # Exponential pitch rise
        f = 220.0 * (620.0 / 220.0) ** (p ** 1.2)
        env = min(1.0, t / 0.008) * ((1.0 - p) ** 1.4)
        # Resonant sine + air whoosh
        tone = math.sin(2 * math.pi * f * t) + 0.3 * math.sin(4 * math.pi * f * t)
        noise_idx = int((t * RATE * 1.5) % len(NOISE_TABLE))
        air = NOISE_TABLE[noise_idx] * 0.15 * (1.0 - p)
        samples[i] = (tone + air) * env * 0.52
    write_wav(ROOT / 'jump.wav', samples)

    # 2. BOBUX (NOVO): Golden Arcade Coin Shimmer (Dual FM metallic bells B5 -> E6 -> B6)
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
    print('Composing multi-track BGM themes...')
    render_first_bloom()
    render_sakura_garden()
    render_golden_bloom()
    render_yozakura()
    print('Composing arcade kawaii SFX...')
    render_sfx()
    total_wavs = len(list(ROOT.glob('*.wav')))
    print(f'Successfully composed {total_wavs} WAV files in {ROOT}.')
    assert total_wavs >= 14, f'Expected at least 14 wav files, got {total_wavs}'

if __name__ == '__main__':
    main()
