import subprocess, re
from pathlib import Path
urls = ['http://chatlaya.koryxa.fr', 'https://www.chatlaya.koryxa.fr', 'http://www.chatlaya.koryxa.fr']
for url in urls:
    print('\n===== ' + url + ' =====')
    r = subprocess.run(['curl','-L','--max-time','15','-A','Mozilla/5.0','-sS','-D','-',url], capture_output=True, text=True)
    print('exit', r.returncode)
    print('head:', r.stdout[:800])
    print('err:', r.stderr[:300])
    html = r.stdout
    text = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', html, flags=re.I)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    print('text:', text[:1000])
