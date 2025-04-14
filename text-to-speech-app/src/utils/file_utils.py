def save_text_to_file(text: str, filename: str) -> None:
    with open(filename, 'w') as file:
        file.write(text)

def load_text_from_file(filename: str) -> str:
    with open(filename, 'r') as file:
        return file.read()