# Final Steady CDL lockups: outlined Inter SemiBold (HarfBuzz-shaped, kerned) + ring-and-dot mark.
import os, sys, math, subprocess, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT=os.path.join(D,'final'); CH=os.environ.get('CHROME','/usr/bin/google-chrome')
sys.path.insert(0,os.path.join(D,'src')); import icon as I
FONT=os.path.join(os.environ.get('TMPDIR','/tmp'),'inter-semibold.ttf')
if not os.path.exists(FONT):
    from fontTools.varLib import instancer
    instancer.instantiateVariableFont(TTFont(os.environ.get('INTER_VF','/usr/share/fonts/truetype/sand-box/google/Inter/Inter-VariableFont_opsz,wght.ttf')),{'wght':600,'opsz':32}).save(FONT)
TT=TTFont(FONT); GS=TT.getGlyphSet(); UPM=TT['head'].unitsPerEm; CAP=TT['OS/2'].sCapHeight
blob=hb.Blob.from_file_path(FONT); FACE=hb.Face(blob); HBF=hb.Font(FACE)
# Tuning (font units, UPM=2048 scale): tracking per word + optical pair tweaks
TRACK={'Steady':-0.030,'CDL':0.010}       # em; caps get slightly open tracking, lowercase tighter
SPACE=0.24                                # word space in em (Inter default ~0.26); slightly tighter
PAIR={('S','t'):-0.004,('d','y'):-0.006,('C','D'):0.004,('D','L'):0.0}  # extra em after kerning
def word_paths(text,x0,size):
    buf=hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(HBF,buf,{'kern':True})
    s=size/UPM; x=x0; out=[]; names=[TT.getGlyphName(i.codepoint) for i in buf.glyph_infos]
    for k,(inf,pos) in enumerate(zip(buf.glyph_infos,buf.glyph_positions)):
        g=names[k]; pen=SVGPathPen(GS); GS[g].draw(TransformPen(pen,(s,0,0,-s,x+pos.x_offset*s,0)))
        out.append(pen.getCommands())
        x+=pos.x_advance*s+TRACK[text]*size
        if k+1<len(text): x+=PAIR.get((text[k],text[k+1]),0)*size
    return ' '.join(out), x-TRACK[text]*size
def wordmark(size):  # returns path d (baseline y=0), width
    a,xa=word_paths('Steady',0,size); b,xb=word_paths('CDL',xa+SPACE*size,size); return a+' '+b, xb
def mark(cx,cy,diam,fg,small=False):
    p=I.SMALL if small else I.MASTER; R,sw,rd,sp=p['R'],p['sw'],p['rd'],p['space']; k=diam/(2*R+sw)
    R,sw,rd,sp=R*k,sw*k,rd*k,sp*k; gap=72.0; cap=math.degrees((sw/2)/R)
    P=lambda d:(cx+R*math.sin(math.radians(d)),cy-R*math.cos(math.radians(d)))
    x0,y0=P(gap+cap); x1,y1=P(360-cap); xd,yd=P(gap-math.degrees((sw/2+sp+rd)/R))
    return (f"<path d='M{x0:.2f} {y0:.2f}A{R:.2f} {R:.2f} 0 1 1 {x1:.2f} {y1:.2f}' fill='none' stroke='{fg}' stroke-width='{sw:.2f}' stroke-linecap='round'/>"
            f"<circle cx='{xd:.2f}' cy='{yd:.2f}' r='{rd:.2f}' fill='{fg}'/>")
# Proportions (all relative to type size S):
#  horizontal: mark diameter = 1.32 x cap height, centred on cap-height midline; gap mark->text = 0.30 x mark diameter
#  stacked: mark diameter = 0.42 x wordmark width; gap = 0.30 x mark diameter
#  clearspace X = mark diameter x 0.25 (about one dot diameter + a bit) on every side
S=200
def svg(w,h,body,bg=None):
    r=f"<rect width='{w:.0f}' height='{h:.0f}' fill='{bg}'/>" if bg else ''
    return f"<svg xmlns='http://www.w3.org/2000/svg' width='{w:.0f}' height='{h:.0f}' viewBox='0 0 {w:.0f} {h:.0f}'>{r}{body}</svg>"
