import os, subprocess, sys
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); CH=os.environ.get('CHROME','/usr/bin/google-chrome')
sys.path.insert(0,os.path.join(D,'src')); import icon as I
def shot(html,png,w,h,scale=1):
    f=png.replace('.png','.html'); open(f,'w').write(html)
    subprocess.run([CH,'--headless=new','--no-sandbox','--hide-scrollbars',f'--force-device-scale-factor={scale}',f'--window-size={w},{h}',f'--screenshot={png}','file://'+f],check=True,capture_output=True)
SM=I.ring(**I.SMALL,corner=0)[0]; MA=I.ring(**I.MASTER)[0]
def ic(px,svg=None,border=True,rad=0.2237):
    svg=svg or (SM if px<=64 else MA)
    s=svg.replace("width='1024' height='1024'",f"width='{px}' height='{px}'")
    return f"<div style='width:{px}px;height:{px}px;border-radius:{px*rad}px;overflow:hidden;{'box-shadow:0 0 0 1px #0000001a' if border else ''};flex:none'>{s}</div>"
NAMES=[('Steady CDL','Steady','CDL'),('Cited','Cited',''),('Exit 80','Exit 80','')]
def wordmarks():
    for full,a,b in NAMES:
        slug=full.lower().replace(' ','-')
        html=f"""<html><body style="margin:0;background:#fff;font-family:'Inter';color:#000">
<div style='width:1600px;height:900px;display:grid;grid-template-rows:1fr 1fr;'>
<div style='display:flex;align-items:center;justify-content:center;gap:44px;border-bottom:1px solid #eee'>{ic(150)}<div style="font-family:'Inter';font-weight:600;font-size:132px;letter-spacing:-0.045em">{a}{f"<span style='font-weight:400;color:#000;margin-left:22px;letter-spacing:-0.02em'>{b}</span>" if b else ''}</div></div>
<div style='display:flex;align-items:center;justify-content:space-around;padding:0 80px'>
 <div style='display:flex;align-items:center;gap:14px'>{ic(56)}<div style="font-weight:600;font-size:44px;letter-spacing:-0.04em">{full}</div></div>
 <div style='background:#000;color:#fff;padding:34px 44px;border-radius:24px;display:flex;align-items:center;gap:16px'>{ic(56,I.ring(**I.SMALL,bg='#000000',fg='#FFFFFF')[0],False)}<div style="font-weight:600;font-size:44px;letter-spacing:-0.04em">{full}</div></div>
 <div style="font-family:'Atkinson Hyperlegible';font-size:22px;line-height:1.5;max-width:420px">Wordmark: Inter SemiBold, −4.5% tracking.<br>UI: Atkinson Hyperlegible 18pt+.<br>Black #000 on white #FFF. Flat, no gradients.</div>
</div></div></body></html>"""
        shot(html,os.path.join(D,'wordmarks',f'wordmark-{slug}.png'),1600,900)
def glyph(kind):
    w="#fff"
    g={'phone':f"<path d='M20 14c0 16 14 30 30 30l4-8-9-5-4 4c-5-3-9-7-12-12l4-4-5-9z' fill='{w}'/>",
       'mail':f"<rect x='12' y='20' width='40' height='26' rx='4' fill='{w}'/><path d='M13 22l19 14 19-14' stroke='#3a7bd5' stroke-width='3' fill='none'/>",
       'cal':f"<rect x='14' y='14' width='36' height='36' rx='6' fill='{w}'/><text x='32' y='42' font-size='20' font-family='Inter' font-weight='600' text-anchor='middle' fill='#222'>28</text>",
       'photo':f"<circle cx='32' cy='32' r='14' fill='none' stroke='{w}' stroke-width='6'/>",
       'cam':f"<rect x='12' y='22' width='40' height='26' rx='6' fill='{w}'/><circle cx='32' cy='35' r='8' fill='#555'/>",
       'map':f"<path d='M14 18l12-4 12 4 12-4v32l-12 4-12-4-12 4z' fill='{w}'/>",
       'sun':f"<circle cx='32' cy='30' r='11' fill='#ffd54a'/><rect x='18' y='36' width='30' height='12' rx='6' fill='{w}'/>",
       'note':f"<rect x='16' y='12' width='32' height='40' rx='4' fill='{w}'/><path d='M22 24h20M22 32h20M22 40h12' stroke='#999' stroke-width='3'/>",
       'music':f"<path d='M26 44V18l18-4v26' stroke='{w}' stroke-width='5' fill='none'/><circle cx='22' cy='44' r='6' fill='{w}'/><circle cx='40' cy='40' r='6' fill='{w}'/>",
       'gear':f"<circle cx='32' cy='32' r='12' fill='none' stroke='{w}' stroke-width='7' stroke-dasharray='6 4'/>",
       'clock':f"<circle cx='32' cy='32' r='18' fill='{w}'/><path d='M32 20v13l8 5' stroke='#111' stroke-width='3' fill='none'/>",
       'wallet':f"<rect x='12' y='18' width='40' height='30' rx='6' fill='{w}'/><rect x='12' y='26' width='40' height='6' fill='#e33'/>",
       'truck':f"<rect x='10' y='22' width='28' height='18' rx='2' fill='{w}'/><path d='M38 28h9l6 7v5H38z' fill='{w}'/><circle cx='20' cy='44' r='5' fill='{w}'/><circle cx='44' cy='44' r='5' fill='{w}'/>",
       'cdl':f"<text x='32' y='40' font-size='22' font-family='Inter' font-weight='800' text-anchor='middle' fill='{w}'>CDL</text>",
       'wheel':f"<circle cx='32' cy='32' r='17' fill='none' stroke='{w}' stroke-width='6'/><path d='M15 32h34M32 32v17' stroke='{w}' stroke-width='6'/>",
       'road':f"<path d='M26 54L30 10h4l4 44z' fill='{w}'/><path d='M32 16v6M32 28v6M32 40v6' stroke='#2e7d32' stroke-width='2'/>",
       'check':f"<text x='32' y='30' font-size='14' font-family='Inter' font-weight='800' text-anchor='middle' fill='{w}'>CDL</text><path d='M20 38l8 8 16-16' stroke='{w}' stroke-width='5' fill='none'/>"}[kind]
    return g
