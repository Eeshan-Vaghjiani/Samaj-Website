import json
import re

input_file = "gujtati.txt"
output_file = "events-gu.json"

events = []
current_event = None

def extract_date(text):
    # Try to extract a date in the format dd-mm-yyyy or similar (Gujarati or English digits)
    match = re.search(r'([૦-૯0-9]{1,2}[- /.][૦-૯0-9]{1,2}[- /.][૦-૯0-9]{2,4})', text)
    if match:
        return match.group(1)
    return ""

with open(input_file, encoding="utf-8") as f:
    lines = [line.rstrip() for line in f if line.strip()]

for line in lines:
    if line.startswith("- "):
        # New event
        if current_event:
            events.append(current_event)
        desc = line[2:].strip()
        date = extract_date(desc)
        current_event = {
            "eventDescription": desc,
            "eventDate": date,
            "eventTime": "",
            "eventImage": "",
            "eventItems": []
        }
    elif line.startswith("-"):
        # Sometimes there is no space after dash, treat as new event
        if current_event:
            events.append(current_event)
        desc = line[1:].strip()
        date = extract_date(desc)
        current_event = {
            "eventDescription": desc,
            "eventDate": date,
            "eventTime": "",
            "eventImage": "",
            "eventItems": []
        }
    elif line.startswith("  - ") or (line.startswith("    - ")):
        # Sub-item (if any, e.g. inauguration details)
        item_text = line.lstrip("-").strip()
        if item_text:
            current_event["eventItems"].append({"item": item_text})
    elif current_event and line:
        # Continuation of previous event or sub-item
        if current_event["eventItems"]:
            # Add to last sub-item
            current_event["eventItems"][-1]["item"] += " " + line.strip()
        else:
            current_event["eventDescription"] += " " + line.strip()

# Add the last event
if current_event:
    events.append(current_event)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

print(f"Converted {len(events)} events to {output_file}")
