# v2 mocks: flat black & white lessons product. Run: python3 src/build_v2.py
import os, math, subprocess
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); S=os.path.join(D,'src'); P=os.path.join(D,'png'); CH=os.environ.get('CHROME','/usr/bin/google-chrome')
CSS="""*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#000;--sub:#5F5F5F;--line:#E5E5E5;--soft:#F4F4F4;--bg:#FFF}
body{font-family:'Atkinson Hyperlegible',sans-serif;color:#000;background:#fff;font-size:18px;line-height:1.4;-webkit-font-smoothing:antialiased}
.h{font-family:'Inter';font-weight:600;letter-spacing:-0.025em}
.phone{width:393px;height:852px;position:relative;overflow:hidden;display:flex;flex-direction:column;background:#fff}
.sb{height:54px;flex:none;display:flex;justify-content:space-between;align-items:flex-end;padding:0 30px 8px;font:600 16px Inter}
.w{flex:1;display:flex;flex-direction:column;gap:14px;padding:6px 20px 22px;min-height:0}
.sub{color:var(--sub)} .s13{font-size:13px} .s14{font-size:14px} .s15{font-size:15px} .s16{font-size:16px}
.row{display:flex;align-items:center;gap:12px} .sp{flex:1}
.btn{min-height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:8px;font:600 18px Inter;letter-spacing:-.01em;border:1.5px solid #000;color:#000;background:#fff}
.btn.p{background:#000;color:#fff}
.btn.dis{background:#EDEDED;border-color:#EDEDED;color:#9A9A9A}
.opt{display:flex;gap:12px;align-items:center;min-height:60px;padding:14px 16px;border:1.5px solid var(--line);border-radius:14px;font-size:19px;background:#fff}
.opt .k{flex:none;width:30px;height:30px;border-radius:50%;border:1.5px solid #000;display:flex;align-items:center;justify-content:center;font:600 14px Inter}
.opt.sel{border:2.5px solid #000;padding:13px 15px} .opt.sel .k{background:#000;color:#fff}
.opt.ok{border:2.5px solid #000;padding:13px 15px;background:#F4F4F4} .opt.ok .k{background:#000;color:#fff}
.opt.no{border:2px dashed #000;color:#000}
.card{border:1.5px solid var(--line);border-radius:16px;padding:16px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;border:1.5px solid var(--line);font:500 14px Inter}
.seg{display:flex;gap:4px} .seg i{flex:1;height:6px;border-radius:3px;background:#E5E5E5} .seg i.on{background:#000}
.tab{flex:none;height:84px;border-top:1px solid var(--line);display:flex;justify-content:space-around;padding-top:10px;font:500 12px Inter;color:#8A8A8A}
.tab div{display:flex;flex-direction:column;align-items:center;gap:4px} .tab .on{color:#000}
.mono{font-family:'IBM Plex Mono';font-size:14px}
.sample{position:absolute;top:18px;left:50%;transform:translateX(-50%);font:500 10px Inter;color:#777;border:1px solid #E5E5E5;border-radius:4px;padding:1px 6px;background:#fff}
"""
SB="<div class='sb'><span>9:41</span><span>●●● ▮</span></div>"
SAMPLE="<div class='sample'>Sample content · mock</div>"
def ck(c='currentColor',s=20,w=3): return f"<svg width='{s}' height='{s}' viewBox='0 0 24 24' fill='none' stroke='{c}' stroke-width='{w}' stroke-linecap='round' stroke-linejoin='round'><path d='M4.5 12.5l4.5 4.5L19.5 7'/></svg>"
def xx(c='currentColor',s=20,w=3): return f"<svg width='{s}' height='{s}' viewBox='0 0 24 24' fill='none' stroke='{c}' stroke-width='{w}' stroke-linecap='round'><path d='M6 6l12 12M18 6L6 18'/></svg>"
SPK="<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linejoin='round' stroke-linecap='round'><path d='M4 9v6h4l5 4V5L8 9H4z'/><path d='M16.5 8.5a5 5 0 010 7'/></svg>"
FLAG="<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'><path d='M5 21V4h11l-2 4 2 4H5'/></svg>"
CAL="<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linejoin='round'><rect x='4' y='5' width='16' height='15' rx='2'/><path d='M4 10h16M9 3v4M15 3v4'/></svg>"
LOCK="<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><rect x='5' y='11' width='14' height='10' rx='2'/><path d='M8 11V8a4 4 0 018 0v3'/></svg>"
import sys; sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import icon as _I
def MARK(px,fg='#000000'):  # brand mark (optimized small geometry), transparent
    return _I.ring(**_I.SMALL,bg='none',fg=fg)[0].replace("width='1024' height='1024'",f"width='{px}' height='{px}' style='flex:none;display:block'",1)