def gen(px,bg,kind):
    return f"<div style='width:{px}px;height:{px}px;border-radius:{px*.2237}px;background:{bg};flex:none;overflow:hidden'><svg width='{px}' height='{px}' viewBox='0 0 64 64'>{glyph(kind)}</svg></div>"
def home():
    apps=[('Phone','#34c759','phone'),('Mail','#3a7bd5','mail'),('Calendar','#f2f2f2','cal'),('Photos','#ff9f0a','photo'),
          ('Camera','#8e8e93','cam'),('Maps','#5ac8fa','map'),('Weather','#4a90e2','sun'),('Notes','#f7c948','note'),
          ('Music','#fa2d48','music'),('Settings','#8e8e93','gear'),('Clock','#1c1c1e','clock'),('Wallet','#1c1c1e','wallet')]
    rows=''.join(f"<div class='a'>{gen(62,b,k)}<span>{n}</span></div>" for n,b,k in apps)
    comp=[('CDL Prep','#1f5fbf','truck'),('CDL Test','#f26a1b','cdl'),('Permit Pro','#d32f2f','wheel'),('CDL Exam','#2e7d32','road')]
    crow=''.join(f"<div class='a'>{gen(62,b,k)}<span>{n}</span></div>" for n,b,k in comp)
    ours=f"<div class='a'>{ic(62)}<span>Steady CDL</span></div>"
    mix=[('Truck GPS','#ffb300','truck'),('CDL Quiz','#6a1b9a','check'),('Load Board','#00897b','map')]
    mrow=ours+''.join(f"<div class='a'>{gen(62,b,k)}<span>{n}</span></div>" for n,b,k in mix)
    dock=''.join(gen(62,b,k) for b,k in [('#34c759','phone'),('#3a7bd5','mail'),('#fa2d48','music'),('#8e8e93','cam')])
    html=f"""<html><head><style>body{{margin:0;font-family:'Inter'}}
.s{{width:393px;height:852px;background:linear-gradient(#F3F4F6,#E7E9EC);position:relative;overflow:hidden}}
.g{{display:grid;grid-template-columns:repeat(4,62px);justify-content:space-between;padding:0 27px;row-gap:26px}}
.a{{display:flex;flex-direction:column;align-items:center;gap:6px;width:62px}} .a span{{font-size:12px;color:#111;white-space:nowrap;font-weight:500}}
.lbl{{font-size:11px;color:#555;padding:0 27px;margin:18px 0 10px;letter-spacing:.04em;text-transform:uppercase}}
</style></head><body><div class='s'>
<div style='height:54px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 32px 6px;font-weight:600;font-size:16px'><span>9:41</span><span>●●● ▮</span></div>
<div style='height:22px'></div><div class='g'>{rows}</div>
<div class='lbl'>Competitor-style stand-ins (drawn, not their art)</div><div class='g'>{crow}</div>
<div class='lbl'>Ours among them</div><div class='g'>{mrow}</div>
<div style='position:absolute;bottom:22px;left:14px;right:14px;height:88px;border-radius:30px;background:#ffffff99;display:flex;justify-content:space-around;align-items:center'>{dock}</div>
</div></body></html>"""
    shot(html,os.path.join(D,'icon','home-screen-mock.png'),393,852,3)
    # 1x real-pixel-size crop too
    shot(html,os.path.join(D,'icon','home-screen-mock-1x.png'),393,852,1)
if __name__=='__main__':
    wordmarks(); home()
