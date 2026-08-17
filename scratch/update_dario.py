import os
import json
import shutil
import base64

dario_src = 'src/assets/players/11-dario-alvarez/dario.png'
dario_photo = 'src/assets/players/11-dario-alvarez/photo.png'

if os.path.exists(dario_src):
    shutil.copy(dario_src, dario_photo)

with open(dario_src, 'rb') as f:
    b64_str = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

# Update players.json for Dario Alvarez (ID 11)
with open('src/data/players.json', 'r', encoding='utf-8') as f:
    players = json.load(f)

for p in players:
    if p['id'] == 11 or 'dario' in p['name'].lower() or 'darío' in p['name'].lower():
        p['photo'] = b64_str

with open('src/data/players.json', 'w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=2)

# Update teamData.js for player ID 11
with open('src/data/teamData.js', 'r', encoding='utf-8') as f:
    code = f.read()

start_str = 'id: 11,'
idx = code.find(start_str)
if idx != -1:
    photo_idx = code.find('photo:', idx)
    if photo_idx != -1 and photo_idx < idx + 250:
        q1 = code.find('"', photo_idx)
        q2 = code.find('"', q1 + 1)
        code = code[:q1+1] + b64_str + code[q2:]
    else:
        # Insert photo property if not present
        emoji_idx = code.find('emoji:', idx)
        line_end = code.find('\n', emoji_idx)
        code = code[:line_end+1] + f'            photo: "{b64_str}",\n' + code[line_end+1:]

code = code.replace('fc_hub_players_folders_v25', 'fc_hub_players_dario_v30')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Dario photo successfully processed and linked in players.json and teamData.js!')
