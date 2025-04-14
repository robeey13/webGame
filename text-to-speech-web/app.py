from flask import Flask, request, render_template, jsonify
from python.tts_script import text_to_speech
from python.stt_script import recognize_speech_from_audio
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/speak', methods=['POST'])
def speak():
    text = request.form['text']
    language = request.form.get('language', 'en')  # Default to English if not specified
    audio_file = text_to_speech(text, language)
    return audio_file

@app.route('/recognize', methods=['POST'])
def recognize():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
        
    audio_file = request.files['audio']
    language = request.form.get('language', 'en')
    
    if audio_file.filename == '':
        return jsonify({"error": "No audio file selected"}), 400
        
    # Process the audio file
    recognized_text = recognize_speech_from_audio(audio_file, language)
    
    return jsonify({"text": recognized_text})

# Create audio directory when the app starts
os.makedirs(os.path.join("static", "audio"), exist_ok=True)

if __name__ == '__main__':
    app.run(debug=True)