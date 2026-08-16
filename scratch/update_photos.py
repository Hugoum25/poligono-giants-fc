import base64
import json

hugo_b64 = 'data:image/png;base64,' + base64.b64encode(open('src/assets/hugo.png', 'rb').read()).decode('utf-8')
hector_b64 = 'data:image/png;base64,' + base64.b64encode(open('src/assets/hector.png', 'rb').read()).decode('utf-8')
cristian_b64 = 'data:image/png;base64,' + base64.b64encode(open('src/assets/cristian.png', 'rb').read()).decode('utf-8')

# Update players.json
with open('src/data/players.json', 'r', encoding='utf-8') as f:
    players = json.load(f)

for p in players:
    if p['id'] == 5:
        p['photo'] = hugo_b64
    elif p['id'] == 7:
        p['photo'] = hector_b64
    elif p['id'] == 10:
        p['photo'] = cristian_b64

with open('src/data/players.json', 'w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=2)

# Update teamData.js
with open('src/data/teamData.js', 'r', encoding='utf-8') as f:
    code = f.read()

for p_id, b64_val in [(5, hugo_b64), (7, hector_b64), (10, cristian_b64)]:
    start_str = f'id: {p_id},'
    idx = code.find(start_str)
    if idx != -1:
        photo_idx = code.find('photo:', idx)
        q1 = code.find('"', photo_idx)
        q2 = code.find('"', q1 + 1)
        code = code[:q1+1] + b64_val + code[q2:]

code = code.replace('fc_hub_players_v10', 'fc_hub_players_v11')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated transparent base64 in players.json and teamData.js successfully!')
