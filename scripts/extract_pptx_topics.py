with open("scripts/azure_basics_slides.txt", "r", encoding="utf-8") as f:
    text = f.read()

slides = text.split("=== SLIDE ")

with open("scripts/slide_titles.txt", "w", encoding="utf-8") as out:
    out.write(f"Total slides found: {len(slides)-1}\n\n")
    for s in slides[1:]:
        lines = [l.strip() for l in s.split("\n") if l.strip()]
        if lines:
            slide_num = lines[0].split(" ===")[0]
            title = lines[1] if len(lines) > 1 else "No title"
            out.write(f"Slide {slide_num}: {title}\n")
            for line in lines[2:]:
                if "Summary" in line or "One-Line" in line or "Takeaway" in line or "Think of it" in line:
                    out.write(f"  -> {line}\n")

print("Wrote slide titles to scripts/slide_titles.txt")
