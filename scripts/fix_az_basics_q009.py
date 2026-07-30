import json
import random

random.seed(99)

with open('scripts/azure_basics_50_questions_shuffled.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    if q['code'] == 'AZ-BASICS-Q009':
        q['type'] = 'MULTIPLE_CHOICE'
        q['prompt'] = 'An Azure Subscription acts as a fundamental logical boundary for which two key functions? (Select TWO)'
        opts = [
            {'id': 'opt-1', 'text': 'Billing Boundary: Used to segregate costs, group consumption metrics, and generate separate invoices.', 'isCorrect': True},
            {'id': 'opt-2', 'text': 'Access Control & Security Boundary: Used as an administrative scope for applying RBAC role assignments and access policies.', 'isCorrect': True},
            {'id': 'opt-3', 'text': 'Physical Hardware Allocation Boundary: Used to assign CPU cores directly to server racks.', 'isCorrect': False},
            {'id': 'opt-4', 'text': 'Web Browser Session Boundary: Used to store user login cookies inside client web browsers.', 'isCorrect': False}
        ]
        random.shuffle(opts)
        for idx, o in enumerate(opts, 1):
            o['id'] = f'opt-{idx}'
        q['options'] = opts
        q['explanation'] = 'An Azure Subscription acts as both a Billing Boundary (grouping usage costs) and an Access Control / Security Boundary (applying RBAC and policies).'

with open('scripts/azure_basics_50_questions_shuffled.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2)

print('Successfully fixed AZ-BASICS-Q009 to MULTIPLE_CHOICE with (Select TWO)!')
