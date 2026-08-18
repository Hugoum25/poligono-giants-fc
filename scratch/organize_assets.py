import os
import glob
import shutil

# Asset categorization mapping
asset_dest = {
    # Sponsors
    'bambi-logo.png': 'src/assets/sponsors/',
    'fitmaster-logo.png': 'src/assets/sponsors/',
    'javi-frey-logo.png': 'src/assets/sponsors/',
    'labase-tattoo-logo.png': 'src/assets/sponsors/',
    'mambashaved-logo.png': 'src/assets/sponsors/',
    'pastur-logo.png': 'src/assets/sponsors/',
    'soho-bar-logo.png': 'src/assets/sponsors/',
    'trm-sports-logo.png': 'src/assets/sponsors/',

    # Jerseys
    'jersey_2024_2025.jpg': 'src/assets/jerseys/',
    'jersey_2024_2025_real.png': 'src/assets/jerseys/',
    'jersey_2025_2026.jpg': 'src/assets/jerseys/',
    'jersey_2026_2027.jpg': 'src/assets/jerseys/',
    'jersey_gk_2024_2025.jpg': 'src/assets/jerseys/',
    'jersey_gk_2025_2026.jpg': 'src/assets/jerseys/',
    'jersey_gk_2026_2027.jpg': 'src/assets/jerseys/',
    'jersey_gk_kit.jpg': 'src/assets/jerseys/',
    'jersey_player_kit.jpg': 'src/assets/jerseys/',
    'jersey_white_kit.jpg': 'src/assets/jerseys/',

    # Multimedia
    'match-photo-1.jpg': 'src/assets/multimedia/',
    'match-photo-2.jpg': 'src/assets/multimedia/',
    'match-photo-3.jpg': 'src/assets/multimedia/',
    'match-photo-4.jpg': 'src/assets/multimedia/',
    'fichaje_1.jpg': 'src/assets/multimedia/',
    'fichaje_2.jpg': 'src/assets/multimedia/',
    'video_1.mp4': 'src/assets/multimedia/',
    'video_2.mp4': 'src/assets/multimedia/',
    'video_3.mp4': 'src/assets/multimedia/',
    'icon-multimedia-3d.png': 'src/assets/multimedia/',

    # 3D Icons
    'juegos-icon.obj': 'src/assets/icons/',
    'media-icon.obj': 'src/assets/icons/',
    'noticias-icon.obj': 'src/assets/icons/',
    'partidos-icon.obj': 'src/assets/icons/',
    'patrocinadores-icon.obj': 'src/assets/icons/',
    'plantilla-icon.obj': 'src/assets/icons/',

    # Club logo
    'club-logo.png': 'src/assets/club/',

    # Loose player photos
    'hugo.png': 'src/assets/players/5-hugo-uria/',
    'player_ugo.png': 'src/assets/players/5-hugo-uria/',
    'hector.png': 'src/assets/players/7-hector-uria/',
    'cristian.png': 'src/assets/players/10-cristian-munoz/'
}

# Create subdirectories if they don't exist
subdirs = set(asset_dest.values())
for s in subdirs:
    os.makedirs(s, exist_ok=True)

# Move files
moved_map = {}
for filename, dest_dir in asset_dest.items():
    src_path = os.path.join('src/assets', filename)
    dest_path = os.path.join(dest_dir, filename)
    if os.path.exists(src_path):
        shutil.move(src_path, dest_path)
        moved_map[filename] = dest_path.replace('\\', '/')
        print(f"Moved {filename} -> {dest_path}")