def LOCKUP(px=22,fs=17,fg='#000000'): return f"<div class='row' style='gap:{px*0.36:.0f}px'>{MARK(px,fg)}<span style=\"font:600 {fs}px Inter;letter-spacing:-0.03em;color:{fg}\">Steady CDL</span></div>"
def ring(pct,size,sw,color='#000',track='#E5E5E5',tick=None,dot=False,inner=''):
    r=(size-sw)/2; c=size/2; C=2*math.pi*r; L=C*pct
    t=''
    if tick is not None:
        a=math.radians(tick*360); x1=c+(r-sw*0.9)*math.sin(a); y1=c-(r-sw*0.9)*math.cos(a); x2=c+(r+sw*0.9)*math.sin(a); y2=c-(r+sw*0.9)*math.cos(a)
        t=f"<line x1='{x1:.1f}' y1='{y1:.1f}' x2='{x2:.1f}' y2='{y2:.1f}' stroke='#000' stroke-width='2.5'/>"
    d=''
    if dot and 0<pct<1:
        a=math.radians(pct*360+ (sw*1.1/r)*57.3); xd=c+r*math.sin(a); yd=c-r*math.cos(a); d=f"<circle cx='{xd:.1f}' cy='{yd:.1f}' r='{sw*0.5:.1f}' fill='{color}'/>"
    arc=f"<circle cx='{c}' cy='{c}' r='{r}' fill='none' stroke='{color}' stroke-width='{sw}' stroke-linecap='round' stroke-dasharray='{L:.1f} {C:.1f}' transform='rotate(-90 {c} {c})'/>" if pct>0 else ''
    return f"<div style='position:relative;width:{size}px;height:{size}px;flex:none'><svg width='{size}' height='{size}' style='position:absolute;inset:0'><circle cx='{c}' cy='{c}' r='{r}' fill='none' stroke='{track}' stroke-width='{sw}'/>{arc}{d}{t}</svg><div style='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column'>{inner}</div></div>"
def page(body,w=393,h=852): return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body style='width:{w}px;height:{h}px;overflow:hidden'>{body}</body></html>"
def seg(n,on): return "<div class='seg'>"+''.join(f"<i class='{'on' if i<on else ''}'></i>" for i in range(n))+"</div>"
Q='The low air pressure warning must come on before pressure in the service air tank drops below about:'
OPTS=['40 psi','60 psi','80 psi','100 psi']
WHY='Federal rules require a warning you can see or hear before tank pressure falls below 60 psi (or half the compressor governor cut-out pressure, if that is lower). If it comes on, stop safely as soon as you can.'

