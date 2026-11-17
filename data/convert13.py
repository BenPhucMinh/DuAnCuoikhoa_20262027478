import pandas as pd
import json
import pandas as pd
import json

# List ALL your sheet names here — change these to match yours
sheets = [
    "nha_san_xuat",
    "nha_cung_cap",
    "nhom_atc",
    "Main",
    "MAIN_DATA",
]

# Convert every sheet automatically
for sheet_name in sheets:
    df = pd.read_excel("your_file.xlsx", sheet_name=sheet_name)
    
    with open(f"{sheet_name}.json", "w", encoding="utf-8") as f:
        json.dump(df.to_dict("records"), f, ensure_ascii=False, indent=2)
    
    print(f"✅ {sheet_name}.json created!")

print("\n🎉 ALL 4 DONE in ONE run!")

# Convert one sheet at a time
sheet_name = "nha_san_xuat"  # change for each sheet
df = pd.read_excel("your_file.xlsx", sheet_name=sheet_name)

# Save as JSON — keeps Vietnamese characters!
with open(f"{sheet_name}.json", "w", encoding="utf-8") as f:
    json.dump(df.to_dict("records"), f, ensure_ascii=False, indent=2)

print(f"✅ {sheet_name}.json created!")
