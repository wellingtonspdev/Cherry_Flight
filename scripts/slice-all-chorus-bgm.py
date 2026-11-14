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
        "start_sec": 41.0,
        "duration_sec": 15.34,
        "desc": "Chorus: Show me how you care...",
    },
    {
        "filename": "ye_flashing_lights.wav",
        "title": "Flashing Lights",
        "artist": "Kanye West",
        "start_sec": 28.0,
        "duration_sec": 18.00,
        "desc": "Chorus: Flashing lights...",
    },
    {
        "filename": "ye_ghost_town.wav",
        "title": "Ghost Town",
        "artist": "Kanye West",
        "start_sec": 134.0,  # 2:14
        "duration_sec": 19.80,
        "desc": "Climax: Some day I will wear a starry crown...",
    },
    {
        "filename": "sakura_garden.wav",
        "title": "Walking On A Dream",
        "artist": "Empire of the Sun",
        "start_sec": 38.0,
        "duration_sec": 18.70,
        "desc": "Chorus: We are always running for the thrill of it...",
    },
    {
        "filename": "ye_stronger.wav",
        "title": "Stronger",
        "artist": "Kanye West",
        "start_sec": 45.0,
        "duration_sec": 20.40,
        "desc": "Chorus: N-now th-that don't kill me...",
    },
    {
        "filename": "eots_we_are_the_people.wav",
        "title": "We Are The People",
        "artist": "Empire of the Sun",
        "start_sec": 38.0,
        "duration_sec": 21.00,
        "desc": "Chorus: We are the people that rule the world...",
    },
    {
        "filename": "golden_bloom.wav",
        "title": "Inner Light",
        "artist": "Elderbrook & Bob Moses",
        "start_sec": 48.0,
        "duration_sec": 20.10,
        "desc": "Drop & Chorus: I feel your inner light...",
    },
    {
        "filename": "ye_father_stretch.wav",
        "title": "Father Stretch My Hands Pt. 1",
        "artist": "Kanye West",
        "start_sec": 29.0,
        "duration_sec": 21.40,
        "desc": "Metro Drop + Cudi: Beautiful morning...",
    },
    {
        "filename": "ye_heartless.wav",
        "title": "Heartless",
        "artist": "Kanye West",
        "start_sec": 11.0,
        "duration_sec": 21.70,
        "desc": "Chorus: In the night I hear 'em talk...",
    },
    {
        "filename": "yozakura.wav",
        "title": "No Pole",
        "artist": "Don Toliver",
        "start_sec": 18.0,
        "duration_sec": 20.90,
        "desc": "Hook: I came in with a pole...",
    },
    {
        "filename": "lofi_garden.wav",
        "title": "Affection",
        "artist": "Jinsang",
        "start_sec": 5.0,
        "duration_sec": 22.30,
        "desc": "Theme: Main lo-fi flute & keys melody",
    },
    {
        "filename": "ye_runaway.wav",
        "title": "Runaway",
        "artist": "Kanye West",
        "start_sec": 38.0,
        "duration_sec": 73.60,
        "desc": "Drop & Toast Chorus: Let's have a toast for the douchebags...",
    },
    {
        "filename": "luolei_yuexinmiao.wav",
        "title": "落泪 (我真的特别爱你)",
        "artist": "月薪喵",
        "start_sec": 0.0,
        "duration_sec": 36.00,
        "desc": "Viral Drop: 我真的特别爱你...",
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