def s_onboard():
    opts=[('Getting my permit (CLP)','General Knowledge, Air Brakes, Combination. Texas adds Commercial Rules.',True),('Adding an endorsement','HazMat, Tanker, Doubles/Triples, Passenger, School Bus',False),('Renewing HazMat','Refresh before your retest',False)]
    o=''.join(f"<div class='opt {'sel' if s else ''}' style='align-items:flex-start'><div style='flex:1'><div class='h' style='font-size:19px'>{a}</div><div class='sub s15' style='margin-top:2px'>{b}</div></div>{ck(s=22) if s else ''}</div>" for a,b,s in opts)
    return f"""<div class='phone'>{SB}<div class='w'>
<div class='row'><span style='font-size:22px'>‹</span><div class='sp'>{seg(3,2)}</div><span class='s14 sub' style='font-family:Inter'>2 of 3</span></div>
<div class='chip' style='align-self:flex-start'>{ck(s=16)} Texas · tests in English</div>
<div class='h' style='font-size:30px;line-height:1.12;margin-top:4px'>What are you studying?</div>
<div class='sub s16'>Steady CDL builds your lessons around your state's real tests.</div>
{o}
<div class='sp'></div>
<div class='card row' style='padding:14px 16px'>{ring(0.8,40,5,dot=True)}<div style='flex:1'><div class='h s16'>Already studied?</div><div class='sub s15'>Take a 2-minute check and skip what you know.</div></div><span style='font-size:22px'>›</span></div>
<div class='btn p'>Continue</div></div>{SAMPLE}</div>"""

def s_home():
    L=[('done','Air system basics','4 min'),('done','Compressor and governor','5 min'),('cur','Low air warnings','4 min · 5 questions'),('next','Spring brakes','5 min'),('next','Brake checks','6 min'),('test','Unit check: 25 Q, like the real test','12 min')]
    items=''
    for i,(st,t,m) in enumerate(L):
        if st=='done': node=ring(1,52,5,inner=ck(s=22))
        elif st=='cur': node=ring(0.4,64,6,inner=f"<span class='h' style='font-size:20px'>{i+1}</span>",dot=True)
        elif st=='test': node=f"<div style='width:52px;height:52px;border-radius:14px;border:2px solid #000;display:flex;align-items:center;justify-content:center' class='h'>25</div>"
        else: node=ring(0,52,5,inner=f"<span class='h sub' style='font-size:18px'>{i+1}</span>")
        body=(f"<div class='card' style='flex:1;border:2.5px solid #000;padding:12px 14px'><div class='sub s13' style='font-family:Inter;font-weight:600;letter-spacing:.04em'>UP NEXT · LESSON {i+1}</div><div class='h' style='font-size:19px'>{t}</div><div class='sub s15'>{m}</div><div class='btn p' style='min-height:44px;margin-top:10px;font-size:16px'>Start lesson</div></div>"
              if st=='cur' else f"<div style='flex:1'><div class='{'h' if st!='next' else 'h sub'}' style='font-size:17px;{'color:#000' if st=='test' else ''}'>{t}</div><div class='sub s14'>{m}{' · done' if st=='done' else ''}</div></div>")
        items+=f"<div class='row' style='align-items:center;gap:14px;position:relative'><div style='width:64px;display:flex;justify-content:center'>{node}</div>{body}</div>"
    return f"""<div class='phone'>{SB}<div class='w' style='gap:12px'>
<div class='row'><div style='flex:1'><div class='sub s14' style='font-family:Inter'>Texas · Class A permit</div><div class='h' style='font-size:26px'>Learn</div></div>{ring(0.58,48,5,tick=0.8,inner="<span class='h' style='font-size:14px'>58</span>")}</div>
<div class='card' style='background:#000;color:#fff;border-color:#000;padding:14px 16px'><div class='s13' style='font-family:Inter;font-weight:600;letter-spacing:.06em;opacity:.7'>UNIT 2 OF 4</div><div class='row'><div class='h' style='font-size:22px;flex:1'>Air Brakes</div><span class='s15' style='opacity:.85'>2 of 6 lessons</span></div><div class='s15' style='opacity:.85'>Texas test: 25 questions · 80% to pass</div></div>
<div style='position:relative;display:flex;flex-direction:column;gap:14px'><div style='position:absolute;left:31px;top:20px;bottom:20px;width:2px;background:#E5E5E5'></div>{items}</div>
</div><div class='tab'><div class='on'>{ring(0.8,22,3,dot=True)}Learn</div><div>{xx(s=20,w=2)}Review · 6</div><div>{CAL}Test Day</div><div>{SPK}Cab Mode</div></div>{SAMPLE}</div>"""

