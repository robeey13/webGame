import speech_recognition as sr
import os

def recognize_speech_from_audio(audio_file, language='en-US'):
    """
    Convert speech in an audio file to text
    
    Args:
        audio_file: Path to the audio file or uploaded file object
        language (str): Language code ('en-US' for English, 'hu-HU' for Hungarian)
        
    Returns:
        str: Recognized text from the audio
    """
    recognizer = sr.Recognizer()
    
    try:
        # If audio_file is a file path string
        if isinstance(audio_file, str):
            with sr.AudioFile(audio_file) as source:
                audio_data = recognizer.record(source)
        # If audio_file is a file-like object from upload
        else:
            # Save temporarily
            temp_path = os.path.join("static", "audio", "temp_upload.wav")
            audio_file.save(temp_path)
            
            with sr.AudioFile(temp_path) as source:
                audio_data = recognizer.record(source)
                
        # Map language codes from UI to speech recognition API
        lang_map = {
            'en': 'en-US',
            'hu': 'hu-HU'
        }
        
        # Use the mapped language or the original if not found
        recognition_lang = lang_map.get(language, language)
        
        # Recognize speech using Google Speech Recognition
        text = recognizer.recognize_google(audio_data, language=recognition_lang)
        return text
    except sr.UnknownValueError:
        return "Speech recognition could not understand the audio"
    except sr.RequestError:
        return "Could not request results from speech recognition service"
    except Exception as e:
        return f"Error: {str(e)}"