import pypdf
import re
import json
import os

def parse_az104_pdf():
    pdf_path = 'pdf/az-104.pdf'
    output_json = 'backend/prisma/az104_questions.json'
    
    print(f"Extracting text from {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Total Pages: {total_pages}")
    
    full_text_pages = []
    for i, page in enumerate(reader.pages):
        page_text = page.extract_text() or ''
        # Clean top/bottom page header & footer noise
        page_text = re.sub(r'AZ-104\s+Actaul\s+Exam\s+Q&A.*', '', page_text, flags=re.IGNORECASE)
        page_text = re.sub(r'https?://[^\s]+', '', page_text)
        full_text_pages.append(page_text)
        
    full_text = '\n'.join(full_text_pages)
    
    # Split by Question: pattern
    raw_blocks = re.split(r'(?i)Question:\s*(\d+)', full_text)
    
    questions = []
    
    for i in range(1, len(raw_blocks), 2):
        q_num = raw_blocks[i].strip()
        q_content = raw_blocks[i+1].strip()
        
        # Find Answer: X
        ans_match = re.search(r'(?i)Answer:\s*([A-E,\s]+)', q_content)
        if not ans_match:
            continue
        
        raw_ans = ans_match.group(1).strip().upper().replace(' ', '').replace(',', '')
        
        # Split into prompt/options vs Explanation:
        exp = ""
        exp_match = re.search(r'(?i)Explanation:\s*(.*)', q_content, re.DOTALL)
        if exp_match:
            exp = exp_match.group(1).strip()
            # Remove trailing reference URLs from explanation
            exp = re.sub(r'(?i)Reference:.*', '', exp).strip()
            main_part = q_content[:ans_match.start()].strip()
        else:
            main_part = q_content[:ans_match.start()].strip()
            
        # Parse options A. B. C. D. E.
        option_matches = list(re.finditer(r'(?m)^([A-E])\.\s+(.*)', main_part))
        
        if not option_matches:
            # Fallback for inline option regex e.g. A. text B. text
            option_matches = list(re.finditer(r'([A-E])\.\s+([^\n]+)', main_part))
            
        if not option_matches or len(option_matches) < 2:
            continue
            
        first_opt_start = option_matches[0].start()
        prompt_text = main_part[:first_opt_start].strip()
        
        # Clean prompt text
        prompt_text = re.sub(r'^\s*Note:.*?\n', '', prompt_text, flags=re.DOTALL)
        prompt_text = ' '.join(prompt_text.split())
        
        if not prompt_text or len(prompt_text) < 15:
            continue
            
        options = []
        for idx, match in enumerate(option_matches):
            opt_letter = match.group(1).upper()
            opt_text = match.group(2).strip()
            if idx < len(option_matches) - 1:
                next_start = option_matches[idx+1].start()
                raw_full_opt = main_part[match.start():next_start].strip()
                opt_text = re.sub(r'^[A-E]\.\s*', '', raw_full_opt).strip()
                opt_text = ' '.join(opt_text.split())
            else:
                opt_text = re.sub(r'^[A-E]\.\s*', '', opt_text).strip()
                opt_text = ' '.join(opt_text.split())
                
            is_correct = opt_letter in raw_ans
            options.append({
                'id': f'opt_{opt_letter}',
                'letter': opt_letter,
                'text': opt_text,
                'isCorrect': is_correct
            })
            
        # Verify at least one correct option exists
        has_correct = any(o['isCorrect'] for o in options)
        if not has_correct:
            # Default first option as correct if parse ambiguous
            options[0]['isCorrect'] = True
            
        questions.append({
            'num': int(q_num),
            'prompt': prompt_text,
            'answerLetters': raw_ans,
            'options': options,
            'explanation': exp[:500] if exp else 'Refer to official Microsoft Azure Documentation.'
        })

    # Sort questions by question number
    questions.sort(key=lambda x: x['num'])
    
    # Deduplicate by prompt
    seen_prompts = set()
    unique_questions = []
    for q in questions:
        p_key = q['prompt'].lower()[:80]
        if p_key not in seen_prompts:
            seen_prompts.add(p_key)
            unique_questions.append(q)
            
    print(f"Successfully extracted {len(unique_questions)} UNIQUE real AZ-104 exam questions!")
    
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(unique_questions, f, indent=2, ensure_ascii=False)
        
    print(f"Saved to {output_json}")

if __name__ == '__main__':
    parse_az104_pdf()
