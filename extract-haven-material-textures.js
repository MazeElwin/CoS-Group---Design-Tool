const HAVEN_RES_ROOT = 'http://game.havenandhearth.com/res';
const OUTPUT_ROOT = 'assets/textures';
const SIGNATURE = 'Haven Resource 1';

const fs = await import('node:fs/promises');
const appSource = await fs.readFile('app.js', 'utf8');
const optionsMatch = appSource.match(/const resourceOptions = (\{[\s\S]*?\n\});\n\nresourceOptions\.Paving/);
if (!optionsMatch) throw new Error('Could not find resourceOptions in app.js');

const resourceOptions = Function(`return (${optionsMatch[1]});`)();
const overridesMatch = appSource.match(/const textureFileOverrides = (\{[\s\S]*?\n\});/);
const textureFileOverrides = overridesMatch ? Function(`return (${overridesMatch[1]});`)() : {};

const texturePaths = {
  WoodOuter: 'woodouter',
  WoodInner: 'woodinner',
  Thatching: 'thatching',
  Stone: 'stone',
  Metal: 'metal',
  Cloth: 'cloth',
  Clay: 'clay',
  Paving: 'paving',
  Gem: 'gems',
  Brick: 'brick',
  Extra: 'extra'
};

const explicitResourceNames = {
  Almond: 'almondtree',
  Apple: 'appletree',
  'Bay Willow': 'baywillow',
  'Black Pine': 'blackpine',
  'Black Poplar': 'blackpoplar',
  Chestnut: 'chestnuttree',
  'Cork Oak': 'corkoak',
  'Golden Cloth': 'goldcloth',
  'Gray Alder': 'grayalder',
  "King's Oak": 'kingsoak',
  Pear: 'peartree',
  'Silver Fir': 'silverfir',
  'Stone Pine': 'stonepine',
  'Sweetgum': 'sweetgum',
  Walnut: 'walnuttree'
};

const thatchingResourceNames = {
  'Alder Bough': 'alderbough',
  'Elm Bough': 'elmbough',
  'Fir Bough': 'firbough',
  'Gray Alder': 'bough-grayalder',
  Linden: 'bough-linden',
  'Spruce Bough': 'sprucebough',
  Sweetgum: 'bough-sweetgum',
  Tar: 'tarsticks',
  'Yew Bough': 'yewbough'
};

const manifest = {};
const placeholderMaterials = {
  Stone: ['Bloodstone', 'Heavy Earth', 'Iron Ochre', 'Korund'],
  Cloth: ['Primitive Cloth']
};
const placeholderImage = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAUklEQVR42u3OQQ0AIBDAMMC/5+ONAvZoFSzZnKx95gDG3oADN+DAADgAAw7AgAMw4AAMOAADDsCAA7j2P3/b0d8MAE4sAADgAAw4AAMOwIADMNRBA/TyA20tnSzSAAAAAElFTkSuQmCC',
  'base64'
);

class Reader {
  constructor(buffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    this.offset = 0;
  }

  get done() {
    return this.offset >= this.buffer.length;
  }

