const resources = [
  'gfx/terobjs/arch/windmill',
  'gfx/loginscr'
];

const HAVEN_RES_ROOT = 'http://game.havenandhearth.com/res';
const SIGNATURE = 'Haven Resource 1';

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
    if (this.offset + length > this.buffer.length) {
      throw new Error(`Read past end at ${this.offset}`);
    }

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

function sniffImage(bytes) {
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'png';
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg';
  }

  return 'unknown';
}

function parseMeshLayer(data) {
  const reader = new Reader(data);
  const flags = reader.uint8();
  const triangles = reader.uint16();
  const materialId = reader.int16();
  const meshId = flags & 2 ? reader.int16() : null;
  const refId = flags & 4 ? reader.int16() : null;
  const renderData = [];

  if (flags & 8) {
    while (true) {
      const value = reader.string();
      if (!value) break;
      renderData.push(value);
    }
  }

  return {
    flags,
    triangles,
    verticesReferenced: triangles * 3,
    materialId,
    meshId,
    refId,
    renderData
  };
}

function parseVbuf2Layer(data) {
  const dimensions = {
    pos: 3,
    pos2: 3,
    nrm: 3,
    nrm2: 3,
    col: 4,
    tex: 2,
    tex2: 2,
    tan: 3,
    bit: 3,
    otex: 2
  };
  const reader = new Reader(data);
  const flags = reader.uint8();
  const version = flags & 0x0f;
  const id = version > 0 ? reader.uint16() : null;
  const vertices = reader.uint16();
  const sublayers = [];

  while (!reader.done) {
    const name = reader.string();
    if (!name) break;

    if (name === 'bones') {
      sublayers.push({ name, note: 'bone data present' });
      break;
    }

    const dimension = dimensions[name];
    const byteSize = version > 0 ? reader.int32() : null;
    if (!dimension) {
      sublayers.push({ name, note: 'unknown vbuf sublayer' });
      break;
    }

    const actualByteSize = byteSize ?? dimension * vertices * 4;
    const values = [];
    for (let i = 0; i < dimension * vertices; i++) values.push(reader.float32());
    sublayers.push({ name, dimension, values: values.length, byteSize: actualByteSize });
  }

  return { flags, version, id, vertices, sublayers };
}

function parseTexLayer(data) {
  const reader = new Reader(data);
  const id = reader.int16();
  const offset = { x: reader.int16(), y: reader.int16() };
  const size = { x: reader.int16(), y: reader.int16() };
  const parts = [];

  while (!reader.done) {
    const type = reader.uint8();
    if (type === 0 || type === 4) {
      const length = reader.int32();
      const bytes = reader.bytes(length);
      parts.push({ type, length, imageType: sniffImage(bytes) });
    } else if ([1, 2, 3].includes(type)) {
      parts.push({ type, value: reader.uint8() });
    } else if (type === 5) {
      parts.push({ type });
    } else {
      parts.push({ type, note: 'unknown texture part' });
      break;
    }
  }

  return { id, offset, size, parts };
}

function parseImageLayer(data) {
  const reader = new Reader(data);
  const z = reader.int16();
  const subz = reader.int16();
  const flags = reader.uint8();
  const id = reader.int16();
  const offset = { x: reader.int16(), y: reader.int16() };

  if (flags & 4) {
    while (true) {
      const key = reader.string();
      if (!key) break;
      let length = reader.uint8();
      if (length & 0x80) length = reader.int32();
      reader.bytes(length);
    }
  }

  const imageBytes = reader.bytes(data.length - reader.offset);
  return { z, subz, flags, id, offset, imageLength: imageBytes.length, imageType: sniffImage(imageBytes) };
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
    const layer = { type, size };

    try {
      if (type === 'mesh') layer.details = parseMeshLayer(data);
      if (type === 'vbuf2') layer.details = parseVbuf2Layer(data);
      if (type === 'tex') layer.details = parseTexLayer(data);
      if (type === 'image') layer.details = parseImageLayer(data);
    } catch (error) {
      layer.parseError = error.message;
    }

    layers.push(layer);
  }

  return { version, layers };
}

async function probe(name) {
  const url = `${HAVEN_RES_ROOT}/${name}.res`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const parsed = parseResource(buffer);
  return {
    name,
    url,
    bytes: buffer.length,
    version: parsed.version,
    layerSummary: parsed.layers.reduce((acc, layer) => {
      acc[layer.type] = (acc[layer.type] || 0) + 1;
      return acc;
    }, {}),
    sampleLayers: parsed.layers
      .filter((layer) => ['vbuf2', 'mesh', 'tex', 'image', 'mat2'].includes(layer.type))
      .slice(0, 12)
  };
}

for (const resource of resources) {
  const result = await probe(resource);
  console.log(JSON.stringify(result, null, 2));
}