def s_intro():
    rows=[('Warning comes on','Before tank pressure drops below 60 psi','49 CFR 393.51'),('What you see or hear','A red light, a buzzer, or both','Manual §5.1'),('What to do','Stop safely as soon as you can. Find the cause.','Manual §5.1')]
    t=''.join(f"<div style='display:grid;grid-template-columns:110px 1fr;gap:10px;padding:12px 0;border-top:1px solid #E5E5E5'><div class='h s15'>{a}</div><div class='s16'>{b}<div class='mono sub' style='font-size:12px;margin-top:2px'>{c}</div></div></div>" for a,b,c in rows)
    return f"""<div class='phone'>{SB}<div class='w'>
<div class='row'><span style='font-size:20px'>✕</span><div class='sp'>{seg(6,2)}</div></div>
<div class='sub s14' style='font-family:Inter;font-weight:600;letter-spacing:.06em;margin-top:8px'>AIR BRAKES · LESSON 3 OF 6</div>
<div class='h' style='font-size:32px;line-height:1.1'>Low air warnings</div>
<div class='row s15 sub' style='gap:14px;font-family:Inter'><span>4 min</span><span>·</span><span>5 questions</span><span>·</span><span>On the Texas test</span></div>
<div style='font-size:19px'>Your truck must <b>warn you before the air gets too low to stop safely.</b> Know the number, what the warning looks like, and what to do.</div>
<div class='h s16' style='margin-top:6px'>Key facts</div>
<div>{t}</div>
<div class='sp'></div>
<div class='row' style='gap:10px'><div class='btn' style='width:56px;padding:0'>{SPK}</div><div class='btn p' style='flex:1'>Start lesson</div></div></div>{SAMPLE}</div>"""

def qtop(step):
    return f"<div class='row'><span style='font-size:20px'>✕</span><div class='sp'>{seg(5,step)}</div><span class='s14 sub' style='font-family:Inter'>{step} of 5</span></div>"
def s_question():
    o=''.join(f"<div class='opt {'sel' if i==0 else ''}'><span class='k'>{'ABCD'[i]}</span><span>{x}</span></div>" for i,x in enumerate(OPTS))
    return f"""<div class='phone'>{SB}<div class='w'>{qtop(3)}
<div class='row' style='gap:8px;margin-top:6px'><span class='chip'>Federal rule · all states</span></div>
<div style='font-size:24px;line-height:1.32;font-weight:700'>{Q}</div>
<div style='display:flex;flex-direction:column;gap:10px'>{o}</div>
<div class='row s16 sub' style='gap:20px'><span class='row' style='gap:6px'>{SPK} Read aloud</span><span class='row' style='gap:6px'>{FLAG} Flag</span></div>
<div class='sp'></div><div class='btn p'>Check</div></div>{SAMPLE}</div>"""

