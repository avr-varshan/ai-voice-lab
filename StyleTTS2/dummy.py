import os
import wave
import contextlib

# Folder containing your .wav files
folder_path = './Data/wavs'

total_duration = 0.0  # in seconds

for filename in os.listdir(folder_path):
    if filename.endswith('.wav'):
        filepath = os.path.join(folder_path, filename)
        with contextlib.closing(wave.open(filepath, 'r')) as f:
            frames = f.getnframes()
            rate = f.getframerate()
            duration = frames / float(rate)
            total_duration += duration

total_minutes = total_duration / 60
print(f"Total audio duration: {total_minutes:.2f} minutes")
