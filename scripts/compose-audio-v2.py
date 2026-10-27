"""Compose original, deterministic mono PCM themes and event tones for Cherry Bloom."""
import math
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'assets/v2/audio'
RATE = 22050

def render(name, notes, beat, amplitude=0.22):
    samples = [0.0] * round(len(notes) * beat * RATE)
    for index, midi in enumerate(notes):
        frequency = 440 * 2 ** ((midi - 69) / 12)
        duration = beat * 0.88
        for n in range(round(duration * RATE)):
            t = n / RATE
            envelope = min(1, t / 0.012) * max(0, 1 - t / duration) ** 1.8
            tone = math.sin(2 * math.pi * frequency * t) + 0.18 * math.sin(4 * math.pi * frequency * t)
            samples[round(index * beat * RATE) + n] += amplitude * envelope * tone
    ROOT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(ROOT / f'{name}.wav'), 'wb') as output:
        output.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        output.writeframes(b''.join(struct.pack('<h', round(max(-1, min(1, s)) * 32767)) for s in samples))

themes = {
    'first_bloom': [72, 76, 79, 76, 74, 77, 81, 77, 76, 79, 84, 79, 74, 77, 79, 71],
    'sakura_garden': [74, 78, 81, 85, 81, 78, 76, 73, 74, 81, 78, 85, 83, 81, 78, 73],
    'golden_bloom': [69, 73, 76, 80, 76, 73, 71, 68, 69, 76, 80, 83, 80, 76, 73, 68],
    'yozakura': [69, 72, 76, 79, 76, 72, 67, 71, 69, 76, 79, 83, 79, 76, 72, 67],
}
for name, notes in themes.items():
    render(name, notes, 0.32 if name != 'yozakura' else 0.42, 0.15)
for name, notes in {
    'ui': [84], 'jump': [72, 79], 'score': [84, 88], 'collision': [48, 43, 36],
    'checkpoint': [72, 76, 79, 84], 'complete': [76, 79, 84, 88], 'unlock': [79, 83, 86, 91],
    'pause': [76, 72], 'resume': [72, 76],
}.items():
    render(name, notes, 0.075 if name in ('ui', 'jump', 'score') else 0.12)

assert len(list(ROOT.glob('*.wav'))) == 13
print('Composed 4 seamless-boundary themes and 9 original SFX, mono PCM 22050 Hz.')