def s_proof():
    o=''.join(f"<div class='opt {'no' if i==0 else ('ok' if i==1 else '')}' style='min-height:52px;padding:10px 14px;font-size:18px'>{('<span>'+xx(s=22)+'</span>') if i==0 else (('<span class=k>'+ck(c='#fff',s=16)+'</span>') if i==1 else '<span class=k>'+'ABCD'[i]+'</span>')}<span style='flex:1'>{x}</span>{'<span class=s14 style=font-family:Inter>Your answer</span>' if i==0 else ('<span class=s14 style=font-family:Inter;font-weight:600>Correct answer</span>' if i==1 else '')}</div>" for i,x in enumerate(OPTS[:3]))
    return f"""<div class='phone'>{SB}<div class='w' style='gap:10px'>{qtop(3)}
<div class='s16' style='line-height:1.35;margin-top:4px'>{Q}</div>
<div style='display:flex;flex-direction:column;gap:8px'>{o}</div></div>
<div style='position:absolute;left:0;right:0;bottom:0;background:#fff;border-top:2px solid #000;border-radius:22px 22px 0 0;padding:18px 20px 24px;display:flex;flex-direction:column;gap:12px;box-shadow:0 -8px 30px #0000001a'>
<div class='row' style='gap:8px'>{xx(s=24)}<span class='h' style='font-size:22px'>Not quite.</span><span class='sp'></span><span class='s15 sub' style='font-family:Inter'>Added to Review</span></div>
<div class='h' style='font-size:19px'>The answer is B · 60 psi</div>
<div style='font-size:18px'>{WHY}</div>
<div style='background:#F4F4F4;border-radius:12px;padding:12px 14px'><div class='h s14'>Source</div><div class='mono' style='margin-top:2px'>TX CDL Manual §5.x · 49 CFR 393.51</div><div class='sub s14'>Last checked Oct 2026 · section no. is a placeholder</div></div>
<div class='row s16' style='gap:20px'><span class='row' style='gap:6px'>{SPK} Read aloud</span><span class='row sub' style='gap:6px'>{FLAG} Report a mistake</span></div>
<div class='btn p'>Continue</div></div>{SAMPLE}</div>"""

def s_complete():
    return f"""<div class='phone'>{SB}<div class='w' style='align-items:center;text-align:center;gap:14px'>
<div style='height:40px'></div>
{ring(1,168,14,inner=ck(s=64,w=2.6))}
<div class='sub s14' style='font-family:Inter;font-weight:600;letter-spacing:.06em'>LESSON 3 OF 6 COMPLETE</div>
<div class='h' style='font-size:32px;line-height:1.1'>Low air warnings</div>
<div class='row' style='gap:10px;width:100%;margin-top:8px'>
 <div class='card' style='flex:1;text-align:left'><div class='h' style='font-size:30px'>4<span class='sub' style='font-size:20px'>/5</span></div><div class='sub s14'>correct</div></div>
 <div class='card' style='flex:1;text-align:left'><div class='h' style='font-size:30px'>3:40</div><div class='sub s14'>minutes</div></div>
 <div class='card' style='flex:1;text-align:left'><div class='h' style='font-size:30px'>1</div><div class='sub s14'>to review</div></div></div>
<div class='card row' style='width:100%;text-align:left'>{ring(3/6,44,5,inner="<span class='h s13'>3/6</span>")}<div style='flex:1'><div class='h s16'>Air Brakes unit</div><div class='sub s15'>Next: Spring brakes · 5 min</div></div></div>
<div class='sp'></div><div class='btn p' style='width:100%'>Continue</div><div class='s16 sub'>Stop for today</div></div>{SAMPLE}</div>"""

def s_review():
    items=[('Low air warnings','The warning comes on before 60 psi','Due today'),('Spring brakes','When they apply on their own','Due today'),('Air system basics','Draining the air tanks','Due today'),('General Knowledge','Following distance at highway speed','Due tomorrow'),('Combination','Coupling: check the locking jaws','In 2 days')]
    li=''.join(f"<div class='row' style='padding:13px 0;border-top:1px solid #E5E5E5'>{xx(s=18,w=2.5)}<div style='flex:1'><div class='sub s13' style='font-family:Inter;font-weight:600'>{a.upper()}</div><div style='font-size:17px'>{b}</div></div><span class='s14 {'' if 'today' in c else 'sub'}' style='font-family:Inter;{'font-weight:600' if 'today' in c else ''}'>{c}</span></div>" for a,b,c in items)
    return f"""<div class='phone'>{SB}<div class='w' style='gap:12px'>
<div class='h' style='font-size:26px'>Review</div>
<div class='card' style='border:2.5px solid #000'><div class='row'><div style='flex:1'><div class='h' style='font-size:22px'>6 to fix</div><div class='sub s15'>3 due today · about 4 min</div></div>{ring(0.5,56,6,inner="<span class='h s15'>3/6</span>")}</div>
<div class='btn p' style='margin-top:12px'>Replay 6 mistakes</div></div>
<div class='sub s15'>Each one comes back at 1, 2, then 4 days until you get it right twice.</div>
<div>{li}</div></div>
<div class='tab'><div>{ring(0.8,22,3,dot=True)}Learn</div><div class='on'>{xx(s=20,w=2)}Review · 6</div><div>{CAL}Test Day</div><div>{SPK}Cab Mode</div></div>{SAMPLE}</div>"""

