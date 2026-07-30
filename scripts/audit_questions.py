import json
import re

with open('scripts/azure_basics_50_questions_shuffled.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print('=== THOROUGH AUDIT OF AZURE BASICS 50 QUESTIONS ===')

issues = []

for idx, q in enumerate(questions, 1):
    code = q['code']
    q_type = q['type']
    prompt = q['prompt']
    opts = q.get('options', [])
    corrects = [o for o in opts if o.get('isCorrect')]

    # Check for contradictions
    if q_type == 'SINGLE_CHOICE':
        if len(corrects) != 1:
            issues.append(f"Q{idx} ({code}) [{q_type}]: Single choice has {len(corrects)} correct answers!")
        if re.search(r'\b(select two|select 2|two key|which two|select 3|three)\b', prompt, re.IGNORECASE):
            issues.append(f"Q{idx} ({code}) [{q_type}]: Single choice prompt asks for multiple items: \"{prompt}\"")

    elif q_type == 'MULTIPLE_CHOICE':
        if len(corrects) < 2:
            issues.append(f"Q{idx} ({code}) [{q_type}]: Multiple choice has only {len(corrects)} correct answer!")
        if not re.search(r'\(Select TWO\)|\(Select THREE\)', prompt, re.IGNORECASE):
            issues.append(f"Q{idx} ({code}) [{q_type}]: Multiple choice missing (Select TWO/THREE) label: \"{prompt}\"")

print(f"\n--- AUDIT SUMMARY: Found {len(issues)} Issue(s) ---")
for issue in issues:
    print("  ! " + issue)
