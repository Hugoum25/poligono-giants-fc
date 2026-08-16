import json

# Update players.json to use relative PNG asset paths
with open('src/data/players.json', 'r', encoding='utf-8') as f:
    players = json.load(f)

for p in players:
    if p['id'] == 5:
        p['photo'] = './src/assets/hugo.png'
    elif p['id'] == 7:
        p['photo'] = './src/assets/hector.png'
    elif p['id'] == 10:
        p['photo'] = './src/assets/cristian.png'

with open('src/data/players.json', 'w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=2)

# Update teamData.js
with open('src/data/teamData.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace photo paths for ID 5, 7, 10 in teamData.js with relative PNG paths
for p_id, rel_path in [(5, './src/assets/hugo.png'), (7, './src/assets/hector.png'), (10, './src/assets/cristian.png')]:
    start_str = f'id: {p_id},'
    idx = code.find(start_str)
    if idx != -1:
        photo_idx = code.find('photo:', idx)
        q1 = code.find('"', photo_idx)
        q2 = code.find('"', q1 + 1)
        code = code[:q1+1] + rel_path + code[q2:]

code = code.replace('fc_hub_players_v11', 'fc_hub_players_clean_v15')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated players.json and teamData.js to clean relative asset paths!')