def s_testday():
    secs=[('TX Commercial Rules',0.86),('General Knowledge',0.81),('Combination',0.74),('Air Brakes',0.62)]
    bars=''.join(f"<div style='padding:8px 0'><div class='row s16'><span style='flex:1'>{n}</span><span class='h s15'>{int(v*100)}</span></div><div style='position:relative;height:8px;background:#E5E5E5;border-radius:4px;margin-top:6px'><div style='width:{v*100}%;height:100%;background:#000;border-radius:4px'></div><div style='position:absolute;left:80%;top:-4px;width:2px;height:16px;background:#000'></div></div></div>" for n,v in secs)
    return f"""<div class='phone'>{SB}<div class='w' style='gap:12px'>
<div class='row'><div class='h' style='font-size:26px;flex:1'>Test Day</div><span class='chip'>Nov 18 · 21 days</span></div>
<div class='row' style='gap:18px'>{ring(0.78,132,12,tick=0.8,inner="<span class='h' style='font-size:40px;line-height:1'>78</span><span class='sub s13' style='font-family:Inter'>ready</span>")}
<div style='flex:1'><div class='h' style='font-size:19px'>Almost there</div><div class='sub s15'>The tick is the 80% pass mark. Air Brakes is holding you back.</div></div></div>
<div class='card' style='padding:6px 16px'>{bars}</div>
<div class='card row'><div style='flex:1'><div class='h s16'>Today's plan · 15 min</div><div class='sub s15'>Replay 3 mistakes, then Spring brakes</div></div><span style='font-size:22px'>›</span></div>
<div class='card'><div class='h s16'>Exam-day card</div><div class='s15' style='margin-top:4px'>Texas: Commercial Rules first (20 Q · 80%), then General Knowledge (50 · 80%). English only.</div><div class='sub s13' style='margin-top:4px'>Source: TX DPS · checked Oct 2026</div></div>
</div><div class='tab'><div>{ring(0.8,22,3,dot=True)}Learn</div><div>{xx(s=20,w=2)}Review · 6</div><div class='on'>{CAL}Test Day</div><div>{SPK}Cab Mode</div></div>{SAMPLE}</div>"""

def s_paywall():
    rows=[('Permit Pack','$14.99','All Permit lessons and full tests: General Knowledge, Air Brakes, Combination, plus TX Commercial Rules. Every state.',True),('All Endorsements','$19.99','HazMat, Tanker, Doubles/Triples, Passenger, School Bus',False),('One endorsement','$4.99','Just the one you need',False)]
    r=''.join(f"<div class='opt {'sel' if s else ''}' style='flex-direction:column;align-items:stretch;gap:2px'><div class='row'><span class='h' style='font-size:19px;flex:1'>{a}</span><span class='h' style='font-size:19px'>{p}</span></div><div class='sub s15'>{d}</div></div>" for a,p,d,s in rows)
    return f"""<div class='phone'>{SB}<div class='w' style='gap:12px'>
<div class='row'><span class='sub s15' style='flex:1'>You finished the free Air Brakes lesson.</span><span style='font-size:22px'>✕</span></div>
{LOCKUP(22,17)}<div class='h' style='font-size:34px;line-height:1.08'>Pay once.<br>Yours to keep.</div>
<div class='row s16' style='gap:16px'><span class='row' style='gap:4px'>{ck(s=18)} No ads</span><span class='row' style='gap:4px'>{ck(s=18)} No auto-renew</span><span class='row' style='gap:4px'>{ck(s=18)} No trial</span></div>
{r}
<div class='s15' style='padding:2px 4px'>Everything: <b>$34.98 once</b>. Your free lesson and practice test in every unit stay free.</div>
<div class='sp'></div><div class='btn p'>Buy Permit Pack · $14.99</div>
<div class='row s15' style='justify-content:space-between'><span style='text-decoration:underline'>Restore purchases</span><span class='sub'>Family Sharing on iPhone</span></div></div>{SAMPLE}</div>"""

