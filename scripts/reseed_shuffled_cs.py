import json
import random

# Fixed seed for consistent, reproducible shuffling
random.seed(42)

def shuffle_case_study(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data['questions']
    single_choice_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    
    for q in questions:
        q_type = q.get('type')
        if 'options' in q and q['options']:
            options = q['options']
            # Shuffle the options list
            random.shuffle(options)
            q['options'] = options
            
            # Count correct answers for single choice
            if q_type == 'SINGLE_CHOICE':
                for idx, opt in enumerate(options):
                    if opt.get('isCorrect'):
                        pos = chr(65 + idx) # 0->A, 1->B, 2->C, 3->D
                        single_choice_counts[pos] += 1

        if 'items' in q and q['items'] and 'targets' in q and q['targets']:
            # Also shuffle drag and drop items
            random.shuffle(q['items'])
            random.shuffle(q['targets'])

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    return single_choice_counts

cs1_counts = shuffle_case_study('scripts/cs1_data.json')
cs2_counts = shuffle_case_study('scripts/cs2_data.json')

print("CS1 Single Choice Correct Answer Distribution:", cs1_counts)
print("CS2 Single Choice Correct Answer Distribution:", cs2_counts)
