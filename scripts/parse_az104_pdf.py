import pypdf
import re
import json
import os

def parse_az104():
    pdf_path = 'pdf/az-104.pdf'
    out_json = 'backend/prisma/az104_questions.json'
    
    print("Parsing az-104.pdf with High-Precision Prompt Isolation...")
    reader = pypdf.PdfReader(pdf_path)
    
    parsed_qs = []

    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ''
        # Clean header noise
        text = re.sub(r'AZ-104\s+Actaul\s+Exam\s+Q&A.*', '', text, flags=re.IGNORECASE)
        
        q_splits = re.split(r'(?i)Question:\s*(\d+)', text)
        
        for k in range(1, len(q_splits), 2):
            q_num = q_splits[k].strip()
            q_body = q_splits[k+1].strip()
            
            ans_match = re.search(r'(?i)Answer:\s*([A-E,\s]+)', q_body)
            if not ans_match:
                continue
                
            ans_letter = ans_match.group(1).strip().upper().replace(' ', '').replace(',', '')
            main_part = q_body[:ans_match.start()].strip()
            
            exp_match = re.search(r'(?i)Explanation:\s*(.*)', q_body, re.DOTALL)
            exp = exp_match.group(1).strip() if exp_match else ''
            exp = re.sub(r'(?i)Reference:.*', '', exp).strip()
            
            opt_matches = list(re.finditer(r'(?m)^([A-E])\.\s+(.*)', main_part))
            if not opt_matches:
                opt_matches = list(re.finditer(r'([A-E])\.\s+([^\n]+)', main_part))
                
            if not opt_matches or len(opt_matches) < 2:
                continue
                
            raw_prompt = main_part[:opt_matches[0].start()].strip()
            lines = [l.strip() for l in raw_prompt.split('\n') if l.strip()]
            
            # Find the line where the actual scenario starts
            scenario_line_idx = 0
            for l_idx, line in enumerate(lines):
                if re.match(r'^(Your company|You have|You need|You are|A company|An organization|You create|You plan|You deploy|Note:)', line, re.I):
                    scenario_line_idx = l_idx
                    break
                    
            clean_lines = lines[scenario_line_idx:]
            clean_prompt = ' '.join(clean_lines)
            clean_prompt = re.sub(r'(?i)^\s*Note:.*?\.\s*', '', clean_prompt).strip()
            clean_prompt = ' '.join(clean_prompt.split())
            
            options = []
            for o_idx, m in enumerate(opt_matches):
                letter = m.group(1).upper()
                if o_idx < len(opt_matches) - 1:
                    opt_str = main_part[m.start():opt_matches[o_idx+1].start()].strip()
                else:
                    opt_str = main_part[m.start():].strip()
                opt_text = re.sub(r'^[A-E]\.\s*', '', opt_str).strip()
                opt_text = ' '.join(opt_text.split())
                
                options.append({
                    'id': f'opt_{letter}',
                    'letter': letter,
                    'text': opt_text,
                    'isCorrect': letter in ans_letter
                })
                
            if not any(o['isCorrect'] for o in options) and options:
                options[0]['isCorrect'] = True
                
            if len(clean_prompt) >= 15:
                parsed_qs.append({
                    'num': int(q_num),
                    'prompt': clean_prompt,
                    'options': options,
                    'explanation': exp[:400]
                })

    # Sort & Deduplicate
    parsed_qs.sort(key=lambda x: x['num'])
    unique = []
    seen = set()
    for q in parsed_qs:
        key = q['prompt'].lower()[:60]
        if key not in seen:
            seen.add(key)
            unique.append(q)
            
    print(f"Extracted {len(unique)} clean, perfectly separated AZ-104 questions.")
    
    os.makedirs(os.path.dirname(out_json), exist_ok=True)
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(unique, f, indent=2, ensure_ascii=False)
        
    print(f"Written to {out_json}")

if __name__ == '__main__':
    parse_az104()
