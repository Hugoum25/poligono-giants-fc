import json
import re

default_stats = {
    "matches": 0,
    "goals": 0,
    "assists": 0,
    "yellowCards": 0,
    "redCards": 0,
    "blueCards": 0,
    "wins": 0,
    "draws": 0,
    "losses": 0,
    "mvp": 0
}

default_historical = {
    "matches": 0,
    "goals": 0,
    "assists": 0,
    "seasons": 0,
    "titles": "-",
    "mvp": 0
}

# Update players.json
with open('src/data/players.json', 'r', encoding='utf-8') as f:
    players = json.load(f)

for p in players:
    p['stats'] = dict(default_stats)
    p['historicalStats'] = dict(default_historical)

with open('src/data/players.json', 'w', encoding='utf-8') as f:
    json.dump(players, f, ensure_ascii=False, indent=2)

# Update teamData.js
with open('src/data/teamData.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace any non-zero stats or historicalStats in teamData.js
# Specifically, reset stats and historicalStats objects in JS definitions
zero_stats_str = 'stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0, mvp: 0 }'
zero_hist_str = 'historicalStats: { matches: 0, goals: 0, assists: 0, seasons: 0, titles: "-", mvp: 0 }'

code = re.sub(r'stats:\s*\{[^\}]*\}', zero_stats_str, code)
code = re.sub(r'historicalStats:\s*\{[^\}]*\}', zero_hist_str, code)

# Bump PLAYERS_STORAGE_KEY to force fresh loading from code
code = code.replace('fc_hub_players_rodri_v50', 'fc_hub_players_reset_v60')

with open('src/data/teamData.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('All player stats and historical stats successfully reset to 0!')
