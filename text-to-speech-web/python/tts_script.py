import os
import uuid
from gtts import gTTS

def text_to_speech(text, language='en'):
    """
    Convert text to speech and save as an audio file
    
    Args:
        text (str): Text to convert to speech
        language (str): Language code ('en' for English, 'hu' for Hungarian)
        
    Returns:
        str: Filename of the generated audio file
    """
    if not text:
        return None
    
    # Generate a unique filename
    filename = f"speech_{uuid.uuid4().hex}.wav"
    
    # Create audio directory if it doesn't exist
    os.makedirs(os.path.join("static", "audio"), exist_ok=True)
    filepath = os.path.join("static", "audio", filename)
    
    # Generate speech
    tts = gTTS(text=text, lang=language, slow=False)
    tts.save(filepath)
    
    return filename

if __name__ == "__main__":
    sample_text = "Hello, this is a text-to-speech conversion example."
    generated_file = text_to_speech(sample_text)
    print(f"Generated audio file: {generated_file}")