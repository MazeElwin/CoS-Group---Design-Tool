const HAVEN_RES_ROOT = 'http://game.havenandhearth.com/res';

const fs = await import('node:fs/promises');
const appSource = await fs.readFile('app.js', 'utf8');
const catalogMatch = appSource.match(/const objectCatalog = (\{[\s\S]*?\n\});/);
if (!catalogMatch) throw new Error('Could not find objectCatalog in app.js');

const objectCatalog = Function(`return (${catalogMatch[1]});`)();

const knownPaths = {
  'Extraction Press': 'gfx/terobjs/expeller',
  'Food Trough': 'gfx/terobjs/trough',
  'Garden Shed': 'gfx/terobjs/arch/gardenshed',
  "Gemcutter's Wheel": 'gfx/terobjs/gemwheel',
  Kicksled: 'gfx/terobjs/vehicle/spark',
  'Metal Cauldron': 'gfx/terobjs/cauldron',
  Milestone: 'gfx/terobjs/milestone',
  Roadsing: 'gfx/terobjs/roadsign',
  'Statue of the Chieftain': 'gfx/terobjs/chieftainstatue',
  'Stone Column': 'gfx/terobjs/stonecolumn',
  'Stone Table': 'gfx/terobjs/furn/stonetable',
  'Sturdy Bed': 'gfx/terobjs/furn/sturdybed',
  Trellis: 'gfx/terobjs/trallis',
  'Village Banner': 'gfx/terobjs/vbanner',
  Windmill: 'gfx/terobjs/arch/windmill'
};

const prefixes = [
  'gfx/terobjs/arch',
  'gfx/terobjs',
  'gfx/terobjs/vehicle',
  'gfx/terobjs/furn',
  'gfx/terobjs/items',
  'gfx/terobjs/siege',
  'gfx/terobjs/village',
  'gfx/terobjs/pow',
  'gfx/terobjs/bumlings'
];

function slugParts(label, fileName) {
  const fileSlug = fileName.replace(/\.json$/i, '');
  const labelSlug = label.replace(/'/g, '').replace(/[^a-z0-9]+/gi, '').toLowerCase();
  const compactWords = label.replace(/'/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return [...new Set([
    fileSlug,
    labelSlug,
    compactWords.join(''),
    compactWords.join('-')
  ].filter(Boolean))];
}

async function exists(path) {
  const url = `${HAVEN_RES_ROOT}/${path}.res`;
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const signature = Buffer.from(await response.arrayBuffer()).subarray(0, 16).toString('ascii');
    return signature === 'Haven Resource 1';
  } catch {
    return false;
  }
}

const found = {};
const missing = [];

for (const [label, fileName] of Object.entries(objectCatalog)) {
  if (knownPaths[label] && await exists(knownPaths[label])) {
    found[label] = { fileName, path: knownPaths[label] };
    console.log(`FOUND ${label}: ${knownPaths[label]} (known)`);
    continue;
  }

  const candidates = [];
  for (const slug of slugParts(label, fileName)) {
    for (const prefix of prefixes) candidates.push(`${prefix}/${slug}`);
  }

  let matched = null;
  for (const candidate of [...new Set(candidates)]) {
    if (await exists(candidate)) {
      matched = candidate;
      break;
    }
  }

  if (matched) {
    found[label] = { fileName, path: matched };
    console.log(`FOUND ${label}: ${matched}`);
  } else {
    missing.push(label);
    console.log(`MISS  ${label}`);
  }
}

await fs.writeFile('haven-object-map.json', JSON.stringify({ found, missing }, null, 2));
console.log(JSON.stringify({ found: Object.keys(found).length, missing: missing.length, output: 'haven-object-map.json' }, null, 2));
