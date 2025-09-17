class SisterPhoneticEngine:
    def __init__(self):
        self.voice = "calm_female"  # or whatever voice she had
        self.words = {
            "release": "RELEASE",
            "root": "ROOT",
            "shift": "SHIFT",
            "connect": "CONNECT",
            "silence": "SILENCE",
            "ascend": "ASCEND",
            "i_am": "I AM"
        }

    def speak(self, word_key: str):
        word = self.words.get(word_key.lower())
        if word:
            # Use TTS engine here (like pyttsx3 or AWS Polly)
            print(f"[SISTER's VOICE] Speaking: {word}")
        else:
            print("[SISTER's VOICE] Word not found.")
