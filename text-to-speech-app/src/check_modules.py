import sys
import os

# Print Python's module search paths
print("Python module search paths:")
for path in sys.path:
    print(f"- {path}")

# Check for speech_recognition.py in the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"\nChecking current directory: {current_dir}")
for file in os.listdir(current_dir):
    if file.startswith("speech_recognition"):
        print(f"Found potential conflict: {file}")

# Try to import the module and see what we get
try:
    import custom_speech_recognition
    print(f"\nSuccessfully imported speech_recognition from: {custom_speech_recognition.__file__}")
    print(f"Module contents: {dir(custom_speech_recognition)[:10]}...")
except Exception as e:
    print(f"\nError importing speech_recognition: {e}")
