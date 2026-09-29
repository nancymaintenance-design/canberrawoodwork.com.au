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
  ['橱柜门、抽屉或定制储物柜完成面.png', 'cabinet-storage-canberra.webp', 1440, 810],
  ['铰链、抽屉轨道、边封或柜体收边细节.png', 'cabinet-hardware-detail-canberra.webp', 960, 720],
  ['楼梯及扶手整体.png', 'timber-stairs-handrail-canberra.webp', 1440, 810],
  ['扶手固定点、踏步边缘或收口细节.png', 'handrail-stair-detail-canberra.webp', 960, 720],
  ['踢脚线、门套或室内木收边完成面.png', 'skirting-architrave-canberra.webp', 1440, 810],
  ['拼角、收口、线条或地面交接细节.png', 'skirting-architrave-detail-canberra.webp', 960, 720],
  ['木挂板、檐板或外墙木构维修后整体.png', 'weatherboard-exterior-canberra.webp', 1440, 810],
  ['木挂板搭接、窗边收边或木材连接细节.png', 'weatherboard-window-detail-canberra.webp', 960, 720],
  ['Pergola、verandah 或室外梁柱整体.png', 'pergola-verandah-canberra.webp', 1440, 810],
  ['梁柱连接、檐板或屋檐修补细节.png', 'fascia-pergola-detail-canberra.webp', 960, 720],
  ['围栏立柱、横梁、铰链或门闩细节.png', 'fence-gate-hardware-detail-canberra.webp', 960, 720],
  ['现场量尺、检查木构或工具作业照.png', 'measuring-timber-work-canberra.webp', 1440, 960],
  ['窗框、窗台腐烂或进水修复前状态.png', 'water-damaged-window-sill-before.webp', 960, 720],
  ['地板下露台下的梁、搁栅或承重木构检查照.png', 'under-deck-timber-assessment.webp', 1440, 960],
  ['木门门框维修前的损坏状态.png', 'deteriorated-timber-frame-before.webp', 960, 720],
  ['施工人员与客户住宅外观的自然远景.png', 'carpenter-arrival-canberra.webp', 1440, 810],
  ['室内搁板、墙板或翻新木工完成面.png', 'interior-joinery-canberra.webp', 1440, 810],
  ['小型木工维修前后对比.png', 'small-carpentry-gate-before-after.webp', 1440, 810],
  ['新露台施工中的框架、搁栅或结构过程.png', 'new-deck-framing-canberra.webp', 1440, 960],
  ['新露台完成整体照（与现有露台不同角度）.png', 'new-deck-completed-canberra.webp', 1440, 810],
  ['Fascia、eaves 或 weatherboard 的高空近景施工照.png', 'fascia-eaves-repair-process.webp', 1440, 960],
  ['Pergola 或 verandah 木柱底部维修前后对比.png', 'pergola-post-base-repair.webp', 960, 720],
  ['工具、测量、木料准备的自然工作照.png', 'carpenter-timber-preparation-canberra.webp', 1440, 810],
  ['木窗台门框施工中的切除、补木、固定过程.png', 'timber-window-frame-repair-process.webp', 960, 720, { extract: { left: 0, top: 50, width: 1150, height: 900 }, position: 'left' }],
  ['木门或窗框“维修完成后”的同角度对比图.png', 'completed-timber-door-frame-detail.webp', 960, 720],
  ['围栏或大门施工过程照.png', 'timber-fence-installation-canberra.webp', 1440, 960],
];

async function main() {
  fs.mkdirSync(destination, { recursive: true });
  for (const [sourceName, outputName, width, height, options = {}] of jobs) {
    const source = path.join(sourceRoot, sourceName);
    const target = path.join(destination, outputName);
    if (fs.existsSync(target)) continue;
    if (!fs.existsSync(source)) throw new Error(`Missing supplied image: ${source}`);
    let transform = sharp(source);
    if (options.extract) transform = transform.extract(options.extract);
    await transform
      .resize({ width, height, fit: 'cover', position: options.position || 'attention', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(target);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
