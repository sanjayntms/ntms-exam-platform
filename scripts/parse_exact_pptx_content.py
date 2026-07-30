with open("scripts/azure_basics_slides.txt", "r", encoding="utf-8") as f:
    text = f.read()

slides = text.split("=== SLIDE ")

with open("scripts/pptx_full_transcript.txt", "w", encoding="utf-8") as out:
    for idx, s in enumerate(slides[1:], 1):
        out.write(f"\n========================================\nSLIDE {idx}\n========================================\n")
        out.write(s)

print("Wrote full transcript to scripts/pptx_full_transcript.txt")
