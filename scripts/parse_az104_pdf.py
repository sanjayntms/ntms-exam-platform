import pypdf
import re
import json
import os

def parse_az104():
    pdf_path = 'pdf/az-104.pdf'
    out_json = 'backend/prisma/az104_questions.json'
    
    print("Parsing az-104.pdf...")
    reader = pypdf.PdfReader(pdf_path)
    
    pages_text = []
    for p in reader.pages:
        txt = p.extract_text() or ''
        # Clean headers
        txt = re.sub(r'AZ-104\s+Actaul\s+Exam\s+Q&A.*', '', txt, flags=re.IGNORECASE)
        pages_text.append(txt)
        
    full_text = '\n'.join(pages_text)
    
    # Regex split on Question: N
    parts = re.split(r'(?i)Question:\s*(\d+)', full_text)
    
    questions = []
    
    for i in range(1, len(parts), 2):
        q_num = parts[i].strip()
        q_body = parts[i+1].strip()
        
        # Check Answer: X
        ans_match = re.search(r'(?i)Answer:\s*([A-E,\s]+)', q_body)
        ans_str = ans_match.group(1).strip().upper().replace(' ', '').replace(',', '') if ans_match else 'A'
        
        # Split body into main vs Explanation
        exp_match = re.search(r'(?i)Explanation:\s*(.*)', q_body, re.DOTALL)
        if exp_match:
            exp_text = exp_match.group(1).strip()
            exp_text = re.sub(r'(?i)Reference:.*', '', exp_text).strip()
            main_part = q_body[:ans_match.start()].strip() if ans_match else q_body[:exp_match.start()].strip()
        else:
            exp_text = "Refer to official Microsoft Azure documentation."
            main_part = q_body[:ans_match.start()].strip() if ans_match else q_body
            
        # Extract Options A. B. C. D. E.
        opt_matches = list(re.finditer(r'(?m)^([A-E])\.\s+(.*)', main_part))
        
        if not opt_matches:
            # Try inline search A. ... B. ...
            opt_matches = list(re.finditer(r'([A-E])\.\s+([^\n]+)', main_part))
            
        if opt_matches and len(opt_matches) >= 2:
            prompt_end = opt_matches[0].start()
            prompt = main_part[:prompt_end].strip()
            prompt = re.sub(r'^\s*Note:.*?\n', '', prompt, flags=re.DOTALL)
            prompt = ' '.join(prompt.split())
            
            options = []
            for idx, m in enumerate(opt_matches):
                letter = m.group(1).upper()
                if idx < len(opt_matches) - 1:
                    raw_opt = main_part[m.start():opt_matches[idx+1].start()].strip()
                else:
                    raw_opt = main_part[m.start():].strip()
                    
                opt_text = re.sub(r'^[A-E]\.\s*', '', raw_opt).strip()
                opt_text = ' '.join(opt_text.split())
                
                is_correct = letter in ans_str
                options.append({
                    'id': f'opt_{letter}',
                    'text': opt_text,
                    'isCorrect': is_correct
                })
                
            has_corr = any(o['isCorrect'] for o in options)
            if not has_corr and options:
                options[0]['isCorrect'] = True
                
            if len(prompt) >= 10:
                questions.append({
                    'num': int(q_num),
                    'prompt': prompt,
                    'options': options,
                    'explanation': exp_text[:400]
                })

    # Deduplicate questions by prompt
    questions.sort(key=lambda x: x['num'])
    unique = []
    seen = set()
    for q in questions:
        key = q['prompt'].lower()[:60]
        if key not in seen:
            seen.add(key)
            unique.append(q)
            
    print(f"Extracted {len(unique)} valid AZ-104 questions.")
    
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(unique, f, indent=2, ensure_ascii=False)
        
    print(f"Written to {out_json}")

if __name__ == '__main__':
    parse_az104()
