import os
# Import directly without alias
import custom_speech_recognition

def recognize_speech_from_audio(audio_path):
    """
    Recognize speech from an audio file using Google's speech recognition service.
    Automatically converts MP3 to WAV if needed.
    
    Args:
        audio_path (str): Path to the audio file
        
    Returns:
        str: Recognized text from the audio file
    """
    # Check if the file exists
    if not os.path.exists(audio_path):
        return f"Error: File not found at {audio_path}"
    
    # Handle MP3 files by converting to WAV
    if audio_path.lower().endswith('.mp3'):
        try:
            from pydub import AudioSegment
            # Create a temporary WAV file
            wav_path = audio_path.rsplit('.', 1)[0] + '.wav'
            print(f"Converting MP3 to WAV format: {wav_path}")
            sound = AudioSegment.from_mp3(audio_path)
            sound.export(wav_path, format="wav")
            audio_path = wav_path
        except ImportError:
            return "Error: pydub is required for MP3 conversion. Install with 'pip install pydub'."
        except Exception as e:
            return f"Error converting MP3 to WAV: {str(e)}"
    
    # Initialize recognizer - use the full module path
    recognizer = custom_speech_recognition.Recognizer()
    
    try:
        # Load the audio file
        with custom_speech_recognition.AudioFile(audio_path) as source:
            # Record the audio data
            audio_data = recognizer.record(source)
            
            # Use Google's speech recognition
            text = recognizer.recognize_google(audio_data)
            return text
    except custom_speech_recognition.UnknownValueError:
        return "Speech Recognition could not understand audio"
    except custom_speech_recognition.RequestError as e:
        return f"Could not request results from Speech Recognition service; {e}"
    except Exception as e:
        return f"Error during speech recognition: {str(e)}"