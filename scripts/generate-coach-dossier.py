"""Build the fictional two-page coach dossier using embedded fonts."""
from pathlib import Path
from io import BytesIO
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets/demos/dossier-marcos-rivera.pdf'
FONT_ROOT = Path('/usr/share/fonts/truetype/dejavu')
for name, filename in [('DossierSans','DejaVuSans.ttf'),('DossierBold','DejaVuSans-Bold.ttf'),('DossierSerif','DejaVuSerif.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT_ROOT / filename)))
FONTS = {'Helvetica':'DossierSans','Helvetica-Bold':'DossierBold','Times-Roman':'DossierSerif','Times-Italic':'DossierSerif'}
W,H = A4
c = canvas.Canvas(str(OUTPUT),pagesize=A4)
c.setTitle('Marcos Rivera - Dossier de ejemplo')
c.setAuthor('Agent Authority')
CREAM,INK,COPPER,MUTED,LINE = '#f7f5ee','#202f3c','#aa573b','#5d6b70','#d6d5c9'
def rect(x,y,w,h,color):
    c.setFillColor(HexColor(color));c.rect(x,y,w,h,fill=1,stroke=0)
def text(x,y,t,size=10,color=INK,font='Helvetica'):
    c.setFillColor(HexColor(color));c.setFont(FONTS[font],size);c.drawString(x,y,t)
def paragraph(x,y,w,t,size=10,color=INK):
    p=Paragraph(t,ParagraphStyle('p',fontName='DossierSans',fontSize=size,leading=size*1.6,textColor=HexColor(color)))
    _,height=p.wrap(w,500);p.drawOn(c,x,y-height);return height
def base(n,section):
    rect(0,0,W,H,CREAM)
    text(42,H-42,'MR / MARCOS RIVERA',11,font='Helvetica-Bold')
    text(42,H-60,'DIRECTOR TÉCNICO / DOSSIER ILUSTRATIVO',7,color=MUTED)
    text(W-135,H-42,section,7,color=COPPER)
    c.setStrokeColor(HexColor(LINE));c.line(42,52,W-42,52)
    text(42,35,'DEMO / Persona, clubes, foto y logros ficticios.',7,color=MUTED)
    text(W-82,35,f'{n} / 02',7)

base(1,'EL RECORRIDO')
text(42,707,'Un equipo.',32,font='Times-Roman')
text(42,663,'Una idea.',32,font='Times-Roman')
text(42,619,'Una identidad.',29,color=COPPER,font='Times-Italic')
paragraph(42,579,260,'El fútbol que imaginamos empieza mucho antes del primer silbato.',11,MUTED)
portrait = BytesIO()
with Image.open(ROOT/'assets/demos/coach-editorial.webp') as photo:
    photo.convert('RGB').save(portrait,format='JPEG',quality=85,optimize=True)
portrait.seek(0)
c.drawImage(ImageReader(portrait),330,521,223,240,preserveAspectRatio=True,anchor='c',mask='auto')
rect(42,456,511,48,'#e9e5da')
text(58,475,'10 temporadas',11,font='Helvetica-Bold')
text(235,475,'03 clubes',11,font='Helvetica-Bold')
text(405,475,'02 títulos',11,font='Helvetica-Bold')
text(42,419,'Cada escudo, una etapa.',23,font='Times-Roman')
rows=[('2023 - 2026','Puerto Sur FC','Director técnico / Primer equipo','Liga del Sur - 2024'),('2020 - 2023','Atlético Delta','Director técnico / Primer equipo','Copa Ciudad del Delta - 2021'),('2016 - 2020','Unión Sierra','Formación / Reserva / Primer equipo','Desarrollo de talento')]
for i,(years,club,role,achievement) in enumerate(rows):
    y=366-i*82;c.setStrokeColor(HexColor(LINE));c.line(42,y+27,553,y+27)
    text(42,y,years,9);text(175,y+2,club,17,font='Times-Roman')
    text(175,y-17,role,9,MUTED);text(175,y-35,achievement,8,COPPER)
paragraph(42,110,500,'Un perfil preparado para explicar trayectoria, modelo de juego y metodología en una reunión. Este dossier muestra la estructura; la versión de cada profesional se arma con su material real.',9,MUTED)
c.showPage()
base(2,'MODELO Y MÉTODO')
text(42,742,'La idea necesita un método.',27,font='Times-Roman')
paragraph(42,713,500,'Principios de juego y una semana de trabajo conectados con el próximo partido.',11,MUTED)
rect(42,427,232,240,'#263f39')
c.setStrokeColor(HexColor('#8ea398'));c.setLineWidth(.6);c.rect(58,449,200,194,fill=0)
c.line(58,546,258,546);c.circle(158,546,25,fill=0);c.rect(114,449,88,34,fill=0);c.rect(114,609,88,34,fill=0)
positions=[[50,90],[16,67],[38,73],[62,73],[84,67],[50,57],[32,43],[68,43],[12,21],[50,17],[88,21]]
for (x,y),number in zip(positions,[1,3,6,2,4,5,8,10,11,9,7]):
    px=58+x/100*200;py=643-y/100*194
    c.setFillColor(HexColor('#d9ddbd'));c.circle(px,py,8,fill=1,stroke=0)
    c.setFillColor(HexColor(INK));c.setFont('DossierSans',7);c.drawCentredString(px,py-2,str(number))
text(292,642,'4 - 3 - 3 / CON PELOTA',10,COPPER,font='Helvetica-Bold')
for y,title,copy in [(604,'Amplitud','Extremos abiertos para generar espacio.'),(546,'Conexión','Apoyos interiores para conectar líneas.'),(488,'Profundidad','Atacar el espacio con intención.')]:
    text(292,y,title,16,font='Times-Roman');paragraph(292,y-11,240,copy,9,MUTED)
text(42,387,'Microciclo de ejemplo',23,font='Times-Roman')
text(42,367,'MD = día de partido / Exigencia relativa ilustrativa (1 a 5)',8,MUTED)
week=[('MD-4','Construir','Salida y ocupación de espacios',4),('MD-3','Intensificar','Presión y coordinación',5),('MD-2','Ajustar','Plan del rival y roles por sector',3),('MD-1','Afinar','Pelota parada y acuerdos',2),('MD','Competir','Observar, ajustar y sostener la idea',5)]
for i,(day,title,focus,load) in enumerate(week):
    y=322-i*42;rect(42,y-12,511,40,'#e9e5da' if i%2==0 else CREAM)
    text(52,y+2,day,9,COPPER,font='Helvetica-Bold');text(113,y+2,title,10,font='Helvetica-Bold');text(228,y+2,focus,8,MUTED)
    for j in range(5):rect(493+j*8,y,5,8,COPPER if j<load else LINE)
paragraph(42,91,500,'Planificación ficticia para mostrar cómo comunicar una metodología. La semana de cada cuerpo técnico se adapta a su contexto y a sus materiales.',8,MUTED)
c.save()
print(OUTPUT)
