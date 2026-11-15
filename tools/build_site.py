"""Builds the website copy of the app: wraps the page in a complete HTML document
(doctype, charset, mobile viewport, social preview tags) so it renders correctly on any host."""
import sys,re
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8').read()
cut=s.index('<canvas id="gl"')
head,body=s[:cut],s[cut:]
head=re.sub(r'<meta charset="utf-8">\s*','',head)
desc="Step into Success Brand's Virtual Wellness Center: book counseling, meet Sage your guide, relax, meditate and play mind games in 3D and VR."
out=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="{desc}">
<meta name="theme-color" content="#141312">
<meta property="og:title" content="Success Brand Virtual Wellness Center">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 40'%3E%3Cpath d='M2 3 L9.5 6 L17 2 L24.5 6 L32 3 L32 19 Q31 32 17 39 Q3 32 2 19 Z' fill='%23141312' stroke='%23E3B62E' stroke-width='3'/%3E%3C/svg%3E">
<style>html,body{{margin:0}}:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}</style>
{head.strip()}
</head>
<body>
{body.strip()}
</body>
</html>
'''
open(dst,'w',encoding='utf-8').write(out)
print('wrote',dst,len(out))
