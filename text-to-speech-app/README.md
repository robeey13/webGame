# Text-to-Speech Application

This project is a simple text-to-speech application that converts text input into speech and saves it as an MP3 file. It also includes functionality to recognize speech from audio files and manipulate audio files.

## Features

- Convert text to speech using the `gtts` library.
- Recognize speech from audio files using the `SpeechRecognition` library.
- Play and merge audio files using the `pydub` library.
- Utility functions for file handling.

## Installation

To set up the project, you need to install the required dependencies. You can do this by running:

```
pip install -r requirements.txt
```

## Usage

1. **Convert Text to Speech**: Use the `convert_text_to_speech` function from `text_to_speech.py` to convert your text into an MP3 file.
   
   Example:
   ```python
   from src.text_to_speech import convert_text_to_speech
   convert_text_to_speech("Hello, world!", "output.mp3")
   ```

2. **Recognize Speech from Audio**: Use the `recognize_speech_from_audio` function from `speech_recognition.py` to convert speech in an audio file back to text.

   Example:
   ```python
   from src.speech_recognition import recognize_speech_from_audio
   text = recognize_speech_from_audio("audio.wav")
   ```

3. **Play Audio**: Use the `play_audio` function from `audio_processing.py` to play the generated MP3 file.

   Example:
   ```python
   from src.audio_processing import play_audio
   play_audio("output.mp3")
   ```

4. **Merge Audio Files**: Use the `merge_audio` function from `audio_processing.py` to merge multiple audio files into one.

   Example:
   ```python
   from src.audio_processing import merge_audio
   merge_audio(["audio1.mp3", "audio2.mp3"], "merged_output.mp3")
   ```

## Libraries Used

- **gtts**: Google Text-to-Speech, used for converting text to speech.
- **SpeechRecognition**: A library for performing speech recognition, allowing the conversion of speech to text.
- **pydub**: A simple and easy-to-use library for audio manipulation.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.