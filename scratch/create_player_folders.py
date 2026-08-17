import os
import json
import shutil
import unicodedata
import re

def slugify(text):
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text.lower()).strip()
    return re.sub(r'[-\s]+', '-', text)

with open('src/data/players.json', 'r', encoding='utf-8') as f:
    players = json.load(f)

base_dir = 'src/assets/players'
os.makedirs(base_dir, exist_ok=True)

photo_map = {
    5: 'src/assets/hugo.png',
    7: 'src/assets/hector.png',
    10: 'src/assets/cristian.png'
}

for p in players:
    p_id = p['id']
    clean_name = slugify(p['name'])
    folder_name = f"{p_id}-{clean_name}"
    player_dir = os.path.join(base_dir, folder_name)
    os.makedirs(player_dir, exist_ok=True)
    
    if p_id in photo_map and os.path.exists(photo_map[p_id]):
        dest_png = os.path.join(player_dir, 'photo.png')
        shutil.copy(photo_map[p_id], dest_png)
        dest_named_png = os.path.join(player_dir, f"{clean_name}.png")
        shutil.copy(photo_map[p_id], dest_named_png)
        p['photo'] = f"./src/assets/players/{folder_name}/photo.png"
        print(f"Copied photo for player {p_id} ({p['name']}) into {player_dir}")
    else:
        gitkeep = os.path.join(player_dir, '.gitkeep')
        with open(gitkeep, 'w', encoding='utf-8') as f:
            f.write(f"# Fotos de {p['name']}\nGuarda aqui las fotos en formato .png\n")

with open('src/data/players.json', 'w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=2)

# Update teamData.js for Player 5, 7, 10
with open('src/data/teamData.js', 'r', encoding='utf-8') as f:
    code = f.read()

for p_id, rel_path in [
    (5, './src/assets/players/5-hugo-uria/photo.png'),
    (7, './src/assets/players/7-hector-uria/photo.png'),
    (10, './src/assets/players/10-cristian-munoz/photo.png')
]:
    start_str = f'id: {p_id},'
    idx = code.find(start_str)
    if idx != -1:
        photo_idx = code.find('photo:', idx)
        if photo_idx != -1 and photo_idx < idx + 250:
            q1 = code.find('"', photo_idx)
            q2 = code.find('"', q1 + 1)
            code = code[:q1+1] + rel_path + code[q2:]

code = code.replace('fc_hub_players_final_v20', 'fc_hub_players_folders_v25')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Created directories for all 18 players successfully!")
