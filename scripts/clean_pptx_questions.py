import json
import re

with open("scripts/new_exact_pptx_50.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def clean_text(text: str) -> str:
    if not text:
        return text
    # Remove "PPTX Slide X: ", "PPTX Slides X-Y: ", "Slide X", "Slides X-Y", etc.
    text = re.sub(r'PPTX Slides? \d+(-|\d+)*:?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'as highlighted in Slides? \d+(-|\d+)*\??', '', text, flags=re.IGNORECASE)
    text = re.sub(r'According to Slides? \d+(-|\d+)*,?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'As stated in Slides? \d+(-|\d+)*,?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ compares', 'Azure architecture compares', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ states:?', 'Azure fundamentals state:', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ uses what analogy', 'What analogy is used in Azure architecture', text, flags=re.IGNORECASE)
    text = re.sub(r'in Slide \d+(-|\d+)*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(Slide \d+(-|\d+)*\)', '', text, flags=re.IGNORECASE)
    text = re.sub(r'based on the Slide \d+ [^,]+,?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Match the simple summary terms in Slide \d+:?\s*', '', text, flags=re.IGNORECASE)
    
    # Clean up double spaces and trailing punctuation
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.replace(" ?", "?").replace(" .", ".")
    return text

for domain_key in ["d1", "d2", "d3", "d4"]:
    for q in data[domain_key]:
        q["title"] = clean_text(q["title"])
        q["explanation"] = clean_text(q["explanation"])
        if "content" in q:
            if "prompt" in q["content"]:
                q["content"]["prompt"] = clean_text(q["content"]["prompt"])
            if "explanation" in q["content"]:
                q["content"]["explanation"] = clean_text(q["content"]["explanation"])

with open("scripts/new_exact_pptx_50.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Successfully cleaned all slide references from all 50 questions!")