# Replacement path rules for code updating
path_replacements = {
    # Sponsors
    './src/assets/bambi-logo.png': './src/assets/sponsors/bambi-logo.png',
    './src/assets/fitmaster-logo.png': './src/assets/sponsors/fitmaster-logo.png',
    './src/assets/javi-frey-logo.png': './src/assets/sponsors/javi-frey-logo.png',
    './src/assets/labase-tattoo-logo.png': './src/assets/sponsors/labase-tattoo-logo.png',
    './src/assets/mambashaved-logo.png': './src/assets/sponsors/mambashaved-logo.png',
    './src/assets/pastur-logo.png': './src/assets/sponsors/pastur-logo.png',
    './src/assets/soho-bar-logo.png': './src/assets/sponsors/soho-bar-logo.png',
    './src/assets/trm-sports-logo.png': './src/assets/sponsors/trm-sports-logo.png',

    # Club logo
    './src/assets/club-logo.png': './src/assets/club/club-logo.png',

    # Jerseys
    './src/assets/jersey_2024_2025.jpg': './src/assets/jerseys/jersey_2024_2025.jpg',
    './src/assets/jersey_2025_2026.jpg': './src/assets/jerseys/jersey_2025_2026.jpg',
    './src/assets/jersey_2026_2027.jpg': './src/assets/jerseys/jersey_2026_2027.jpg',
    './src/assets/jersey_gk_2024_2025.jpg': './src/assets/jerseys/jersey_gk_2024_2025.jpg',
    './src/assets/jersey_gk_2025_2026.jpg': './src/assets/jerseys/jersey_gk_2025_2026.jpg',
    './src/assets/jersey_gk_2026_2027.jpg': './src/assets/jerseys/jersey_gk_2026_2027.jpg',

    # Multimedia
    './src/assets/match-photo-1.jpg': './src/assets/multimedia/match-photo-1.jpg',
    './src/assets/match-photo-2.jpg': './src/assets/multimedia/match-photo-2.jpg',
    './src/assets/match-photo-3.jpg': './src/assets/multimedia/match-photo-3.jpg',
    './src/assets/match-photo-4.jpg': './src/assets/multimedia/match-photo-4.jpg',
    './src/assets/fichaje_1.jpg': './src/assets/multimedia/fichaje_1.jpg',
    './src/assets/fichaje_2.jpg': './src/assets/multimedia/fichaje_2.jpg',
    './src/assets/video_1.mp4': './src/assets/multimedia/video_1.mp4',
    './src/assets/video_2.mp4': './src/assets/multimedia/video_2.mp4',
    './src/assets/video_3.mp4': './src/assets/multimedia/video_3.mp4',
    './src/assets/icon-multimedia-3d.png': './src/assets/multimedia/icon-multimedia-3d.png',

    # 3D Icons
    './src/assets/juegos-icon.obj': './src/assets/icons/juegos-icon.obj',
    './src/assets/media-icon.obj': './src/assets/icons/media-icon.obj',
    './src/assets/noticias-icon.obj': './src/assets/icons/noticias-icon.obj',
    './src/assets/partidos-icon.obj': './src/assets/icons/partidos-icon.obj',
    './src/assets/patrocinadores-icon.obj': './src/assets/icons/patrocinadores-icon.obj',
    './src/assets/plantilla-icon.obj': './src/assets/icons/plantilla-icon.obj'
}

# Add variations without leading ./
extra_replacements = {}
for old_p, new_p in path_replacements.items():
    if old_p.startswith('./'):
        extra_replacements[old_p[2:]] = new_p[2:]

path_replacements.update(extra_replacements)

# Files to scan and update
repo_files = glob.glob('src/**/*.js', recursive=True) + glob.glob('src/**/*.json', recursive=True) + ['index.html', 'vercel.json'] + glob.glob('src/**/*.css', recursive=True)

updated_files_count = 0

for rf in repo_files:
    if os.path.isfile(rf):
        with open(rf, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        for old_path, new_path in path_replacements.items():
            if old_path in content:
                content = content.replace(old_path, new_path)
                modified = True
                print(f"Updated {old_path} -> {new_path} in {rf}")

        if modified:
            with open(rf, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_files_count += 1

print(f"Asset reorganization completed! Updated {updated_files_count} code/data files.")
