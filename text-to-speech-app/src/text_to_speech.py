from gtts import gTTS
import os

def convert_text_to_speech(text, filename, language='hu'):
    """
    Convert text to speech and save as a WAV file.
    
    Args:
        text (str): Text to convert to speech
        filename (str): Filename to save the audio (with or without extension)
        language (str): Language code ('en' for English, 'hu' for Hungarian)
    """
    # Ensure the filename has .wav extension
    if not filename.endswith('.wav'):
        if '.' in filename:
            filename = filename.rsplit('.', 1)[0] + '.wav'
        else:
            filename = filename + '.wav'
    
    # Convert text to speech using gTTS with Hungarian language
    tts = gTTS(text=text, lang=language, slow=False)
    
    # First save as MP3 (gTTS only outputs MP3)
    temp_mp3 = filename.replace('.wav', '.mp3')
    tts.save(temp_mp3)
    
    # Convert MP3 to WAV using pydub
    try:
        from pydub import AudioSegment
        sound = AudioSegment.from_mp3(temp_mp3)
        sound.export(filename, format="wav")
        # Remove temporary MP3 file
        os.remove(temp_mp3)
    except ImportError:
        return f"Warning: pydub not installed. File saved as {temp_mp3} instead of WAV."
    except Exception as e:
        return f"Error converting MP3 to WAV: {str(e)}"
    
    return filename