import subprocess
import re

sites = [
    'https://corabiz.koryxa.fr',
    'https://cora.koryxa.fr',
    'https://api.koryxa.fr',
    'https://neurokap.koryxa.fr',
    'https://formation.koryxa.fr',
    'https://chatlaya.koryxa.fr',
]

for url in sites:
    print('\n===== ' + url + ' =====')
    r = subprocess.run(['curl', '-L', '--max-time', '18', '-A', 'Mozilla/5.0', '-sS', url], capture_output=True, text=True)
    print('exit', r.returncode)
    html = r.stdout[:250000]
    print('len', len(html))
    for label, pattern in [
        ('title', r'<title[^>]*>(.*?)</title>'),
        ('description', r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)'),
        ('og:title', r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']*)'),
        ('og:description', r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']*)'),
    ]:
        m = re.search(pattern, html, re.I | re.S)
        if m:
            print(label + ':', re.sub(r'\s+', ' ', m.group(1)).strip())
    text = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', html, flags=re.I)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    print('text:', text[:1400])
    if r.stderr:
        print('stderr:', r.stderr[:500])
