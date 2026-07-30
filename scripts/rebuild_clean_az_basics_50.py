import json
import re

with open("scripts/new_exact_pptx_50.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def clean_deep(text: str) -> str:
    if not text:
        return ""
    # Remove Slide references
    text = re.sub(r'PPTX Slides?\s*\d+(-|\d+)*:?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'as highlighted in Slides?\s*\d+(-|\d+)*\??', '', text, flags=re.IGNORECASE)
    text = re.sub(r'According to Slides?\s*\d+(-|\d+)*,?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'As stated in Slides?\s*\d+(-|\d+)*,?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'In the Slide \d+ city analogy', 'In the city map analogy', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ compares', 'Azure architecture compares', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ states:?', 'Azure fundamentals state:', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ emphasizes that', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ illustrates that', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ summarizes:?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ provides a one-line summary:?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ defines', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ highlights', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ specifies', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ describes', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ explains', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ notes', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ presents', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ concludes:?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+ uses what analogy', 'What analogy is used in Azure architecture', text, flags=re.IGNORECASE)
    text = re.sub(r'Slide \d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slides \d+-\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Slides \d+ and \d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'in Slide \d+(-|\d+)*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\(Slide \d+(-|\d+)*\)', '', text, flags=re.IGNORECASE)
    text = re.sub(r'based on the Slide \d+ [^,]+,?\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Match the simple summary terms :?\s*', '', text, flags=re.IGNORECASE)

    text = re.sub(r'given in for', 'given for', text, flags=re.IGNORECASE)
    text = re.sub(r'given in\b', 'given', text, flags=re.IGNORECASE)
    # Clean punctuation and spacing
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.replace(" ?", "?").replace(" .", ".").replace(" ,", ",").replace("  ", " ")
    if text and text[0].islower():
        text = text[0].upper() + text[1:]
    return text

for domain_key in ["d1", "d2", "d3", "d4"]:
    for q in data[domain_key]:
        q["title"] = clean_deep(q["title"])
        q["explanation"] = clean_deep(q["explanation"])
        if "content" in q:
            if "prompt" in q["content"]:
                q["content"]["prompt"] = clean_deep(q["content"]["prompt"])
            if "explanation" in q["content"]:
                q["content"]["explanation"] = clean_deep(q["content"]["explanation"])

with open("scripts/new_exact_pptx_50.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Deep cleaning finished successfully!")
