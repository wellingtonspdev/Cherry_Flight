import os
import sys
import subprocess
import wave
import struct
import shutil
from pathlib import Path

TRACKS = [
    {
        "filename": "first_bloom.wav",
        "title": "Show Me How",
        "artist": "Men I Trust",
        "url": "https://www.youtube.com/watch?v=OZRYzH0Q0pU",
        "max_duration": 210,
    },
    {
        "filename": "ye_flashing_lights.wav",
        "title": "Flashing Lights",
        "artist": "Kanye West",
        "url": "https://www.youtube.com/watch?v=ZAz3rnLGthg",
        "max_duration": 210,
    },
    {
        "filename": "ye_ghost_town.wav",
        "title": "Ghost Town",
        "artist": "Kanye West",
        "url": "https://www.youtube.com/watch?v=qAsHVwl-MU4",
        "max_duration": 210,
    },
    {
        "filename": "sakura_garden.wav",
        "title": "Walking On A Dream",
        "artist": "Empire of the Sun",
        "url": "https://www.youtube.com/watch?v=kNCMxxYVYYY",
        "max_duration": 210,
    },
    {
        "filename": "ye_stronger.wav",
        "title": "Stronger",
        "artist": "Kanye West",
        "url": "https://www.youtube.com/watch?v=3mwiO5st-us",
        "max_duration": 210,
    },
    {
        "filename": "eots_we_are_the_people.wav",
        "title": "We Are The People",
        "artist": "Empire of the Sun",
        "url": "https://www.youtube.com/watch?v=HevFHRuLeTw",
        "max_duration": 210,
    },
    {
        "filename": "golden_bloom.wav",
        "title": "Inner Light",
        "artist": "Elderbrook & Bob Moses",
        "url": "https://www.youtube.com/watch?v=xZiSW0rI_9Y",
        "max_duration": 210,
    },
    {
        "filename": "ye_father_stretch.wav",
        "title": "Father Stretch My Hands Pt. 1",
        "artist": "Kanye West",
        "url": "https://www.youtube.com/watch?v=wuO4_P_8p-Q",
        "max_duration": 210,
    },
    {
        "filename": "ye_heartless.wav",
        "title": "Heartless",
        "artist": "Kanye West",
        "url": "https://www.youtube.com/watch?v=xheuZhFEuDA",
        "max_duration": 210,
    },
    {
        "filename": "yozakura.wav",
        "title": "No Pole",
        "artist": "Don Toliver",
        "url": "https://www.youtube.com/watch?v=fCeiUX59_FM",
        "max_duration": 210,
    },
    {
        "filename": "lofi_garden.wav",
        "title": "Affection",
        "artist": "Jinsang",
        "url": "https://www.youtube.com/watch?v=NAkZ8gUXcIE",
        "max_duration": 210,
    },
    {
        "filename": "ye_runaway.wav",
        "title": "Runaway",
        "artist": "Kanye West",
        "url": "https://www.youtube.com/watch?v=cv1naUa3_3g",
        "max_duration": 240,
    },
]

def process_track(track, ffmpeg_exe, output_dir, temp_dir):
    import yt_dlp

    filename = track["filename"]
    url = track["url"]
    max_duration = track.get("max_duration", 210)
    target_wav = output_dir / filename
    raw_download = temp_dir / f"raw_{filename}"

    print(f"\n==========================================")
    print(f"Processing {track['title']} - {track['artist']}")
    print(f"Target: {filename} from {url}")

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': str(raw_download) + '.%(ext)s',
        'quiet': True,
        'no_warnings': True,
        'overwrites': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        downloaded_file = ydl.prepare_filename(info)

    print(f"Downloaded raw audio to {downloaded_file}")

    temp_wav = temp_dir / f"conv_{filename}"
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", str(downloaded_file),
        "-t", str(max_duration),
        "-ar", "22050",
        "-ac", "1",
        "-c:a", "pcm_s16le",
        "-filter:a", "volume=0.85",
        str(temp_wav)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    with wave.open(str(temp_wav), 'rb') as w_in:
        nframes = w_in.getnframes()
        frames = w_in.readframes(nframes)

    samples = list(struct.unpack(f"<{nframes}h", frames))
    xfade = 1024
    n = len(samples)
    if n > xfade * 2:
        for i in range(xfade):
            w = i / xfade
            start_val = samples[i]
            end_val = samples[n - xfade + i]
            blended = round(start_val * w + end_val * (1.0 - w))
            samples[i] = blended
            samples[n - xfade + i] = blended

    out_frames = bytearray()
    for s in samples:
        val = max(-32768, min(32767, s))
        out_frames.extend(struct.pack('<h', val))

    with wave.open(str(target_wav), 'wb') as w_out:
        w_out.setparams((1, 2, 22050, 0, 'NONE', 'not compressed'))
        w_out.writeframes(out_frames)

    size = target_wav.stat().st_size
    duration_sec = n / 22050
    print(f"Done: {filename} -> {size} bytes ({duration_sec:.1f}s)")
    return size

def main():
    try:
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        ffmpeg_exe = "ffmpeg"

    root = Path(__file__).resolve().parents[1]
    output_dir = root / "assets/v2/audio"
    output_dir.mkdir(parents=True, exist_ok=True)
    temp_dir = root / ".temp_batch_audio"
    temp_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for track in TRACKS:
        try:
            sz = process_track(track, ffmpeg_exe, output_dir, temp_dir)
            results.append((track["filename"], True, sz))
        except Exception as e:
            print(f"Error processing {track['filename']}: {e}")
            results.append((track["filename"], False, str(e)))

    shutil.rmtree(temp_dir, ignore_errors=True)

    print("\n================== SUMMARY ==================")
    all_ok = True
    for fname, ok, detail in results:
        status = "OK" if ok else "FAILED"
        print(f"[{status}] {fname}: {detail}")
        if not ok or detail < 1500000:
            all_ok = False

    if not all_ok:
        sys.exit(1)
    print("\nAll 12 tracks downloaded and converted successfully!")

if __name__ == "__main__":
    main()
