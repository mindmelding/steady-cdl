# 3 App Store screenshots, 1290x2796 (6.9"), flat black & white. Run after build_v2.py.
import os, sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import build_v2 as B
D=B.D; S=B.S; O=os.path.join(D,'store')
SHOTS=[('01-pay-once',B.s_paywall,'Pay once.<br>No auto-renew.','No ads. No trial. No subscription.'),
       ('02-your-state',B.s_testday,"Matches your<br>state's real test.",'Right tests, right order, right pass mark.'),
       ('03-sources',B.s_proof,'Every answer<br>shows its source.','The rule, its source, the date checked.')]
for n,fn,h,sub in SHOTS:
    body=fn().replace(B.SAMPLE,'').replace("<div class='sample' style='background:#000;color:#aaa;border-color:#333'>Sample content · mock</div>",'')
    f=os.path.join(S,'store-'+n+'-screen.html'); open(f,'w').write(B.page(body)); scr=os.path.join(O,'_'+n+'-screen.png'); B.shot(f,scr,393,852,3)
    # 430x932 canvas @3x = 1290x2796. Phone: 340 wide (screen 393x852 scaled .865)
    html=f"""<!doctype html><html><head><meta charset='utf-8'><style>*{{margin:0;box-sizing:border-box}}body{{width:430px;height:932px;background:#fff;font-family:Inter;overflow:hidden;position:relative}}</style></head><body>
<div style='padding:62px 34px 0'>
<div style="font:600 40px/1.06 Inter;letter-spacing:-0.035em;color:#000">{h}</div>
<div style="font:400 17px/1.35 'Atkinson Hyperlegible';color:#4A4A4A;margin-top:14px">{sub}</div></div>
<div style='position:absolute;left:50%;top:232px;transform:translateX(-50%);width:318px;height:672px;border-radius:50px;background:#000;padding:8px'>
<div style='width:302px;height:656px;border-radius:43px;overflow:hidden;background:#fff'><img src='{os.path.basename(scr)}' style='width:302px;display:block'></div></div>
<div style='position:absolute;right:14px;bottom:6px;font:500 9px Inter;color:#9a9a9a'>Draft · sample content</div>
</body></html>"""
    hf=os.path.join(O,'_'+n+'.html'); open(hf,'w').write(html); B.shot(hf,os.path.join(O,f'appstore-{n}-1290x2796.png'),430,932,3); os.remove(hf)
print('ok')
