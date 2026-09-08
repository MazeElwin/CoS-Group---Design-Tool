const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const GLOBALS_URL = 'https://carrygun.gitlab.io/hmdt/scripts/globals.js';
const TEXTURE_ROOT = 'https://carrygun.gitlab.io/hmdt/textures';

const typeMap = {
  0: ['WoodOuter', 'woodouter'],
  1: ['WoodInner', 'woodinner'],
  2: ['Thatching', 'thatching'],
  3: ['Stone', 'stone'],
  4: ['Metal', 'metal'],
  5: ['Cloth', 'cloth'],
  6: ['Clay', 'clay'],
  7: ['Paving', 'paving'],
  8: ['Gem', 'gems'],
  9: ['Brick', 'brick'],
  99: ['Extra', 'extra']
};

async function main() {
  const globals = await fetch(GLOBALS_URL).then((response) => {
    if (!response.ok) throw new Error(`${response.status} ${GLOBALS_URL}`);
    return response.text();
  });

  const match = globals.match(/const G_RESOURCES = (\{[\s\S]*?\n\})\s*\/\/ Inventory items/);
  if (!match) throw new Error('Could not find G_RESOURCES in CarryGun globals.js');

  const resources = Function(`return (${match[1]});`)();
  const manifest = {};
  let downloaded = 0;
  let existed = 0;
  const failed = [];

  for (const [id, entries] of Object.entries(resources)) {
    const meta = typeMap[id];
    if (!meta) continue;

    const [type, dir] = meta;
    manifest[type] = Object.keys(entries);
    const outDir = path.join(ROOT, 'assets', 'textures', dir);
    fs.mkdirSync(outDir, { recursive: true });

    for (const [name, fileName] of Object.entries(entries)) {
      const outPath = path.join(outDir, fileName);
      if (fs.existsSync(outPath)) {
        existed++;
        continue;
      }

      const url = `${TEXTURE_ROOT}/${dir}/${fileName}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(String(response.status));
        fs.writeFileSync(outPath, Buffer.from(await response.arrayBuffer()));
        downloaded++;
      } catch (error) {
        failed.push(`${type}: ${name} (${fileName}) - ${error.message}`);
      }
    }
  }

  fs.writeFileSync(
    path.join(ROOT, 'assets', 'texture-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  console.log(JSON.stringify({
    types: Object.fromEntries(Object.entries(manifest).map(([type, names]) => [type, names.length])),
    downloaded,
    existed,
    failedCount: failed.length,
    failed
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
