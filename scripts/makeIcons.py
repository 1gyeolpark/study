# 파비콘과 공유 미리보기 이미지 만들기. 원본 그림은 인자로 받음

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

src = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / 'public'
out.mkdir(exist_ok=True)

im = Image.open(src).convert('RGBA')
alpha = im.split()[3]
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
logo = im.crop(bbox)

# 정사각형 캔버스에 여백을 두고 가운데 배치
def square(img, size, pad, bg=(0, 0, 0, 0)):
    side = max(img.size)
    canvas = Image.new('RGBA', (side, side), bg)
    canvas.alpha_composite(img, ((side - img.width) // 2, (side - img.height) // 2))
    inner = int(size * (1 - pad * 2))
    canvas = canvas.resize((inner, inner), Image.LANCZOS)
    final = Image.new('RGBA', (size, size), bg)
    final.alpha_composite(canvas, ((size - inner) // 2, (size - inner) // 2))
    return final

square(logo, 32, 0.04).save(out / 'favicon-32x32.png')
square(logo, 16, 0.02).save(out / 'favicon-16x16.png')
square(logo, 256, 0.04).save(out / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
square(logo, 180, 0.12, (255, 255, 255, 255)).convert('RGB').save(out / 'apple-touch-icon.png')

# 공유 미리보기 1200x630
W, H = 1200, 630
card = Image.new('RGB', (W, H), (11, 110, 143))
d = ImageDraw.Draw(card)
bold = 'C:/Windows/Fonts/malgunbd.ttf'
regular = 'C:/Windows/Fonts/malgun.ttf'
d.text((90, 190), 'hg-study', font=ImageFont.truetype(bold, 56), fill=(207, 230, 238))
d.text((90, 270), 'Study Notes', font=ImageFont.truetype(bold, 92), fill=(255, 255, 255))
d.text((90, 410), '풀스택 개발 공부', font=ImageFont.truetype(regular, 40), fill=(207, 230, 238))
panel = square(logo, 380, 0.08, (255, 255, 255, 255)).convert('RGB')
card.paste(panel, (W - 380 - 70, (H - 380) // 2))
card.save(out / 'og.png', optimize=True)

print('만듦:', sorted(p.name for p in out.iterdir() if p.is_file()))