  bytes(length) {
    if (this.offset + length > this.buffer.length) throw new Error(`Read past end at ${this.offset}`);
    const value = this.buffer.subarray(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  uint8() {
    return this.view.getUint8(this.offset++);
  }

  int16() {
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  int32() {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  string() {
    const start = this.offset;
    while (!this.done && this.buffer[this.offset] !== 0) this.offset++;
    if (this.done) throw new Error(`Unterminated string at ${start}`);
    const value = this.buffer.subarray(start, this.offset).toString('utf8');
    this.offset++;
    return value;
  }
}

function normalizeTextureName(name) {
  return `${name}`.replace(/'/g, '').replace(/:/g, '').replace(/\s+/g, '').toLowerCase() + '.jpg';
}

function outputFileNames(name) {
  const names = new Set([normalizeTextureName(name)]);
  if (textureFileOverrides[name]) names.add(textureFileOverrides[name]);
  names.add(normalizeTextureName(name).replace('bough', '').replace('clay', '').replace('brick', ''));
  if (name === "Potter's Clay" || name === "Potter's Brick") names.add('potter.jpg');
  return [...names].filter(Boolean);
}

function resourceSlug(name) {
  return explicitResourceNames[name] || normalizeTextureName(name).replace(/\.jpg$/, '');
}

function parseResource(buffer) {
  const reader = new Reader(buffer);
  const signature = reader.bytes(SIGNATURE.length).toString('ascii');
  if (signature !== SIGNATURE) throw new Error(`Unexpected signature: ${signature}`);

  reader.int16();
  const layers = [];
  while (!reader.done) {
    const type = reader.string();
    const size = reader.int32();
    const data = reader.bytes(size);
    layers.push({ type, data });
  }
  return layers;
}

function parseTexLayer(data) {
  const reader = new Reader(data);
  const id = reader.int16();
  reader.int16();
  reader.int16();
  reader.int16();
  reader.int16();

  while (!reader.done) {
    const type = reader.uint8();
    if (type === 0) return { id, image: reader.bytes(reader.int32()) };
    if (type === 4) reader.bytes(reader.int32());
    else if ([1, 2, 3].includes(type)) reader.uint8();
    else if (type !== 5) break;
  }

  return { id, image: null };
}

function parseImageLayer(data) {
  const reader = new Reader(data);
  reader.int16();
  reader.int16();
  const flags = reader.uint8();
  reader.int16();
  reader.int16();
  reader.int16();
  if (flags & 4) {
    while (!reader.done) {
      const key = reader.string();
      if (!key) break;
      let length = reader.uint8();
      if (length & 0x80) length = reader.int32();
      reader.bytes(length);
    }
  }
  return reader.bytes(data.length - reader.offset);
}

async function fetchResource(path) {
  const response = await fetch(`${HAVEN_RES_ROOT}/${path}.res`);
  if (!response.ok) return null;
  return parseResource(Buffer.from(await response.arrayBuffer()));
}

async function writeTexture(type, name, image) {
  const folder = `${OUTPUT_ROOT}/${texturePaths[type]}`;
  await fs.mkdir(folder, { recursive: true });
  for (const fileName of outputFileNames(name)) {
    await fs.writeFile(`${folder}/${fileName}`, image);
  }
  if (!manifest[type]) manifest[type] = [];
  manifest[type].push(name);
}

async function writePlaceholder(type, name) {
  if (manifest[type]?.includes(name)) return;
  await writeTexture(type, name, placeholderImage);
}

async function writeVariantTexture(type, variant, name, image) {
  const folder = `${OUTPUT_ROOT}/${texturePaths[type]}/${variant}`;
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(`${folder}/${normalizeTextureName(name)}`, image);
}

async function extractTreeTexture(type, name, wantedId) {
  const layers = await fetchResource(`gfx/terobjs/trees/${resourceSlug(name)}-tex`);
  if (!layers) return false;
  const textures = layers.filter((layer) => layer.type === 'tex').map((layer) => parseTexLayer(layer.data));
  const texture = textures.find((entry) => entry.id === wantedId);
  if (!texture?.image) return false;
  await writeTexture(type, name, texture.image);
  return true;
}

async function extractTreeObjectTexture(type, name, wantedId, resourceName = name) {
  const layers = await fetchResource(`gfx/terobjs/trees/${resourceSlug(resourceName)}`);
  if (!layers) return false;
  const textures = layers.filter((layer) => layer.type === 'tex').map((layer) => parseTexLayer(layer.data));
  const texture = textures.find((entry) => entry.id === wantedId);
  if (!texture?.image) return false;
  await writeTexture(type, name, texture.image);
  return true;
}

async function extractFirstTexture(type, name, candidates) {
  for (const candidate of candidates) {
    const layers = await fetchResource(candidate);
    if (!layers) continue;
    const texture = layers.find((layer) => layer.type === 'tex');
    if (!texture) continue;
    const parsed = parseTexLayer(texture.data);
    if (!parsed.image) continue;
    await writeTexture(type, name, parsed.image);
    return true;
  }
  return false;
}

async function extractFirstImage(type, name, candidates, variant = null) {
  for (const candidate of candidates) {
    const layers = await fetchResource(candidate);
    if (!layers) continue;
    const imageLayer = layers.find((layer) => layer.type === 'image');
    if (!imageLayer) continue;
    const image = parseImageLayer(imageLayer.data);
    await writeTexture(type, name, image);
    if (variant) await writeVariantTexture(type, variant, name, image);
    return true;
  }
  return false;
}

for (const name of resourceOptions.WoodOuter) {
  const ok = await extractTreeTexture('WoodOuter', name, 0);
  console.log(`${ok ? 'OK  ' : 'MISS'} WoodOuter ${name}`);
}

for (const name of resourceOptions.WoodInner) {
  const ok = await extractTreeTexture('WoodInner', name, 2);
  console.log(`${ok ? 'OK  ' : 'MISS'} WoodInner ${name}`);
}

for (const name of resourceOptions.Stone) {
  const slug = resourceSlug(name);
  const ok = await extractFirstTexture('Stone', name, [`gfx/terobjs/bumlings/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Stone ${name}`);
}

for (const name of resourceOptions.Gem) {
  const slug = resourceSlug(name);
  const ok = await extractFirstTexture('Gem', name, [`gfx/terobjs/bumlings/${slug}`, `gfx/invobjs/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Gem ${name}`);
}

for (const name of resourceOptions.Cloth) {
  const slug = resourceSlug(name);
  const ok = await extractFirstTexture('Cloth', name, [`gfx/terobjs/subst/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Cloth ${name}`);
}

for (const name of resourceOptions.Metal) {
  const slug = resourceSlug(name);
  const ok = await extractFirstTexture('Metal', name, [`gfx/terobjs/subst/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Metal ${name}`);
}

for (const name of resourceOptions.Clay) {
  const slug = resourceSlug(name);
  const ok = await extractFirstTexture('Clay', name, [`gfx/terobjs/subst/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Clay ${name}`);
}

for (const name of resourceOptions.Brick) {
  const slug = resourceSlug(name).replace(/brick$/, 'clay');
  const ok = await extractFirstTexture('Brick', name, [`gfx/terobjs/subst/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Brick ${name}`);
}

for (const name of resourceOptions.Thatching) {
  const slug = thatchingResourceNames[name] || resourceSlug(name);
  const ok = await extractFirstTexture('Thatching', name, [`gfx/terobjs/subst/${slug}`]);
  console.log(`${ok ? 'OK  ' : 'MISS'} Thatching ${name}`);
}

for (const [type, names] of Object.entries(placeholderMaterials)) {
  for (const name of names) {
    await writePlaceholder(type, name);
    console.log(`BLANK ${type} ${name}`);
  }
}

resourceOptions.Paving = [...(manifest.Stone || []), ...(manifest.Metal || []), ...(manifest.Brick || [])];
manifest.Paving = resourceOptions.Paving;
await fs.mkdir(`${OUTPUT_ROOT}/${texturePaths.Paving}`, { recursive: true });
for (const type of ['Stone', 'Metal', 'Brick']) {
  for (const name of manifest[type] || []) {
    for (const fileName of outputFileNames(name)) {
      await fs.copyFile(
        `${OUTPUT_ROOT}/${texturePaths[type]}/${fileName}`,
        `${OUTPUT_ROOT}/${texturePaths.Paving}/${fileName}`
      );
    }
  }
}

await fs.writeFile('assets/texture-manifest.json', JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(manifest).map(([key, value]) => [key, value.length])), null, 2));
