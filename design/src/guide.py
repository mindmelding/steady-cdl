# One-page Steady CDL brand guide -> final/steady-cdl-brand-guide.png + .pdf
import os, sys, subprocess
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import final as F, build_v2 as B
D=F.D; O=F.OUT; CH=F.CH
def sv(name,h,bg=None,pad=0,extra=''):
    t=open(os.path.join(O,name)).read().replace('<svg ',f"<svg style='height:{h}px;width:auto;display:block' ",1)
    return f"<div style='background:{bg or '#fff'};padding:{pad}px;border:1px solid #E5E5E5;border-radius:10px;display:flex;align-items:center;justify-content:center;{extra}'>{t}</div>"
hz,W,H=F.horizontal('#000'); capH=F.CAP/F.UPM*F.S; dm=1.32*capH; X=0.5*dm
k=80/H  # display scale
clear=f"""<div style='position:relative;width:{W*k:.0f}px;height:{H*k:.0f}px;background:repeating-linear-gradient(45deg,#F4F4F4 0 6px,#fff 6px 12px);border:1px solid #E5E5E5'>
<div style='position:absolute;left:{X*k:.1f}px;top:{X*k:.1f}px;right:{X*k:.1f}px;bottom:{X*k:.1f}px;background:#fff;border:1px dashed #000'></div>
<div style='position:absolute;inset:0'>{hz.replace('<svg ',f"<svg style='width:100%;height:100%;display:block' ",1)}</div>
</div>"""
def sw(c,n,dark=False): return f"<div style='flex:1'><div style='height:40px;border-radius:8px;background:{c};border:1px solid #E5E5E5'></div><div style='font:600 13px Inter;margin-top:6px'>{n}</div><div style='font:400 12px IBM Plex Mono;color:#5F5F5F'>{c}</div></div>"
H2=lambda t:f"<div style='font:600 13px Inter;letter-spacing:.06em;text-transform:uppercase;color:#5F5F5F;margin:0 0 10px'>{t}</div>"
html=f"""<!doctype html><html><head><meta charset='utf-8'><style>@page{{size:8.5in 11in;margin:0}}*{{margin:0;box-sizing:border-box}}
html,body{{height:1056px}}body{{width:816px;height:1056px;background:#fff;color:#000;font-family:'Atkinson Hyperlegible';font-size:13.5px;line-height:1.4;overflow:hidden}}
.g{{display:grid;gap:22px}} .p{{color:#3A3A3A}}</style></head><body><div style='padding:34px 46px'>
<div style='display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1.5px solid #000;padding-bottom:16px'>
{open(os.path.join(O,'steady-cdl-horizontal-black-on-white.svg')).read().replace('<svg ',"<svg style='height:56px;width:auto;display:block;margin-left:-14px' ",1)}
<div style='text-align:right;font:500 12px Inter;color:#5F5F5F'>Brand guide v1 · Oct 28, 2026<br>Flat black and white. Nothing else.</div></div>
<div style='margin-top:16px'>{H2('Logo')}
<div style='display:grid;grid-template-columns:2.1fr 1.3fr .8fr .8fr;gap:10px'>
{sv('steady-cdl-horizontal-black-on-white.svg',40,pad=12)}{sv('steady-cdl-stacked-black-on-white.svg',70,pad=4)}{sv('steady-cdl-icon-black-on-white.svg',66,pad=6)}{sv('steady-cdl-mark-only-black-on-white.svg',46,pad=16)}
{sv('steady-cdl-horizontal-white-on-black.svg',40,'#000',12)}{sv('steady-cdl-stacked-white-on-black.svg',70,'#000',4)}{sv('steady-cdl-icon-white-on-black.svg',66,'#000',6)}{sv('steady-cdl-mark-only-white-on-black.svg',46,'#000',16)}
</div><div class='p' style='margin-top:8px'>Horizontal is the default. Stacked for square spaces. The app icon is the mark on a white square; iOS rounds the corners. The mark is an 80% ring (72° gap) with one dot at the end of the gap. Never move, recolor, or animate the dot apart from the ring.</div></div>
<div style='display:grid;grid-template-columns:1.25fr 1fr;gap:28px;margin-top:16px'>
<div>{H2('Clearspace')}<div style='padding:4px 0 0'>{clear}</div><div class='p' style='margin-top:8px'>X = half the mark's diameter. Keep X clear on every side. The files in /final already include it.</div></div>
<div>{H2('Minimum size')}<div style='display:flex;align-items:flex-end;gap:18px'>
<div>{open(os.path.join(O,'steady-cdl-horizontal-black-on-white.svg')).read().replace('<svg ',"<svg style='width:120px;height:auto;display:block' ",1)}<div class='p' style='font-size:12px'>Lockup ≥ 120 px wide</div></div>
<div>{B.MARK(20)}<div class='p' style='font-size:12px;margin-top:4px'>Mark ≥ 16 px</div></div></div>
<div class='p' style='margin-top:8px'>At 64 px and below (60, 29 px icons, tab bars, favicons) use the small-optimized mark: heavier ring, bigger dot.</div></div></div>
<div style='display:grid;grid-template-columns:1.25fr 1fr;gap:28px;margin-top:16px'>
<div>{H2('Type')}
<div style="font:600 26px Inter;letter-spacing:-.035em">Inter SemiBold</div><div class='p'>Wordmark, headings, buttons. −3% tracking on headings.</div>
<div style="font:400 20px 'Atkinson Hyperlegible';margin-top:10px">Atkinson Hyperlegible</div><div class='p'>All reading text. 18 pt minimum in the app; follows Dynamic Type.</div>
<div style="font:400 15px 'IBM Plex Mono';margin-top:10px">49 CFR 393.51 · TX CDL Manual §5.x</div><div class='p'>Citations and source lines only.</div></div>
<div>{H2('Color')}<div style='display:flex;gap:8px'>{sw('#000000','Black')}{sw('#FFFFFF','White')}{sw('#5F5F5F','Sub text')}</div>
<div style='display:flex;gap:8px;margin-top:8px'>{sw('#E5E5E5','Line')}{sw('#F4F4F4','Soft fill')}<div style='flex:1'></div></div>
<div class='p' style='margin-top:8px'>No brand accent color, gradients, or shadows. Cab Mode simply inverts: white on black.</div></div></div>
<div style='margin-top:16px;border:2px solid #000;border-radius:14px;padding:16px 18px'>
<div style='font:600 13px Inter;letter-spacing:.06em;text-transform:uppercase'>The one rule</div>
<div style="font:600 19px Inter;letter-spacing:-.02em;margin:4px 0 10px">Correct and incorrect are always an icon + a word. Never color alone.</div>
<div style='display:flex;gap:12px'>
<div class='opt ok' style='flex:1;display:flex;gap:10px;align-items:center;border:2.5px solid #000;background:#F4F4F4;border-radius:12px;padding:10px 14px;font-size:16px'><span style='width:26px;height:26px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center'>{B.ck(s=16)}</span>60 psi<span style='margin-left:auto;font:600 13px Inter'>Correct answer</span></div>
<div style='flex:1;display:flex;gap:10px;align-items:center;border:2px dashed #000;border-radius:12px;padding:10px 14px;font-size:16px'>{B.xx(s=20)}40 psi<span style='margin-left:auto;font:500 13px Inter'>Not quite</span></div></div>
<div class='p' style='margin-top:10px'>Also: no mascots, no confetti, no streak pressure, no pass guarantees. Calm, large, cited.</div></div>
</div></body></html>"""
f=os.path.join(O,'_guide.html'); open(f,'w').write(html)
subprocess.run([CH,'--headless=new','--no-sandbox','--hide-scrollbars','--force-device-scale-factor=2','--window-size=816,1056',f'--screenshot={O}/steady-cdl-brand-guide.png','file://'+f],check=True,capture_output=True)
subprocess.run([CH,'--headless=new','--no-sandbox','--no-pdf-header-footer',f'--print-to-pdf={O}/steady-cdl-brand-guide.pdf','file://'+f],check=True,capture_output=True)
os.remove(f); print('ok')
