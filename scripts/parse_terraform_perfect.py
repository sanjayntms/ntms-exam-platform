import pdfplumber
import re
import glob
import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def clean_text(text):
    if not text:
        return ''
    # Remove combining diacritics / strikethrough artifacts
    text = re.sub(r'[\u0300-\u036f]', '', text)
    # Fix common OCR artifacts
    text = text.replace('Te rafo m', 'Terraform').replace('te rafo m', 'terraform')
    text = text.replace('infrast ucture', 'infrastructure')
    text = text.replace('  ', ' ')
    return text.strip()

domain_files = [
    ('D-1', 'pdf/Terraform/Question_2026_07_29__06_39_QZ_NTMS Terraform D-1.pdf', 'Domain 1: Understand Infrastructure as Code (IaC) Concepts', 'TERRAFORM-D1'),
    ('D-2', 'pdf/Terraform/Question_2026_07_29__06_41_QZ_NTMS Terraform D-2.pdf', 'Domain 2: Understand Terraform Purpose & Provider Plugins', 'TERRAFORM-D2'),
    ('D-3', 'pdf/Terraform/Question_2026_07_14__20_36_QZ_NTMS Terraform D-3.pdf', 'Domain 3: Interact with Terraform CLI & Core Workflow', 'TERRAFORM-D3'),
    ('D-4', 'pdf/Terraform/Question_2026_07_15__21_05_QZ_NTMS Terraform D4.pdf', 'Domain 4: Interact with Terraform Modules & Dependencies', 'TERRAFORM-D4'),
    ('D-5', 'pdf/Terraform/Question_2026_07_21__03_01_QZ_NTMS Terraform D5.pdf', 'Domain 5: Manage Terraform State & Backends', 'TERRAFORM-D5'),
    ('D-6', 'pdf/Terraform/Question_2026_07_14__20_00_QZ_NTMS Terraform D-6.pdf', 'Domain 6: Understand Terraform Cloud & Enterprise Features', 'TERRAFORM-D6'),
    ('D-7', 'pdf/Terraform/Question_2026_07_14__20_05_QZ_NTMS Terraform D-7.pdf', 'Domain 7: Perform Advanced Terraform Operations & Import', 'TERRAFORM-D7'),
]

all_domains = []

for domain_code, pdf_path, domain_title, exam_code in domain_files:
    print(f'Processing {domain_code} ({exam_code}): {pdf_path}...')
    with pdfplumber.open(pdf_path) as pdf:
        questions = []
        current_q = None
        current_opt = None

        for page in pdf.pages:
            lines = page.extract_text_lines()
            for l in lines:
                raw_text = clean_text(l['text'])
                if not raw_text:
                    continue

                # Check character colors in line to detect green (0.36, 0.74, 0.43) vs red (0.94, 0.5, 0.5)
                has_green = False
                has_red = False
                for char in l['chars']:
                    c = char.get('non_stroking_color')
                    if isinstance(c, (tuple, list)) and len(c) >= 3:
                        r, g, b = c[0], c[1], c[2]
                        if 0.30 <= r <= 0.42 and 0.65 <= g <= 0.80 and 0.38 <= b <= 0.50:
                            has_green = True
                        elif 0.85 <= r <= 1.0 and 0.40 <= g <= 0.60 and 0.40 <= b <= 0.60:
                            has_red = True

                # Check for Question Header e.g. "1. What are some advantages..."
                q_match = re.match(r'^(\d+)\.\s+(.*)$', raw_text)
                if q_match:
                    q_num = int(q_match.group(1))
                    q_text = q_match.group(2).strip()

                    if current_q:
                        questions.append(current_q)

                    current_q = {
                        'number': q_num,
                        'code': f'{exam_code}-Q{q_num:03d}',
                        'prompt': q_text,
                        'options': [],
                    }
                    current_opt = None
                    continue

                # Check for Option Header e.g. "0/0 A text..." or "A text..." or "0/0 A..."
                opt_match = re.match(r'^(?:0\/0\s+)?([A-G])\b(?:\.\s*|\s+)(.*)$', raw_text)
                if current_q and opt_match:
                    opt_key = opt_match.group(1)
                    opt_text = opt_match.group(2).strip()

                    current_opt = {
                        'key': opt_key,
                        'text': opt_text,
                        'isCorrect': has_green,
                    }
                    current_q['options'].append(current_opt)
                    continue

                # Continuation text lines
                if current_q:
                    if current_opt:
                        current_opt['text'] += ' ' + raw_text
                        if has_green:
                            current_opt['isCorrect'] = True
                    else:
                        current_q['prompt'] += '\n' + raw_text

        if current_q:
            questions.append(current_q)

    # Post-process questions to determine question type (SINGLE_CHOICE vs MULTIPLE_CHOICE)
    for q in questions:
        correct_count = sum(1 for o in q['options'] if o['isCorrect'])
        q['type'] = 'MULTIPLE_CHOICE' if correct_count > 1 else 'SINGLE_CHOICE'
        # Clean double spaces in options & prompt
        q['prompt'] = re.sub(r'\s+', ' ', q['prompt']).strip()
        for o in q['options']:
            o['text'] = re.sub(r'\s+', ' ', o['text']).strip()

    print(f'-> Successfully extracted {len(questions)} questions for {exam_code}')
    all_domains.append({
        'domain_code': domain_code,
        'exam_code': exam_code,
        'domain_title': domain_title,
        'questions': questions,
    })

with open('backend/prisma/terraform_parsed_all.json', 'w', encoding='utf-8') as f:
    json.dump(all_domains, f, indent=2, ensure_ascii=False)

print('=== ALL 7 TERRAFORM DOMAIN PDFS PARSED & SAVED TO terraform_parsed_all.json ===')
