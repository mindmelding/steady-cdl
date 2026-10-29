# Progress-ring icon: 80% arc (72deg gap) + solid dot at the end of the gap. Black on white, flat.
import math, os, subprocess
D=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT=os.path.join(D,'icon')
CH=os.environ.get('CHROME','/usr/bin/google-chrome')
def pt(cx,cy,R,deg):  # clock angle: 0 = 12 o'clock, clockwise
    a=math.radians(deg); return cx+R*math.sin(a), cy-R*math.cos(a)
def ring(R,sw,rd,space,gap=72.0,size=1024,bg='#FFFFFF',fg='#000000',corner=0):
    cx=cy=size/2; cap=math.degrees((sw/2)/R)
    a0,a1=gap+cap,360-cap
    x0,y0=pt(cx,cy,R,a0); x1,y1=pt(cx,cy,R,a1)
    dd=gap-math.degrees((sw/2+space+rd)/R)        # dot centre: 'space' px clear of the arc's cap
    xd,yd=pt(cx,cy,R,dd)
    rect=f"<rect width='{size}' height='{size}' rx='{corner}' fill='{bg}'/>"
    return (f"<svg xmlns='http://www.w3.org/2000/svg' width='{size}' height='{size}' viewBox='0 0 {size} {size}'>{rect}"
            f"<path d='M{x0:.2f} {y0:.2f} A{R} {R} 0 1 1 {x1:.2f} {y1:.2f}' fill='none' stroke='{fg}' stroke-width='{sw}' stroke-linecap='round'/>"
            f"<circle cx='{xd:.2f}' cy='{yd:.2f}' r='{rd}' fill='{fg}'/></svg>"), dict(R=R,sw=sw,rd=rd,space=space,gap=gap,dot_deg=round(dd,1),outer_diam=2*R+sw)
MASTER=dict(R=268,sw=92,rd=46,space=20)      # outer 628 px = 61% of 1024 (inside Apple's ~ 80% safe circle)
SMALL =dict(R=252,sw=132,rd=66,space=36)     # heavier stroke + bigger dot for 60/29 px
def png(svg,name,px):
    h=os.path.join(OUT,name+'.html'); a="width='1024' height='1024'"; b="width='%d' height='%d'"%(px,px)
    open(h,'w').write("<html><body style='margin:0'>"+svg.replace(a,b)+"</body></html>")
    subprocess.run([CH,'--headless=new','--no-sandbox','--hide-scrollbars','--force-device-scale-factor=1',f'--window-size={px},{px}',f'--screenshot={os.path.join(OUT,name+".png")}','file://'+h],check=True,capture_output=True); os.remove(h)
if __name__=='__main__':
    m,mi=ring(**MASTER); s,si=ring(**SMALL)
    open(os.path.join(OUT,'icon-master-1024.svg'),'w').write(m); open(os.path.join(OUT,'icon-small-optimized.svg'),'w').write(s)
    open(os.path.join(OUT,'icon-master-1024-rounded-preview.svg'),'w').write(ring(**MASTER,corner=230)[0])
    png(m,'icon-1024',1024); png(m,'icon-180',180); png(s,'icon-60',60); png(s,'icon-29',29)
    png(s,'icon-small-1024',1024)
    print('master',mi); print('small',si)
