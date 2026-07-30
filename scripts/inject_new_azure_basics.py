import json

with open("scripts/new_azure_basics_50.json", "r", encoding="utf-8") as f:
    data = json.load(f)

d1_str = json.dumps(data["d1"], indent=2)
d2_str = json.dumps(data["d2"], indent=2)
d3_str = json.dumps(data["d3"], indent=2)
d4_str = json.dumps(data["d4"], indent=2)

with open("backend/prisma/seed.ts", "r", encoding="utf-8") as f:
    seed_content = f.read()

# Replace azureBasicsD1, azureBasicsD2, azureBasicsD3, azureBasicsD4
m1 = "// AZURE BASICS - 50 QUESTIONS (PPTX DERIVED & AUDITED)"
m2 = "const azureBasicsD1 = "
m3 = "const azureBasicsD2 = "
m4 = "const azureBasicsD3 = "
m5 = "const azureBasicsD4 = "
m6 = "// CASE STUDY 1 & CASE STUDY 2 FOR AZURE BASICS"

idx1 = seed_content.find(m1)
idx6 = seed_content.find(m6)

if idx1 != -1 and idx6 != -1:
    new_block = f"""// AZURE BASICS - 50 QUESTIONS (PPTX DERIVED & AUDITED - 100% UNIQUE NON-OVERLAPPING)
  const azureBasicsD1 = {d1_str};
  const azureBasicsD2 = {d2_str};
  const azureBasicsD3 = {d3_str};
  const azureBasicsD4 = {d4_str};

  """
    seed_content = seed_content[:idx1] + new_block + seed_content[idx6:]

    with open("backend/prisma/seed.ts", "w", encoding="utf-8") as f:
        f.write(seed_content)
    print("Successfully injected 50 unique non-overlapping questions into seed.ts!")
else:
    print("Error: Could not find markers in seed.ts!")
