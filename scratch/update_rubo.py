import os
import json
import shutil
import base64

rubo_src = 'src/assets/players/12-ruben-montes/rubo.png'
rubo_photo = 'src/assets/players/12-ruben-montes/photo.png'

if os.path.exists(rubo_src):
    shutil.copy(rubo_src, rubo_photo)

with open(rubo_src, 'rb') as f:
    b64_str = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

# Update players.json for Ruben Montes (ID 12)
with open('src/data/players.json', 'r', encoding='utf-8') as f:
    players = json.load(f)

for p in players:
    if p['id'] == 12 or 'rubén' in p['name'].lower() or 'ruben' in p['name'].lower():
        p['photo'] = b64_str

with open('src/data/players.json', 'w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=2)

# Update teamData.js for player ID 12
with open('src/data/teamData.js', 'r', encoding='utf-8') as f:
    code = f.read()

start_str = 'id: 12,'
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

code = code.replace('fc_hub_players_reset_v60', 'fc_hub_players_rubo_v65')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Ruben Montes photo successfully processed and linked in players.json and teamData.js!')
