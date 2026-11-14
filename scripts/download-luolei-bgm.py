import os
import sys
import subprocess
import wave
import struct
import shutil
from pathlib import Path

def main():
    try:
        import imageio_ffmpeg
        ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        ffmpeg_exe = "ffmpeg"

    import yt_dlp

    root = Path(__file__).resolve().parents[1]
    output_dir = root / "assets/v2/audio"
    output_dir.mkdir(parents=True, exist_ok=True)
    temp_dir = root / ".temp_audio"
    temp_dir.mkdir(parents=True, exist_ok=True)

    target_wav = output_dir / "luolei_yuexinmiao.wav"
    raw_download = temp_dir / "raw_audio"

    url = "https://www.youtube.com/watch?v=_SfPg54yj7M"
    print(f"Downloading from {url}...")

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': str(raw_download) + '.%(ext)s',
        'quiet': False,
        'no_warnings': True,
        'overwrites': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        downloaded_file = ydl.prepare_filename(info)

    print(f"Downloaded: {downloaded_file}")

    temp_wav = temp_dir / "converted.wav"
    # Convert using ffmpeg to 22050 Hz, 1 channel (mono), 16-bit PCM
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", str(downloaded_file),
        "-ar", "22050",
        "-ac", "1",
        "-c:a", "pcm_s16le",
        "-filter:a", "volume=0.9",
        str(temp_wav)
    ]
    print("Running ffmpeg conversion...")
    subprocess.run(cmd, check=True)

    # Read wav and apply seamless loop crossfade
    with wave.open(str(temp_wav), 'rb') as w_in:
        nchannels = w_in.getnchannels()
        sampwidth = w_in.getsampwidth()
        framerate = w_in.getframerate()
        nframes = w_in.getnframes()
        frames = w_in.readframes(nframes)

    samples = list(struct.unpack(f"<{nframes}h", frames))
    
    # Crossfade loop edges (1024 samples)
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

    stat = target_wav.stat()
    print(f"Successfully created: {target_wav} ({stat.st_size} bytes, {n/22050:.2f} seconds)")

    # Clean up temp
    shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    main()
