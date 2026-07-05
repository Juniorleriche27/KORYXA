import subprocess, re
sites=['https://services-ia.koryxa.fr','https://service-ia.koryxa.fr','https://partner.koryxa.fr','https://partner-portal.koryxa.fr','https://partners.koryxa.fr']
for url in sites:
    print('\n===== '+url+' =====')
    r=subprocess.run(['curl','-L','--max-time','12','-A','Mozilla/5.0','-sS',url],capture_output=True,text=True)
    print('exit',r.returncode,'len',len(r.stdout))
    html=r.stdout[:120000]
    for label,pat in [('title',r'<title[^>]*>(.*?)</title>'),('description',r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)')]:
        m=re.search(pat,html,re.I|re.S)
        if m: print(label+':',re.sub(r'\s+',' ',m.group(1)).strip())
    text=re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>',' ',html,flags=re.I)
    text=re.sub(r'<[^>]+>',' ',text)
    text=re.sub(r'\s+',' ',text).strip()
    print(text[:1000])
    if r.stderr: print('stderr',r.stderr[:300])
