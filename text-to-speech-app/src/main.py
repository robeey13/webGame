# Contents of /text-to-speech-app/text-to-speech-app/src/main.py

import sys
import os
from text_to_speech import convert_text_to_speech
from custom_speech_recognition import recognize_speech_from_audio

def main():
    while True:
        print("\nWelcome to the Text-to-Speech Application!")
        
        # Language selection
        print("Select language:")
        print("1. English")
        print("2. Hungarian")
        lang_choice = input("Enter 1 or 2: ")
        
        if lang_choice == '1':
            tts_lang = 'en'
            stt_lang = 'en-US'
        else:
            tts_lang = 'hu'
            stt_lang = 'hu-HU'
        
        print("\nSelect an operation:")
        print("1. Convert text to speech")
        print("2. Recognize speech from audio")
        print("3. Exit application")
        choice = input("Enter your choice (1, 2, or 3): ")

        if choice == '1':
            text = input("Please enter the text you want to convert to speech: ")
            filename = input("Please enter the filename to save the audio (without extension): ") + '.wav'
            convert_text_to_speech(text, filename, language=tts_lang)
            print(f"Audio saved as {filename}")
            
            # Ask if user wants to perform another operation
            continue_choice = input("\nWould you like to perform another operation? (y/n): ")
            if continue_choice.lower() != 'y':
                print("Thank you for using the Text-to-Speech Application!")
                break

        elif choice == '2':
            go_back_to_main = False  # Flag to track if we should go back to main menu
            
            while not go_back_to_main:
                filename = input("Please enter the audio filename to recognize speech from (with extension): ")
                if not os.path.isabs(filename):
                    filename = os.path.abspath(filename)
                
                # Check if file exists
                if not os.path.exists(filename):
                    print(f"Error: File '{filename}' does not exist.")
                    retry_choice = input("Would you like to (1) Try again or (2) Go back to main menu? Enter 1 or 2: ")
                    if retry_choice == '2':
                        go_back_to_main = True  # Set flag to go back to main menu
                        break
                    continue  # Try again with a different file
                
                # Process the file if it exists
                print(f"Processing audio file: {filename}")
                recognized_text = recognize_speech_from_audio(filename, language=stt_lang)
                print(f"Recognized text: {recognized_text}")
                
                # Save the recognized text to a .txt file with the same name
                txt_filename = os.path.splitext(filename)[0] + '.txt'
                try:
                    with open(txt_filename, 'w', encoding='utf-8') as txt_file:
                        txt_file.write(recognized_text)
                    print(f"Recognized text saved to {txt_filename}")
                except Exception as e:
                    print(f"Error saving text to file: {str(e)}")
                
                # After successful processing, break the inner loop
                break
            
            # If we're going back to main menu, continue the outer loop
            if go_back_to_main:
                continue
                
            # Ask if user wants to perform another operation
            continue_choice = input("\nWould you like to perform another operation? (y/n): ")
            if continue_choice.lower() != 'y':
                print("Thank you for using the Text-to-Speech Application!")
                break

        elif choice == '3':
            print("Thank you for using the Text-to-Speech Application!")
            break

        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()