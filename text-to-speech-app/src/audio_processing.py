from pydub import AudioSegment
from pydub.playback import play
import os

def play_audio(filename: str):
    if os.path.exists(filename):
        audio = AudioSegment.from_mp3(filename)
        play(audio)
    else:
        print(f"File {filename} does not exist.")

def merge_audio(files: list, output_filename: str):
    combined = AudioSegment.empty()
    for file in files:
        if os.path.exists(file):
            audio = AudioSegment.from_mp3(file)
            combined += audio
        else:
            print(f"File {file} does not exist and will be skipped.")
    combined.export(output_filename, format='mp3')