def horizontal(fg,bg=None,guides=False):
    capH=CAP/UPM*S; dm=1.32*capH; X=0.5*dm; g=0.30*dm
    d,ww=wordmark(S); W=X+dm+g+ww+X; H=X+dm+X; cy=X+dm/2; base=cy+capH/2
    body=mark(X+dm/2,cy,dm,fg)+f"<path transform='translate({X+dm+g:.2f} {base:.2f})' d='{d}' fill='{fg}'/>"
    return svg(W,H,body,bg),W,H
def stacked(fg,bg=None):
    d,ww=wordmark(S); dm=0.36*ww; capH=CAP/UPM*S; X=0.5*dm; g=0.30*dm
    W=X+ww+X; H=X+dm+g+capH+X+0.05*S
    body=mark(W/2,X+dm/2,dm,fg)+f"<path transform='translate({X:.2f} {X+dm+g+capH:.2f})' d='{d}' fill='{fg}'/>"
    return svg(W,H,body,bg),W,H
def icon_only(fg,bg,size=1024,small=False):
    return svg(size,size,mark(size/2,size/2,size*0.613,fg,small),bg),size,size
def mark_only(fg):
    dm=800; X=0.5*dm*0.5; W=dm+2*X
    return svg(W,W,mark(W/2,W/2,dm,fg)),W,W
def png(svgtxt,path,w,h,scale=1):
    f=path.replace('.png','.html')
    open(f,'w').write(f"<html><body style='margin:0;background:transparent'>{svgtxt}</body></html>")
    subprocess.run([CH,'--headless=new','--no-sandbox','--hide-scrollbars','--default-background-color=00000000',f'--force-device-scale-factor={scale}',f'--window-size={int(round(w))},{int(round(h))}',f'--screenshot={path}','file://'+f],check=True,capture_output=True); os.remove(f)
if __name__=='__main__':
    V=[('black-on-white','#000000','#FFFFFF'),('white-on-black','#FFFFFF','#000000')]
    for tag,fg,bg in V:
        for name,fn in [('horizontal',horizontal),('stacked',stacked)]:
            t,w,h=fn(fg); open(f'{OUT}/steady-cdl-{name}-{tag}.svg','w').write(t)   # SVG: transparent, art only
            tb,_,_=fn(fg,bg); png(tb,f'{OUT}/steady-cdl-{name}-{tag}.png',w,h,2)  # PNG: on its background, 2x
        t,w,h=icon_only(fg,bg); open(f'{OUT}/steady-cdl-icon-{tag}.svg','w').write(t); png(t,f'{OUT}/steady-cdl-icon-{tag}.png',w,h)
        t,w,h=mark_only(fg); open(f'{OUT}/steady-cdl-mark-only-{tag}.svg','w').write(t)
        tb=t.replace("viewBox",f"style='background:{bg}' viewBox"); png(tb,f'{OUT}/steady-cdl-mark-only-{tag}.png',w,h)
    # app icon set (black on white), small sizes use the optimized mark
    for px in (1024,180,60,29):
        t,_,_=icon_only('#000000','#FFFFFF',1024,small=px<=64); t=t.replace("width='1024' height='1024'",f"width='{px}' height='{px}'",1)
        png(t,f'{OUT}/app-icon-{px}.png',px,px)
    open(f'{OUT}/app-icon-master-1024.svg','w').write(icon_only('#000000','#FFFFFF')[0])
    open(f'{OUT}/app-icon-small-optimized.svg','w').write(icon_only('#000000','#FFFFFF',small=True)[0])
    print('ok')
