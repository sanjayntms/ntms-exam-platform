import json, re

# Read cs1 and cs2 questions
with open("scripts/cs1_data.json", "r", encoding="utf-8") as f:
    cs1 = json.load(f)["questions"]

with open("scripts/cs2_data.json", "r", encoding="utf-8") as f:
    cs2 = json.load(f)["questions"]

cs_questions = cs1 + cs2

print(f"Total Case Study Questions: {len(cs_questions)}")
print("\n--- CS Prompts ---")
for i, q in enumerate(cs_questions, 51):
    print(f"Q{i} ({q['code']}): {q['prompt'][:100]}...")
