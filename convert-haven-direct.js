const HAVEN_RES_ROOT = 'http://game.havenandhearth.com/res';
const LEGACY_METADATA_ROOT = 'https://carrygun.gitlab.io/hmdt';
const SIGNATURE = 'Haven Resource 1';
const OUTPUT_DIR = 'assets';
const OBJECT_DIR = `${OUTPUT_DIR}/objects`;
const OBJECT_TEXTURE_DIR = `${OUTPUT_DIR}/object-textures`;
const OVERLAY_TEXTURE_DIR = `${OUTPUT_DIR}/textures/overlays`;

async function getResources() {
  const fs = await import('node:fs/promises');
  try {
    const map = JSON.parse(await fs.readFile('haven-object-map.json', 'utf8'));
    return Object.values(map.found).map((entry) => ({
      name: entry.path,
      out: entry.fileName.replace(/\.json$/i, '')
    }));
  } catch {
    return [{ name: 'gfx/terobjs/arch/windmill', out: 'windmill' }];
  }
}

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

  uint16() {
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  int32() {
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  int8() {
    return this.view.getInt8(this.offset++);
  }

  uint32() {
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  float32() {
    const value = this.view.getFloat32(this.offset, true);
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

async function mkdir(path) {
  const fs = await import('node:fs/promises');
  await fs.mkdir(path, { recursive: true });
}

function parseMeshLayer(data) {
  const reader = new Reader(data);
  const flags = reader.uint8();
  if (flags & 0x80) return parseVersionedMeshLayer(data, flags);

  const triangles = reader.uint16();
  const materialId = reader.int16();
  const meshId = flags & 2 ? reader.int16() : null;
  const refId = flags & 4 ? reader.int16() : null;
  const renderData = {};

  if (flags & 8) {
    while (true) {
      const key = reader.string();
      if (!key) break;
      renderData[key] = reader.string();
    }
  }

  const vbufId = flags & 16 ? reader.int16() : 0;
  const stripped = Boolean(flags & 32);
  const indices = stripped ? unstrip(reader, triangles) : readTriangleIndices(reader, triangles);

  return { flags, triangles, materialId, meshId, refId, renderData, vbufId, stripped, indices };
}

function parseVersionedMeshLayer(data, flags) {
  const reader = new Reader(data);
  reader.uint8();
  const version = flags & 0x7f;
  if (version !== 1) throw new Error(`Unsupported mesh layer version ${version}`);

  const meshId = reader.int16();
  reader.uint16();

  const renderData = {};
  let materialId = -1;
  let refId = -1;
  let vbufId = 0;

  while (!reader.done) {
    const key = reader.string();
    if (key === '') continue;
    if (key === 'strips') break;

    const value = readTypedMeshValue(reader);
    renderData[key] = value;
    if (key === 'mat') materialId = value;
    if (key === 'ref') refId = value;
    if (key === 'vm') vbufId = value;
  }

  const triangles = reader.uint16();
  const indices = unstrip(reader, triangles);
  return { flags, version, triangles, materialId, meshId, refId, renderData, vbufId, stripped: true, indices };
}

function readTypedMeshValue(reader) {
  const type = reader.uint8();
  if (type === 1) return reader.string();
  if (type === 2) return reader.float32();
  if (type === 3) return reader.int32();
  if (type === 4) return reader.uint8();
  if (type === 5) return reader.int16();
  throw new Error(`Unsupported mesh header value type ${type}`);
}

function readTriangleIndices(reader, triangles) {
  const indices = [];
  for (let i = 0; i < triangles * 3; i++) indices.push(reader.uint16());
  return indices;
}

function decdelta(reader) {
  let b = reader.uint8();
  const pick = (b & 0x80) !== 0;
  let value = b & 0x3f;
  let bits = 6;
  let carry = (b & 0x40) !== 0;

  while (carry) {
    b = reader.uint8();
    carry = (b & 0x80) !== 0;
    value |= (b & 0x7f) << bits;
    bits += 7;
  }

  value = signBits(value, bits);
  return { delta: value >= 0 ? value + 1 : value, pick };
}

function unstrip(reader, triangles) {
  const indices = [];
  let face = [0, 0, 0];
  let nextFace = [0, 0, 0];
  let produced = 0;

  while (produced < triangles) {
    face[0] = reader.uint16();
    face[1] = face[0] + decdelta(reader).delta;
    face[2] = face[1] + decdelta(reader).delta;
    indices.push(face[0], face[1], face[2]);
    produced++;

    const run = reader.uint8();
    for (let i = 0; i < run && produced < triangles; i++) {
      const decoded = decdelta(reader);
      nextFace[2] = face[2] + decoded.delta;
      if (!decoded.pick) {
        nextFace[0] = face[0];
        nextFace[1] = face[2];
      } else {
        nextFace[0] = face[2];
        nextFace[1] = face[1];
      }

      const swap = face;
      face = nextFace;
      nextFace = swap;
      indices.push(face[0], face[1], face[2]);
      produced++;
    }
  }

  return indices;
}

function parseVbuf2Layer(data) {
  const dimensions = {
    pos: 3,
    pos2: 3,
    nrm: 3,
    nrm2: 3,
    col: 4,
    col2: 4,
    tex: 2,
    tex2: 2,
    otex2: 2,
    tan: 3,
    bit: 3,
    otex: 2
  };
  const aliases = {
    pos2: 'pos',
    nrm2: 'nrm',
    col2: 'col',
    tex2: 'tex',
    otex2: 'otex'
  };
  const reader = new Reader(data);
  const flags = reader.uint8();
  const version = flags & 0x0f;
  const id = version > 0 ? reader.uint16() : null;
  const vertices = reader.uint16();
  const sublayers = {};

  while (!reader.done) {
    const name = reader.string();
    if (!name) break;
    if (name === 'bones') break;

    const dimension = dimensions[name];
    const byteSize = version > 0 ? reader.int32() : null;
    if (!dimension) {
      if (byteSize == null) throw new Error(`Unknown vbuf2 sublayer ${name}`);
      reader.bytes(byteSize);
      sublayers[name] = { dimension: null, values: [], skippedBytes: byteSize };
      continue;
    }

    let values;
    if (version > 0) {
      values = decodePackedFloats(new Reader(reader.bytes(byteSize)), dimension * vertices);
    } else {
      values = [];
      for (let i = 0; i < dimension * vertices; i++) values.push(reader.float32());
    }

    sublayers[aliases[name] || name] = { dimension, values };
  }

  return { flags, version, id, vertices, sublayers };
}

function decodePackedFloats(reader, count) {
  const version = reader.uint8();
  if (version !== 1) throw new Error(`Unknown vertex-data version ${version}`);

  const format = reader.string();
  const values = [];

  if (format === 'f4') {
    for (let i = 0; i < count; i++) values.push(reader.float32());
  } else if (format === 'f2') {
    for (let i = 0; i < count; i++) values.push(decodeHalfFloat(reader.int16()));
  } else if (format === 'sn4') {
    const factor = reader.float32() / 2147483647.0;
    for (let i = 0; i < count; i++) values.push(reader.int32() * factor);
  } else if (format === 'sn2') {
    const factor = reader.float32() / 32767.0;
    for (let i = 0; i < count; i++) values.push(reader.int16() * factor);
  } else if (format === 'sn1') {
    const factor = reader.float32() / 127.0;
    for (let i = 0; i < count; i++) values.push(reader.int8() * factor);
  } else if (format === 'un4') {
    const factor = reader.float32() / 4294967295.0;
    for (let i = 0; i < count; i++) values.push(reader.uint32() * factor);
  } else if (format === 'un2') {
    const factor = reader.float32() / 65535.0;
    for (let i = 0; i < count; i++) values.push(reader.uint16() * factor);
  } else if (format === 'un1') {
    const factor = reader.float32() / 255.0;
    for (let i = 0; i < count; i++) values.push(reader.uint8() * factor);
  } else if (format === 'rn4') {
    const min = reader.float32();
    const factor = reader.float32() / 4294967295.0;
    for (let i = 0; i < count; i++) values.push((reader.uint32() * factor) + min);
  } else if (format === 'rn2') {
    const min = reader.float32();
    const factor = reader.float32() / 65535.0;
    for (let i = 0; i < count; i++) values.push((reader.uint16() * factor) + min);
  } else if (format === 'rn1') {
    const min = reader.float32();
    const factor = reader.float32() / 255.0;
    for (let i = 0; i < count; i++) values.push((reader.uint8() * factor) + min);
  } else if (format === 'uvec1') {
    for (let i = 0; i < count; i += 3) values.push(...decodeOctVector(reader.int8() / 127.0, reader.int8() / 127.0));
  } else if (format === 'uvec2') {
    for (let i = 0; i < count; i += 3) values.push(...decodeOctVector(reader.int16() / 32767.0, reader.int16() / 32767.0));
  } else if (format === 'uvech') {
    for (let i = 0; i < count; i += 3) {
      const value = reader.uint8();
      values.push(...decodeOctVector(signBits((value & 0xf0) >> 4, 4) / 7.0, signBits(value & 0x0f, 4) / 7.0));
    }
  } else {
    throw new Error(`Unknown vertex-data format ${format}`);
  }

  return values;
}

function decodeHalfFloat(value) {
  const bits = value & 0xffff;
  const sign = bits & 0x8000 ? -1 : 1;
  const exponent = (bits >> 10) & 0x1f;
  const fraction = bits & 0x03ff;

  if (exponent === 0) return sign * Math.pow(2, -14) * (fraction / 1024);
  if (exponent === 31) return fraction ? NaN : sign * Infinity;
  return sign * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
}

function signBits(value, bits) {
  const sign = 1 << (bits - 1);
  return (value & sign) ? value - (1 << bits) : value;
}

function decodeOctVector(x, y) {
  const vector = [x, y, 1 - Math.abs(x) - Math.abs(y)];
  if (vector[2] < 0) {
    const oldX = vector[0];
    vector[0] = (1 - Math.abs(vector[1])) * Math.sign(oldX || 1);
    vector[1] = (1 - Math.abs(oldX)) * Math.sign(vector[1] || 1);
  }

  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function parseTexLayer(data) {
  const reader = new Reader(data);
  const id = reader.int16();
  const offset = { x: reader.int16(), y: reader.int16() };
  const size = { x: reader.int16(), y: reader.int16() };
  let image = null;

  while (!reader.done) {
    const type = reader.uint8();
    if (type === 0) {
      image = reader.bytes(reader.int32());
    } else if (type === 4) {
      reader.bytes(reader.int32());
    } else if ([1, 2, 3].includes(type)) {
      reader.uint8();
    } else if (type !== 5) {
      break;
    }
  }

  return { id, offset, size, image };
}

function parseResource(buffer) {
  const reader = new Reader(buffer);
  const signature = reader.bytes(SIGNATURE.length).toString('ascii');
  if (signature !== SIGNATURE) throw new Error(`Unexpected signature: ${signature}`);

  const version = reader.int16();
  const layers = [];
  while (!reader.done) {
    const type = reader.string();
    const size = reader.int32();
    const data = reader.bytes(size);
    layers.push({ type, size, data });
  }

  return { version, layers };
}

function pushVec3(output, values, index, rotate = false) {
  if (index < 0 || (index * 3 + 2) >= values.length) throw new Error(`Vertex index ${index} outside vec3 buffer with ${values.length / 3} vertices`);
  const x = values[index * 3];
  let y = values[index * 3 + 1];
  let z = values[index * 3 + 2];

  if (rotate) {
    const oldY = y;
    y = z;
    z = -oldY;
  }

  output.push(round(x), round(y), round(z));
}

function pushVec2(output, values, index) {
  if (index < 0 || (index * 2 + 1) >= values.length) throw new Error(`Vertex index ${index} outside vec2 buffer with ${values.length / 2} vertices`);
  output.push(round(values[index * 2]), round(values[index * 2 + 1]));
}

function round(value) {
  return Number(value.toFixed(6));
}

function buildObjectJson(name, parsed, textureFile) {
  const vbufLayer = parsed.layers.find((layer) => layer.type === 'vbuf2');
  if (!vbufLayer) throw new Error(`${name} has no vbuf2 layer`);

  const vbuf = parseVbuf2Layer(vbufLayer.data);
  const positions = vbuf.sublayers.pos?.values;
  const normals = vbuf.sublayers.nrm?.values;
  const uvs = vbuf.sublayers.tex?.values;
  const overlayUvs = vbuf.sublayers.otex?.values;

  if (!positions || !normals || !uvs) throw new Error(`${name} is missing position, normal, or tex sublayers`);

  const meshes = parsed.layers
    .filter((layer) => layer.type === 'mesh')
    .map((layer, index) => {
      const mesh = parseMeshLayer(layer.data);
      const jsonMesh = {
        name: `mesh_${index}`,
        materialId: mesh.materialId,
        meshId: mesh.meshId,
        refId: mesh.refId,
        vbufId: mesh.vbufId,
        position: [],
        normal: [],
        uv: [],
        directTexture: textureFile
      };

      if (overlayUvs) jsonMesh.uv2 = [];

      mesh.indices.forEach((vertexIndex) => {
        pushVec3(jsonMesh.position, positions, vertexIndex, true);
        pushVec3(jsonMesh.normal, normals, vertexIndex, true);
        pushVec2(jsonMesh.uv, uvs, vertexIndex);
        if (overlayUvs) pushVec2(jsonMesh.uv2, overlayUvs, vertexIndex);
      });

      return jsonMesh;
    });

  return {
    name,
    source: `${HAVEN_RES_ROOT}/${name}.res`,
    generatedFrom: 'official-haven-resource',
    meshes
  };
}

async function fetchLegacyMetadata(fileName) {
  try {
    const response = await fetch(`${LEGACY_METADATA_ROOT}/objects/${fileName}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function mergeLegacyMetadata(objectJson, legacyData) {
  if (!legacyData) return objectJson;

  const merged = {
    ...objectJson,
    name: legacyData.name || objectJson.name,
    recipe: legacyData.recipe,
    overlay: legacyData.overlay,
    blendtype: legacyData.blendtype,
    metadataSource: 'local-legacy-slot-map'
  };

  merged.meshes = objectJson.meshes.map((mesh, index) => {
    const legacyMesh = legacyData.meshes?.[index];
    if (!legacyMesh) return mesh;

    const nextMesh = {
      ...mesh,
      name: legacyMesh.name || mesh.name
    };

    if (legacyMesh.texture) nextMesh.texture = legacyMesh.texture;
    if (legacyMesh.overlay) nextMesh.overlay = legacyMesh.overlay;
    if (legacyMesh.uv2 && mesh.uv2) nextMesh.uv2 = mesh.uv2;
    return nextMesh;
  });

  return merged;
}

async function convert(resource) {
  const fs = await import('node:fs/promises');
  const url = `${HAVEN_RES_ROOT}/${resource.name}.res`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);

  const parsed = parseResource(Buffer.from(await response.arrayBuffer()));
  const texLayer = parsed.layers.find((layer) => layer.type === 'tex');
  const texture = texLayer ? parseTexLayer(texLayer.data) : null;
  const textureFile = texture?.image ? `${resource.out}-tex0.jpg` : null;

  if (textureFile) {
    await fs.writeFile(`${OBJECT_TEXTURE_DIR}/${textureFile}`, texture.image);
  }

  const legacyData = await fetchLegacyMetadata(`${resource.out}.json`);
  const objectJson = mergeLegacyMetadata(buildObjectJson(resource.name, parsed, textureFile), legacyData);
  if (objectJson.overlay && texture?.image) {
    await fs.writeFile(`${OVERLAY_TEXTURE_DIR}/${objectJson.overlay}`, texture.image);
  }
  await fs.writeFile(`${OBJECT_DIR}/${resource.out}.json`, JSON.stringify(objectJson, null, 2));

  return {
    resource: resource.name,
    version: parsed.version,
    meshes: objectJson.meshes.length,
    textureFile,
    output: `${OBJECT_DIR}/${resource.out}.json`
  };
}

await mkdir(OBJECT_DIR);
await mkdir(OBJECT_TEXTURE_DIR);
await mkdir(OVERLAY_TEXTURE_DIR);

const results = [];
for (const resource of await getResources()) {
  try {
    const result = await convert(resource);
    results.push({ ...result, ok: true });
    console.log(`OK   ${resource.out} <- ${resource.name}`);
  } catch (error) {
    results.push({ resource: resource.name, out: resource.out, ok: false, error: error.message });
    console.log(`FAIL ${resource.out} <- ${resource.name}: ${error.message}`);
  }
}

await (await import('node:fs/promises')).writeFile(`${OUTPUT_DIR}/conversion-report.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({
  ok: results.filter((result) => result.ok).length,
  failed: results.filter((result) => !result.ok).length,
  output: `${OUTPUT_DIR}/conversion-report.json`
}, null, 2));
