import json

with open("scripts/new_exact_pptx_50.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for domain in ["d1", "d2", "d3", "d4"]:
    for q in data[domain]:
        print(f"[{q['code']}] {q['title']}")
        print(f"   Prompt: {q['content']['prompt']}")
        print(f"   Expl: {q['explanation'][:100]}...\n")
