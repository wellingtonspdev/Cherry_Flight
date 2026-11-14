import os
import sys
import wave
import struct
from pathlib import Path

CHORUS_MAP = [
    {
        "filename": "first_bloom.wav",
        "title": "Show Me How",
        "artist": "Men I Trust",
        "start_sec": 36.0,
        "duration_sec": 25.34,
        "desc": "Chorus + 5s build-up & outro: Show me how you care...",
    },
    {
        "filename": "ye_flashing_lights.wav",
        "title": "Flashing Lights",
        "artist": "Kanye West",
        "start_sec": 23.0,
        "duration_sec": 28.00,
        "desc": "Chorus + 5s build-up & outro: Flashing lights...",
    },
    {
        "filename": "ye_ghost_town.wav",
        "title": "Ghost Town",
        "artist": "Kanye West",
        "start_sec": 129.0,
        "duration_sec": 29.80,
        "desc": "Climax + 5s build-up & outro: Some day I will wear a starry crown...",
    },
    {
        "filename": "sakura_garden.wav",
        "title": "Walking On A Dream",
        "artist": "Empire of the Sun",
        "start_sec": 33.0,
        "duration_sec": 28.70,
        "desc": "Chorus + 5s build-up & outro: We are always running for the thrill of it...",
    },
    {
        "filename": "ye_stronger.wav",
        "title": "Stronger",
        "artist": "Kanye West",
        "start_sec": 40.0,
        "duration_sec": 30.40,
        "desc": "Chorus + 5s build-up & outro: N-now th-that don't kill me...",
    },
    {
        "filename": "eots_we_are_the_people.wav",
        "title": "We Are The People",
        "artist": "Empire of the Sun",
        "start_sec": 33.0,
        "duration_sec": 31.00,
        "desc": "Chorus + 5s build-up & outro: We are the people that rule the world...",
    },
    {
        "filename": "golden_bloom.wav",
        "title": "Inner Light",
        "artist": "Elderbrook & Bob Moses",
        "start_sec": 43.0,
        "duration_sec": 30.10,
        "desc": "Drop & Chorus + 5s build-up & outro: I feel your inner light...",
    },
    {
        "filename": "ye_father_stretch.wav",
        "title": "Father Stretch My Hands Pt. 1",
        "artist": "Kanye West",
        "start_sec": 24.0,
        "duration_sec": 31.40,
        "desc": "Metro Drop + Cudi + 5s build-up & outro: Beautiful morning...",
    },
    {
        "filename": "ye_heartless.wav",
        "title": "Heartless",
        "artist": "Kanye West",
        "start_sec": 6.0,
        "duration_sec": 31.70,
        "desc": "Chorus + 5s build-up & outro: In the night I hear 'em talk...",
    },
    {
        "filename": "yozakura.wav",
        "title": "No Pole",
        "artist": "Don Toliver",
        "start_sec": 13.0,
        "duration_sec": 30.90,
        "desc": "Hook + 5s build-up & outro: I came in with a pole...",
    },
    {
        "filename": "lofi_garden.wav",
        "title": "Affection",
        "artist": "Jinsang",
        "start_sec": 0.0,
        "duration_sec": 32.30,
        "desc": "Theme + 5s build-up & outro: Main lo-fi flute & keys melody",
    },
    {
        "filename": "ye_runaway.wav",
        "title": "Runaway",
        "artist": "Kanye West",
        "start_sec": 33.0,
        "duration_sec": 83.60,
        "desc": "Drop & Toast Chorus + 5s build-up & outro: Let's have a toast for the douchebags...",
    },
    {
        "filename": "luolei_yuexinmiao.wav",
        "title": "落泪 (我真的特别爱你)",
        "artist": "月薪喵",
        "start_sec": 0.0,
        "duration_sec": 46.00,
        "desc": "Viral Drop + 10s outro: 我真的特别爱你...",
    },
]

def main():
    root = Path(__file__).resolve().parents[1]
    backup_dir = root / ".raw_bgm_backup"
    output_dir = root / "assets/v2/audio"
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Slicing Instagram-style chorus snippets for all {len(CHORUS_MAP)} songs...")

    for item in CHORUS_MAP:
        fname = item["filename"]
        source_path = backup_dir / fname
        if not source_path.exists():
            source_path = output_dir / fname

        with wave.open(str(source_path), 'rb') as w_in:
            rate = w_in.getframerate()
            nchannels = w_in.getnchannels()
            sampwidth = w_in.getsampwidth()
            total_frames = w_in.getnframes()
            frames = w_in.readframes(total_frames)

        samples = list(struct.unpack(f"<{total_frames}h", frames))

        start_frame = int(item["start_sec"] * rate)
        target_frames = int(item["duration_sec"] * rate)
        end_frame = min(len(samples), start_frame + target_frames)

        sliced = samples[start_frame:end_frame]
        n = len(sliced)

        # Micro fade-in (512 samples) to eliminate click at cut start
        fade_in = min(512, n // 4)
        for i in range(fade_in):
            sliced[i] = round(sliced[i] * (i / fade_in))

        # Seamless loop crossfade (1024 samples) between end and start
        xfade = min(1024, n // 4)
        if n > xfade * 2:
            for i in range(xfade):
                w = i / xfade
                start_val = sliced[i]
                end_val = sliced[n - xfade + i]
                blended = round(start_val * w + end_val * (1.0 - w))
                sliced[i] = blended
                sliced[n - xfade + i] = blended

        out_frames = bytearray()
        for s in sliced:
            val = max(-32768, min(32767, s))
            out_frames.extend(struct.pack('<h', val))

        target_wav = output_dir / fname
        with wave.open(str(target_wav), 'wb') as w_out:
            w_out.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
            w_out.writeframes(out_frames)

        size = target_wav.stat().st_size
        duration = n / rate
        print(f"[{item['title']} - {item['artist']}] -> {fname}: {duration:.2f}s ({size} bytes) | {item['desc']}")

    print("\nAll chorus snippets sliced and updated successfully!")

if __name__ == "__main__":
    main()
