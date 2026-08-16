import base64
import json

def get_b64(path):
    with open(path, 'rb') as f:
        return 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

hugo_b64 = get_b64('src/assets/hugo.png')
hector_b64 = get_b64('src/assets/hector.png')
cristian_b64 = get_b64('src/assets/cristian.png')

# Update players.json with base64 data URIs
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

# Update teamData.js for player ID 5, 7, 10
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

# Bump PLAYERS_STORAGE_KEY to force fresh localStorage loading
code = code.replace('fc_hub_players_clean_v15', 'fc_hub_players_final_v20')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Embedded base64 strings for Hugo, Hector, and Cristian successfully!')
