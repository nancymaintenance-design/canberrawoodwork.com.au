const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const sourceRoot = 'E:/Download';
const destination = path.resolve(process.cwd(), 'public/assets');
const jobs = [
  ['木工在 Canberra 住宅现场施工的自然工作照.png', 'carpenter-at-work-canberra.webp', 1440, 810],
  ['完成后的木露台整体.png', 'completed-timber-deck-canberra.webp', 1440, 810],
  ['露台板材、收边或固定件细.png', 'timber-deck-detail-canberra.webp', 960, 720],
  ['木门、门框维修后整体.png', 'timber-door-frame-repair-canberra.webp', 1440, 810],
  ['门铰链、门锁侧间隙或修补接缝细节.png', 'door-hinge-frame-detail-canberra.webp', 960, 720],
  ['木窗窗台或窗框维修后整体.png', 'timber-window-repair-canberra.webp', 1440, 810],
  ['窗台排水坡度、收边或修补木材细.png', 'timber-window-sill-detail-canberra.webp', 960, 720],
  ['腐烂木材切除或替换过程.png', 'timber-rot-removal-canberra.webp', 1440, 960],
  ['修补完成的木构件细节.png', 'repaired-timber-detail-canberra.webp', 960, 720],
  ['木围栏或木门维修后整体.png', 'timber-fence-gate-canberra.webp', 1440, 810],
];

async function main() {
  fs.mkdirSync(destination, { recursive: true });
  for (const [sourceName, outputName, width, height] of jobs) {
    const source = path.join(sourceRoot, sourceName);
    if (!fs.existsSync(source)) throw new Error(`Missing supplied image: ${source}`);
    await sharp(source)
      .resize({ width, height, fit: 'cover', position: 'attention', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(path.join(destination, outputName));
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