def s_cab():
    return f"""<div class='phone' style='background:#000;color:#fff'><div class='sb' style='color:#fff'><span>9:41</span><span>●●● ▮</span></div><div class='w' style='gap:16px'>
<div class='row s15' style='font-family:Inter;color:#BDBDBD'><span style='flex:1'>Cab Mode · Air Brakes</span><span>1.0×</span></div>
<div style='border:1.5px solid #fff;border-radius:12px;padding:10px 14px;font-size:16px'>Listen only. Don't use the screen while driving.</div>
<div style='font-size:34px;line-height:1.22;font-weight:700'>The low air warning must come on before tank pressure drops below about…</div>
<div style='font-size:24px;line-height:1.5;color:#D6D6D6'>A · 40 psi<br>B · 60 psi<br>C · 80 psi<br>D · 100 psi</div>
<div class='sp'></div>
<div class='row s15' style='color:#BDBDBD;font-family:Inter'><div style='flex:1;height:6px;background:#333;border-radius:3px'><div style='width:45%;height:100%;background:#fff;border-radius:3px'></div></div>7 / 25</div>
<div class='row' style='gap:14px'><div class='btn' style='flex:1;min-height:128px;background:#000;color:#fff;border:2px solid #fff;flex-direction:column;font-size:22px'><span style='font-size:30px'>❚❚</span>Pause</div><div class='btn' style='flex:1;min-height:128px;background:#fff;color:#000;border-color:#fff;flex-direction:column;font-size:22px'><span style='font-size:30px'>▶▶</span>Next</div></div>
</div><div class='sample' style='background:#000;color:#aaa;border-color:#333'>Sample content · mock</div></div>"""

SCREENS=[('01-onboarding-placement',s_onboard),('02-home-lesson-path',s_home),('03-lesson-intro',s_intro),('04-question',s_question),('05-proof-sheet',s_proof),('06-lesson-complete',s_complete),('07-review-mistakes',s_review),('08-readiness-test-day',s_testday),('09-paywall',s_paywall),('10-cab-mode',s_cab)]
def shot(f,png,w,h,scale): subprocess.run([CH,'--headless=new','--no-sandbox','--hide-scrollbars',f'--force-device-scale-factor={scale}',f'--window-size={w},{h}',f'--screenshot={png}','file://'+f],check=True,capture_output=True)
if __name__=='__main__':
    for n,fn in SCREENS:
        f=os.path.join(S,n+'.html'); open(f,'w').write(page(fn())); shot(f,os.path.join(P,n+'.png'),393,852,2)
    cells=''.join(f"<figure style='margin:0'><img src='../png/{n}.png' style='width:280px;border-radius:20px;border:1px solid #ddd;display:block'><figcaption style='font:500 14px Inter;margin-top:6px;color:#555'>{n}</figcaption></figure>" for n,_ in SCREENS)
    html=f"<html><body style='margin:0;background:#fff;font-family:Inter'><div style='padding:36px 40px'><div style='font-size:30px;font-weight:600;letter-spacing:-.03em'>Steady CDL · v2 lessons product, flat black & white</div><div style='font-size:15px;color:#555;margin:4px 0 22px'>Oct 28, 2026 · sample content · name: Steady CDL</div><div style='display:grid;grid-template-columns:repeat(5,280px);gap:24px'>{cells}</div></div></body></html>"
    f=os.path.join(S,'contact-v2.html'); open(f,'w').write(html); shot(f,os.path.join(P,'contact-sheet-v2.png'),40*2+5*280+4*24,1390,1)
