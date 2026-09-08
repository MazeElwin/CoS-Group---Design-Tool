const HAVEN_ASSET_ROOT = 'assets';
const OBJECT_TEXTURE_ROOT = `${HAVEN_ASSET_ROOT}/object-textures`;
const APP_ASSET_VERSION = 'texture-search-pickers-17';

const objectCatalog = {
  "Alchemist's Table": 'alchemiststable.json',
  'Arched Chair': 'archedchair.json',
  'Archery Target': 'archerytarget.json',
  'Barter Stand': 'barterstand.json',
  'Border Cairn': 'bordercairn.json',
  Cart: 'cart.json',
  'Cellar Door': 'cellardoor.json',
  'Charter Stone': 'charterstone.json',
  'Cheese Rack': 'cheeserack.json',
  'Chicken Coop': 'chickencoop.json',
  Cistern: 'cistern.json',
  Dovecote: 'dovecote.json',
  Dugout: 'dugout.json',
  'Fine Sofa': 'finesofa.json',
  'Food Trough': 'foodtrough.json',
  'Garden Pot': 'gardenpot.json',
  "Gemcutter's Wheel": 'gemcutterswheel.json',
  Granary: 'granary.json',
  'Grave Cairn': 'gravecairn.json',
  'Great Hall': 'greathall.json',
  Kicksled: 'kicksled.json',
  Kiln: 'kiln.json',
  Knarr: 'knarr.json',
  'Knarr Dock': 'knarrdock.json',
  'Log Cabin': 'logcabin.json',
  Loom: 'loom.json',
  'Metal Cabinet': 'metalcabinet.json',
  'Metal Cauldron': 'metalcauldron.json',
  'Mine Elevator Top': 'minevator-top.json',
  'Mine Support': 'minesupport.json',
  'Notice Board': 'noticeboard.json',
  'Ore Smelter': 'smelter.json',
  Postbox: 'postbox.json',
  "Potter's Wheel": 'potterswheel.json',
  'Rabbit Hutch': 'rabbithutch.json',
  Rowboat: 'rowboat.json',
  Runestone: 'runestone.json',
  'Smoke Shed': 'smokeshed.json',
  Snekkja: 'snekkja.json',
  Stonestead: 'stonestead.json',
  'Stone Mansion': 'stonemansion.json',
  'Stone Throne': 'stonethrone.json',
  'Stone Arch Tunnel': 'stonearchtunnel.json',
  'Stone Column': 'column.json',
  'Stone Tower': 'stonetower.json',
  'Study Desk': 'studydesk.json',
  'Timber House': 'timberhouse.json',
  'Timber Tunnel': 'timbertunnel.json',
  'Reinforced Tunnel': 'reinforcedtunnel.json',
  Torchpost: 'torchpost.json',
  Urn: 'urn.json',
  'Village Idol': 'villageidol.json',
  Wagon: 'wagon.json',
  Wardrobe: 'wardrobe.json',
  Well: 'well.json',
  Wheelbarrow: 'wheelbarrow.json',
  'Wilderness Beacon': 'wildernessbeacon.json',
  Windmill: 'windmill.json',
  'Wrecking Ball': 'wreckingball.json'
};

const textureTypes = {
  WoodOuter: { id: 0, path: 'woodouter' },
  WoodInner: { id: 1, path: 'woodinner' },
  Thatching: { id: 2, path: 'thatching' },
  Stone: { id: 3, path: 'stone' },
  Metal: { id: 4, path: 'metal' },
  Cloth: { id: 5, path: 'cloth' },
  Clay: { id: 6, path: 'clay' },
  Paving: { id: 7, path: 'paving' },
  Gem: { id: 8, path: 'gems' },
  Brick: { id: 9, path: 'brick' },
  Extra: { id: 99, path: 'extra' }
};

const materialCatalog = [
  { id: 'ash', label: 'Ash', type: 'WoodInner', def: 'Ash' },
  { id: 'apple', label: 'Apple', type: 'WoodInner', def: 'Apple' },
  { id: 'oak', label: 'Oak', type: 'WoodInner', def: 'Oak' },
  { id: 'cedar', label: 'Cedar', type: 'WoodInner', def: 'Cedar' },
  { id: 'steel', label: 'Steel', type: 'Metal', def: 'Steel' },
  { id: 'bronze', label: 'Bronze', type: 'Metal', def: 'Bronze' },
  { id: 'granite', label: 'Granite', type: 'Stone', def: 'Granite' },
  { id: 'glimmermoss', label: 'Glimmermoss', type: 'Thatching', def: 'Glimmermoss' },
  { id: 'hemp', label: 'Hemp Cloth', type: 'Cloth', def: 'Hemp Cloth' },
  { id: 'obsidian', label: 'Obsidian', type: 'Stone', def: 'Obsidian' }
];

const resourceOptions = {
  WoodOuter: [
    'Acacia', 'Alder', 'Almond', 'Apple', 'Ash', 'Aspen', 'Bay Willow', 'Beech', 'Birch',
    'Black Pine', 'Black Poplar', 'Cedar', 'Cherry', 'Chestnut', 'Cork Oak', 'Cypress',
    'Dogwood', 'Elm', 'Fir', 'Goldenchain', 'Gray Alder', 'Hazel', 'Hornbeam', "King's Oak",
    'Larch', 'Laurel', 'Linden', 'Maple', 'Oak', 'Pear', 'Pine', 'Poplar', 'Rowan',
    'Silver Fir', 'Spruce', 'Stone Pine', 'Sweetgum', 'Sycamore', 'Walnut', 'Willow', 'Yew'
  ],
  WoodInner: [
    'Acacia', 'Alder', 'Almond', 'Apple', 'Ash', 'Aspen', 'Bay Willow', 'Beech', 'Birch',
    'Black Pine', 'Black Poplar', 'Cedar', 'Cherry', 'Chestnut', 'Cork Oak', 'Cypress',
    'Dogwood', 'Elm', 'Fir', 'Goldenchain', 'Gray Alder', 'Hazel', 'Hornbeam', "King's Oak",
    'Larch', 'Laurel', 'Linden', 'Maple', 'Oak', 'Pear', 'Pine', 'Poplar', 'Rowan',
    'Silver Fir', 'Spruce', 'Stone Pine', 'Sweetgum', 'Sycamore', 'Walnut', 'Willow', 'Yew'
  ],
  Thatching: [
    'Alder Bough', 'Elm Bough', 'Fir Bough', 'Glimmermoss', 'Gray Alder', 'Linden',
    'Reeds', 'Spruce Bough', 'Straw', 'Sweetgum', 'Tar', 'Yew Bough'
  ],
  Stone: [
    'Alabaster', 'Apatite', 'Arkose', 'Basalt', 'Black Coal', 'Bloodstone', 'Breccia',
    'Cassiterite', 'Chert', 'Cinnabar', 'Diabase', 'Diorite', 'Dolomite', 'Feldspar',
    'Flint', 'Gabbro', 'Galena', 'Gneiss', 'Granite', 'Graywacke', 'Greenschist',
    'Heavy Earth', 'Hornblende', 'Iron Ochre', 'Jasper', 'Korund', 'Kyanite',
    'Limestone', 'Malachite', 'Marble', 'Obsidian', 'Porphyry', 'Quartz', 'Rhyolite',
    'Sandstone', 'Schist', 'Slate', 'Soapstone', 'Sunstone'
  ],
  Metal: [
    'Bronze', 'Cast Iron', 'Copper', 'Gold', 'Lead', 'Metiron', 'Rose Gold', 'Silver',
    'Steel', 'Tin', 'Wrought Iron'
  ],
  Cloth: [
    'Ermine Cloth', 'Felt', 'Golden Cloth', 'Hemp Cloth', 'Leather Fabric', 'Linen Cloth',
    'Mohair Cloth', 'Primitive Cloth', 'Silk Cloth', 'Wool Cloth'
  ],
  Clay: [
    'Acre Clay', 'Ball Clay', 'Bone Clay', 'Cave Clay', 'Coade Clay', 'Gray Clay',
    'Pit Clay', "Potter's Clay", 'Soap Clay'
  ],
  Brick: [
    'Acre Brick', 'Ball Brick', 'Bone Brick', 'Cave Brick', 'Coade Brick', 'Gray Brick',
    'Pit Brick', "Potter's Brick", 'Soap Brick'
  ],
  Gem: [
    'Amber', 'Amethyst', 'Diamond', 'Emerald', 'Jade', 'Moonstone', 'Onyx', 'Opal',
    'Ruby', 'Sapphire', 'Topaz', 'Turquoise'
  ],
  Extra: ['Bucket', 'Crate Stuff', 'Fire', 'Glass', 'Loom Strings', 'Village Idol', 'Water Substance']
};

resourceOptions.Paving = [
  ...resourceOptions.Stone,
  ...resourceOptions.Metal,
  ...resourceOptions.Brick
];

const textureFileOverrides = {
  'Beaver Salvage': 'beaver.jpg',
  'Black Pine': 'blackpine.jpg',
  'Black Poplar': 'blackpoplar.jpg',
  'Cat Gold': 'catgold.jpg',
  'Cast Iron': 'cast.jpg',
  'Coade Brick': 'coade.jpg',
  'Coade Clay': 'coade.jpg',
  'Coade Clayy': 'coade.jpg',
  'Conch Shard': 'conch.jpg',
  'Crate Stuff': 'cratestuff.jpg',
  'Gray Alder': 'grayalder.jpg',
  'Golden Cloth': 'gold.jpg',
  'Heavy Earth': 'heavyearth.jpg',
  'Hemp Cloth': 'hemp.jpg',
  'Horn Silver': 'hornsilver.jpg',
  "King's Oak": 'kingsoak.jpg',
  'Lead Glance': 'leadglance.jpg',
  'Leaf Ore': 'leafore.jpg',
  'Leather Fabric': 'leather.jpg',
  'Linen Cloth': 'linen.jpg',
  'Loom Strings': 'loomstrings.jpg',
  Metiron: 'metiron.jpg',
  'Peacock Ore': 'peacock.jpg',
  'Primitive Cloth': 'primitive.jpg',
  'Quarryartz': 'quarryquartz.jpg',
  'Rock Crystal': 'rockcrystal.jpg',
  'Rose Gold': 'rosegold.jpg',
  'Silk Cloth': 'silk.jpg',
  'Village Idol': 'villageidol.jpg',
  'Water Substance': 'watersubstance.jpg',
  'Wine Glance': 'wineglance.jpg',
  'Wool Cloth': 'wool.jpg',
  'Wrought Iron': 'wrought.jpg'
};

[
  'Alder Bough',
  'Elm Bough',
  'Fir Bough',
  'Spruce Bough',
  'Yew Bough',
  'Acre Clay',
  'Ball Clay',
  'Bone Clay',
  'Cave Clay',
  'Gray Clay',
  'Pit Clay',
  "Potter's Clay",
  'Soap Clay',
  'Acre Brick',
  'Ball Brick',
  'Bone Brick',
  'Cave Brick',
  'Gray Brick',
  'Pit Brick',
  "Potter's Brick",
  'Soap Brick'
].forEach((name) => {
  textureFileOverrides[name] = normalizeTextureName(name)
    .replace('bough', '')
    .replace('clay', '')
    .replace('brick', '');
});

Object.assign(textureFileOverrides, {
  'Ermine Cloth': 'ermine.jpg',
  'Golden Cloth': 'gold.jpg',
  'Hemp Cloth': 'hemp.jpg',
  'Leather Fabric': 'leather.jpg',
  'Linen Cloth': 'linen.jpg',
  'Mohair Cloth': 'mohair.jpg',
  'Primitive Cloth': 'primitive.jpg',
  'Silk Cloth': 'silk.jpg',
  'Wool Cloth': 'wool.jpg',
  "Potter's Clay": 'potter.jpg',
  "Potter's Brick": 'potter.jpg'
});

const textureCatalog = materialCatalog.map((material) => ({
  name: material.label,
  finish: material.type,
  pattern: material.def,
  url: getTextureUrl(material.type, material.def)
}));

const texturePaletteCategories = [
  { label: 'Outer Wood', type: 'WoodOuter' },
  { label: 'Inner Wood', type: 'WoodInner' },
  { label: 'Thatching', type: 'Thatching' },
  { label: 'Stone', type: 'Stone' },
  { label: 'Metal', type: 'Metal' },
  { label: 'Cloth', type: 'Cloth' },
  { label: 'Clay', type: 'Clay' },
  { label: 'Paving', type: 'Paving' },
  { label: 'Gems', type: 'Gem' }
];

const objectMeshTextureOverrides = {
  Cart: [
    {
      meshIds: [2, 3, 4, 5, 6, 7],
      name: 'Bags',
      extraSlot: 'cart-bags',
      hiddenByDefault: true,
      texture: { type: 'Cloth', def: 'Linen Cloth', readonly: true }
    },
    {
      materialIds: [2, 4],
      name: 'Block',
      texture: { type: 'WoodInner', def: 'Pine', readonly: false, slot: 'cart-block', label: 'Block' }
    },
    {
      materialIds: [3, 5],
      name: 'Board',
      texture: { type: 'WoodInner', def: 'Hazel', readonly: false, slot: 'cart-board', label: 'Board' }
    }
  ],
  Rowboat: [
    {
      indexes: [0, 1, 6, 7],
      name: 'Block',
      texture: { type: 'WoodInner', def: 'Ash', readonly: false, slot: 'rowboat-block', label: 'Block' }
    },
    {
      indexes: [2, 3, 4, 5],
      name: 'Board',
      texture: { type: 'WoodInner', def: 'Plane', readonly: false, slot: 'rowboat-board', label: 'Board' }
    },
    {
      indexes: [8, 9],
      name: 'Tin Detail',
      texture: { type: 'Metal', def: 'Tin', readonly: true }
    },
    {
      indexes: [10, 11],
      name: 'Bags',
      hiddenByDefault: true,
      clearTexture: true
    }
  ],
  Wheelbarrow: [
    {
      indexes: [2, 4, 6],
      name: 'Bags',
      hiddenByDefault: true,
      texture: { type: 'Cloth', def: 'Linen Cloth', readonly: true }
    }
  ],
  Knarr: [
    {
      indexes: [0],
      name: 'Water',
      hiddenByDefault: true,
      clearTexture: true
    },
    {
      indexes: [1, 3, 5],
      name: 'Block',
      overlay: null,
      texture: { type: 'WoodInner', def: 'Rowan', readonly: false, slot: 'knarr-block', label: 'Block' }
    },
    {
      indexes: [2, 6, 7],
      name: 'Board',
      overlay: null,
      texture: { type: 'WoodInner', def: 'Plane', readonly: false, slot: 'knarr-board', label: 'Board' }
    },
    {
      indexes: [4],
      name: 'Ropes',
      texture: { type: 'Cloth', def: 'Linen Cloth', readonly: true }
    },
    {
      indexes: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      name: 'Extra',
      hiddenByDefault: true,
      clearTexture: true
    },
    {
      indexes: [19],
      name: 'Sail Cloth 1',
      texture: { type: 'Cloth', def: 'Linen Cloth', readonly: false, slot: 'knarr-cloth-1' }
    },
    {
      indexes: [20],
      name: 'Sail Cloth 2',
      texture: { type: 'Cloth', def: 'Wool Cloth', readonly: false, slot: 'knarr-cloth-2' }
    }
  ],
  Snekkja: [
    {
      materialIds: [0],
      name: 'Hull',
      overlay: null,
      texture: { type: 'WoodInner', def: 'Laurel', readonly: false, slot: 'snekkja-hull', label: 'Board' }
    },
    {
      materialIds: [1],
      name: 'Hull Trim',
      overlay: null,
      texture: { type: 'WoodInner', def: 'Bay Willow', readonly: false, slot: 'snekkja-hull-trim', label: 'Board' }
    },
    {
      materialIds: [17],
      name: 'Ropes',
      texture: { type: 'Cloth', def: 'Linen Cloth', readonly: true }
    },
    {
      materialIds: [20],
      name: 'Water',
      hiddenByDefault: true,
      clearTexture: true
    },
    {
      materialIds: [18],
      name: 'Cargo',
      hiddenByDefault: true,
      clearTexture: true
    },
    {
      materialIds: [-1],
      name: 'Sail',
      hiddenByDefault: true,
      clearTexture: true
    },
    {
      materialIds: [3],
      name: 'Sail Detail',
      texture: { type: 'Cloth', def: 'Hemp Cloth', readonly: false, slot: 'snekkja-sail-detail' }
    },
    {
      materialIds: [4],
      name: 'Sail Trim',
      texture: { type: 'Cloth', def: 'Wool Cloth', readonly: false, slot: 'snekkja-sail-trim' }
    },
    {
      indexes: [8, 10],
      name: 'Extra',
      hiddenByDefault: true,
      clearTexture: true
    }
  ],
  Wagon: [
    {
      materialIds: [8],
      name: 'Ropes',
      texture: { type: 'Cloth', def: 'Linen Cloth', readonly: true }
    },
    {
      meshIds: [2, 3],
      name: 'Cargo',
      hiddenByDefault: true
    }
  ],
  'Stone Arch Tunnel': [
    {
      indexes: [0],
      name: 'Rock 1',
      texture: { type: 'Stone', def: 'Granite', readonly: false, slot: 'stonearchtunnel-rock-1', label: 'Rock 1' }
    },
    {
      indexes: [1],
      name: 'Rock 2',
      texture: { type: 'Stone', def: 'Limestone', readonly: false, slot: 'stonearchtunnel-rock-2', label: 'Rock 2' }
    },
    {
      indexes: [2],
      name: 'Rock 3',
      texture: { type: 'Stone', def: 'Slate', readonly: false, slot: 'stonearchtunnel-rock-3', label: 'Rock 3' }
    },
    {
      indexes: [3],
      name: 'Metal',
      texture: { type: 'Metal', def: 'Wrought Iron', readonly: false, slot: 'stonearchtunnel-metal', label: 'Metal' }
    }
  ]
};

const state = {
  objectName: 'Arched Chair',
  materialIndex: 0,
  shareUrl: '',
  currentObjectData: null,
  meshMaterials: {},
  hiddenMeshes: {}
};

const GROUND_Y = -2.35;
const OBJECT_FLOOR_GAP = 0.12;

const materialRoot = document.querySelector('.materials');
const currentObject = document.getElementById('currentObject');
const currentObjCard = document.getElementById('currentObjCard');
const recipe = document.getElementById('recipe');
const recipeList = document.getElementById('recipe-list');
const switchRecipe = document.getElementById('switch-recipe');
const dialogSelectObject = document.getElementById('dialog-select-object');
const dialogLinkShare = document.getElementById('dialog-link-share');
const objectInput = document.getElementById('objectInput');
const objectList = document.getElementById('objectList');
const inputShare = document.getElementById('input-share');
const loader = document.getElementById('loader');
const texview = document.getElementById('texview');
const sceneCanvas = document.getElementById('sceneCanvas');

let renderer;
let scene;
let camera;
let controls;
let objectGroup;
let textureLoader;

const vertexShader = `
  attribute vec2 uv2;
  varying vec2 baseUv;
  varying vec2 overlayUv;
  void main() {
    baseUv = uv;
    overlayUv = uv2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform sampler2D baseTexture;
  uniform sampler2D overlayTexture;
  uniform int blendType;
  varying vec2 baseUv;
  varying vec2 overlayUv;
  void main() {
    vec4 baseArgb = texture2D(baseTexture, baseUv);
    vec4 overlayArgb = texture2D(overlayTexture, overlayUv);
    vec3 clampRgb = blendType == 1 ? overlayArgb.rgb : baseArgb.rgb;
    vec3 firstArg = baseArgb.rgb * overlayArgb.rgb * 2.0;
    vec3 secondArg = 1.0 - ((1.0 - baseArgb.rgb) * (1.0 - overlayArgb.rgb) * 2.0);
    vec3 thirdArg = clamp((clampRgb.rgb - 0.5) * 1000.0, 0.0, 1.0);
    gl_FragColor = vec4(mix(firstArg, secondArg, thirdArg), baseArgb.a);
  }
`;

function normalizeTextureName(name) {
  return `${name}`.replace(/'/g, '').replace(/:/g, '').replace(/\s+/g, '').toLowerCase() + '.jpg';
}

function getTextureUrl(type, def, slotName = '') {
  const textureType = textureTypes[type] || textureTypes.Extra;
  const fileName = textureFileOverrides[def] || normalizeTextureName(def);
  return `${HAVEN_ASSET_ROOT}/textures/${textureType.path}/${fileName}`;
}

function getObjectUrl(name) {
  return `${HAVEN_ASSET_ROOT}/objects/${objectCatalog[name]}`;
}

function getDirectTextureUrl(fileName) {
  return `${OBJECT_TEXTURE_ROOT}/${fileName}`;
}

function buildTextureBackground(texture) {
  return `center / cover url("${texture.url}")`;
}

function getFullTextureCatalog() {
  return texturePaletteCategories.flatMap((category) => (
    getOptionsForTextureType(category.type).map((name) => ({
      name,
      finish: category.type,
      pattern: name,
      url: getTextureUrl(category.type, name)
    }))
  ));
}

function textureSwatchStyle(type, def) {
  return `background-image: url('${getTextureUrl(type, def)}');`;
}

function materialSwatchStyle(meshName, type, def) {
  return `background-image: url('${getTextureUrl(type, def, meshName)}');`;
}

function escapeHtml(value) {
  return `${value}`.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function setLoading(isLoading) {
  if (loader) loader.classList.toggle('hidden', !isLoading);
}

function disposeObject(root) {
  root.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (!child.material) return;

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (material.map) material.map.dispose();
      if (material.uniforms?.baseTexture?.value) material.uniforms.baseTexture.value.dispose();
      if (material.uniforms?.overlayTexture?.value) material.uniforms.overlayTexture.value.dispose();
      material.dispose();
    });
  });
}

function flipUvY(values) {
  return values.map((value, index) => index % 2 === 0 ? value : 1 - value);
}

function createGeometry(meshData) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(meshData.position), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(meshData.normal), 3));

  if (meshData.uv) {
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(flipUvY(meshData.uv)), 2));
  }

  if (meshData.uv2) {
    geometry.setAttribute('uv2', new THREE.BufferAttribute(new Float32Array(flipUvY(meshData.uv2)), 2));
  }

  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  return geometry;
}

function loadRepeatingTexture(url) {
  const texture = textureLoader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function loadTexture(url) {
  return textureLoader.load(url);
}

function getMeshStateKey(meshData, index) {
  return meshData.texture?.slot || index;
}

function getMeshVisibilityKey(index) {
  return `mesh-${index}`;
}

function isMeshHidden(meshData, index) {
  const stateKey = getMeshVisibilityKey(index);
  if (Object.prototype.hasOwnProperty.call(state.hiddenMeshes, stateKey)) {
    return Boolean(state.hiddenMeshes[stateKey]);
  }

  return Boolean(meshData.hiddenByDefault);
}

function getSelectedMaterialForMesh(meshData, index) {
  const meshTexture = meshData.texture;
  if (!meshTexture || meshTexture.readonly) return meshTexture;
  const options = getOptionsForTextureType(meshTexture.type);
  const fallbackDef = options.includes(meshTexture.def) ? meshTexture.def : options[0] || meshTexture.def;
  const stateKey = getMeshStateKey(meshData, index);

  return {
    ...meshTexture,
    def: state.meshMaterials[stateKey] || fallbackDef
  };
}

function createMeshMaterial(meshData, objectData, baseTexture) {
  const overlayName = meshData.disableObjectOverlay ? null : (meshData.overlay || objectData.overlay);
  if (overlayName && meshData.uv2) {
    return new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: baseTexture },
        overlayTexture: { value: loadTexture(`${HAVEN_ASSET_ROOT}/textures/overlays/${overlayName}`) },
        blendType: { value: objectData.blendtype || 0 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });
  }

  return new THREE.MeshBasicMaterial({
    map: baseTexture,
    side: THREE.DoubleSide
  });
}

function centerObject(group) {
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  group.position.sub(center);

  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  group.scale.setScalar(4.5 / maxDimension);

  const scaledBox = new THREE.Box3().setFromObject(group);
  group.position.y += GROUND_Y + OBJECT_FLOOR_GAP - scaledBox.min.y;
}

function resizeRendererToCanvas() {
  if (!renderer || !camera || !sceneCanvas) return;

  const bounds = sceneCanvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(bounds.width || sceneCanvas.clientWidth || 950));
  const height = Math.max(1, Math.round(bounds.height || sceneCanvas.clientHeight || 640));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function queueRendererResize() {
  requestAnimationFrame(() => {
    resizeRendererToCanvas();
    requestAnimationFrame(resizeRendererToCanvas);
  });
}

function buildObjectFromHavenData(objectData) {
  const group = new THREE.Group();

  objectData.meshes.forEach((meshData, index) => {
    const geometry = createGeometry(meshData);
    let material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });

    if (meshData.texture) {
      const texture = getSelectedMaterialForMesh(meshData, index);
      const url = getTextureUrl(texture.type, texture.def, meshData.name);
      material = createMeshMaterial(meshData, objectData, loadRepeatingTexture(url));
    } else if (meshData.directTexture) {
      material = createMeshMaterial(
        { ...meshData, disableObjectOverlay: true },
        objectData,
        loadRepeatingTexture(getDirectTextureUrl(meshData.directTexture))
      );
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = meshData.name;
    mesh.visible = !isMeshHidden(meshData, index);
    group.add(mesh);
  });

  centerObject(group);
  return group;
}

function applyObjectMeshTextureOverrides(name, objectData) {
  const overrides = objectMeshTextureOverrides[name];
  if (!overrides) return objectData;

  return {
    ...objectData,
    meshes: objectData.meshes.map((mesh, index) => {
      const matchingOverrides = overrides.filter(({ indexes, meshIds, materialIds, names }) => (
        indexes?.includes(index) || meshIds?.includes(mesh.meshId) || materialIds?.includes(mesh.materialId) || names?.includes(mesh.name)
      ));

      if (!matchingOverrides.length) return mesh;

      return matchingOverrides.reduce((nextMesh, override) => ({
        ...nextMesh,
        name: override.name || nextMesh.name,
        hiddenByDefault: override.hiddenByDefault ?? nextMesh.hiddenByDefault,
        overlay: Object.prototype.hasOwnProperty.call(override, 'overlay') ? override.overlay : nextMesh.overlay,
        disableObjectOverlay: override.disableObjectOverlay ?? nextMesh.disableObjectOverlay,
        texture: override.clearTexture ? undefined : (override.texture ? { ...override.texture } : nextMesh.texture)
      }), mesh);
    })
  };
}

async function requestObject(name) {
  setLoading(true);
  const shouldResetMaterials = state.objectName !== name;
  try {
    const response = await fetch(getObjectUrl(name));
    if (!response.ok) throw new Error(`Failed to load ${name}: ${response.status}`);

    state.currentObjectData = applyObjectMeshTextureOverrides(name, await response.json());
    state.objectName = name;
    if (shouldResetMaterials) {
      state.meshMaterials = {};
      state.hiddenMeshes = {};
    }
    updateSceneObject();
    renderMaterialPickers();
    renderPreview();
  } catch (error) {
    console.error(error);
    currentObject.textContent = `Could not load ${name}`;
  } finally {
    setLoading(false);
  }
}

function updateSceneObject() {
  if (!scene || !state.currentObjectData) return;

  if (objectGroup) {
    scene.remove(objectGroup);
    disposeObject(objectGroup);
  }

  objectGroup = buildObjectFromHavenData(state.currentObjectData);
  scene.add(objectGroup);
  queueRendererResize();
}

function renderPreview() {
  if (currentObject) currentObject.textContent = state.objectName;
  if (currentObjCard) currentObjCard.classList.remove('hidden');
  renderRecipe();
}

function renderRecipe() {
  if (!recipe || !recipeList) return;

  const meshes = state.currentObjectData?.meshes || [];
  const texturedMeshes = meshes.filter((mesh) => mesh.texture);

  recipeList.innerHTML = `
    <div class="recipe-row"><span>Object</span><span>${state.objectName}</span></div>
    <div class="recipe-row"><span>Meshes</span><span>${meshes.length}</span></div>
    <div class="recipe-row"><span>Material slots</span><span>${texturedMeshes.length}</span></div>
    ${texturedMeshes.map((mesh, index) => {
      const texture = getSelectedMaterialForMesh(mesh, meshes.indexOf(mesh));
      return `<div class="recipe-row"><span>${mesh.name}</span><span>${texture.def}</span></div>`;
    }).join('')}
  `;

  recipe.classList.remove('hidden');
  recipeList.classList.remove('hidden');
}

function toggleRecipeWidget(checkbox) {
  checkbox.checked = true;
  recipe.classList.remove('hidden');
  recipeList.classList.remove('hidden');
}

function openObjectPicker() {
  if (dialogSelectObject.showModal) dialogSelectObject.showModal();
  else dialogSelectObject.setAttribute('open', 'open');
  objectInput.value = state.objectName;
  renderObjectPicker('');
  objectInput.focus();
  objectInput.select();
}

function createShareUrl() {
  const link = `${state.objectName},${JSON.stringify({
    materials: state.meshMaterials,
    hidden: state.hiddenMeshes
  })}`;
  return `${window.location.origin}${window.location.pathname}#!${btoa(link)}`;
}

function openShareDialog() {
  const url = createShareUrl();
  state.shareUrl = url;
  inputShare.value = url;
  if (dialogLinkShare.showModal) dialogLinkShare.showModal();
  else dialogLinkShare.setAttribute('open', 'open');
  navigator.clipboard?.writeText(url).catch(() => {});
}

function openTexturePreview() {
  if (!texview) return;

  const shell = document.createElement('div');
  shell.className = 'texture-palette-shell';

  const nav = document.createElement('div');
  nav.className = 'texture-category-list';

  const gallery = document.createElement('div');
  gallery.className = 'texture-gallery';

  function renderCategory(category) {
    nav.querySelectorAll('button').forEach((button) => {
      button.classList.toggle('selected', button.dataset.type === category.type);
    });

    gallery.innerHTML = '';
    getOptionsForTextureType(category.type).forEach((name) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'texture-tile';
      tile.innerHTML = `
        <span class="texture-sample" style="${textureSwatchStyle(category.type, name)}"></span>
        <span class="meta"><span>${name}</span><span>${category.label}</span></span>
      `;
      gallery.appendChild(tile);
    });
  }

  texturePaletteCategories.forEach((category, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.type = category.type;
    button.textContent = category.label;
    button.addEventListener('click', () => renderCategory(category));
    nav.appendChild(button);

    if (index === 0) button.classList.add('selected');
  });

  shell.appendChild(nav);
  shell.appendChild(gallery);

  texview.innerHTML = '';
  texview.appendChild(shell);
  texview.classList.remove('hidden');
  renderCategory(texturePaletteCategories[0]);
}

function closeTexturePreview() {
  if (texview) texview.classList.add('hidden');
}

function applyUrlState() {
  if (!window.location.hash.startsWith('#!')) return;

  try {
    const [objectName, meshMaterialsJson] = atob(window.location.hash.slice(2)).split(/,(.+)/);
    if (objectCatalog[objectName]) state.objectName = objectName;

    if (meshMaterialsJson) {
      const parsedState = JSON.parse(meshMaterialsJson);
      if (parsedState.materials || parsedState.hidden) {
        state.meshMaterials = parsedState.materials || {};
        state.hiddenMeshes = parsedState.hidden || {};
      } else {
        state.meshMaterials = parsedState;
      }
    }
  } catch (error) {
    console.warn('Ignoring invalid share state', error);
  }
}

function setupThreeScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1014);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
  camera.position.set(0, 1.4, 8);

  renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  resizeRendererToCanvas();

  textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = '';

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.panSpeed = 0.85;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE
  };
  controls.minDistance = 2.5;
  controls.maxDistance = 36;
  controls.target.set(0, 0.1, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.2));

  const keyLight = new THREE.DirectionalLight(0xfff2d6, 1.35);
  keyLight.position.set(4, 8, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x9ecbff, 0.8);
  rimLight.position.set(-6, 4, -5);
  scene.add(rimLight);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(8, 48),
    new THREE.MeshStandardMaterial({ color: 0x1b212a, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  scene.add(ground);

  queueRendererResize();
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

function getOptionsForTextureType(type) {
  return resourceOptions[type] || resourceOptions.Extra;
}

async function hydrateResourceOptions() {
  try {
    const response = await fetch(`${HAVEN_ASSET_ROOT}/texture-manifest.json?v=${APP_ASSET_VERSION}`, {
      cache: 'no-store'
    });
    if (!response.ok) return;

    const manifest = await response.json();
    Object.keys(textureTypes).forEach((type) => {
      resourceOptions[type] = Array.isArray(manifest[type]) ? manifest[type] : [];
    });
  } catch (error) {
    console.warn('Using fallback texture lists', error);
  }
}

function renderMaterialPickers() {
  if (!materialRoot) return;

  materialRoot.innerHTML = '';

  const meshes = state.currentObjectData?.meshes || [];
  const editableSlots = [];
  const seenSlots = new Set();
  meshes
    .map((mesh, index) => ({ mesh, index, stateKey: getMeshStateKey(mesh, index) }))
    .filter(({ mesh }) => mesh.texture && !mesh.texture.readonly)
    .forEach((slot) => {
      if (seenSlots.has(slot.stateKey)) return;
      seenSlots.add(slot.stateKey);
      editableSlots.push(slot);
    });

  const meshSlots = meshes.map((mesh, index) => ({
    mesh,
    index,
    stateKey: getMeshVisibilityKey(index)
  }));

  if (!editableSlots.length && !meshSlots.length) {
    materialRoot.innerHTML = '<div class="material-empty">No editable material slots for this object.</div>';
    return;
  }

  editableSlots.forEach(({ mesh, index, stateKey }) => {
    const selected = getSelectedMaterialForMesh(mesh, index);
    const options = getOptionsForTextureType(mesh.texture.type);
    const slotLabel = selected.label || mesh.name;
    const row = document.createElement('div');
    row.className = 'material-picker';
    const isHidden = isMeshHidden(mesh, index);
    row.classList.toggle('is-hidden', isHidden);
    row.innerHTML = `
      <span class="material-picker-label">
        <span>${slotLabel}</span>
        <small>${mesh.texture.type}</small>
      </span>
      <span class="material-picker-control">
        <span class="material-mini-swatch" style="${materialSwatchStyle(slotLabel, selected.type, selected.def)}"></span>
        <span class="texture-select" data-mesh-key="${stateKey}">
          <span class="texture-search-wrap">
            <input class="texture-select-input" type="search" value="${escapeHtml(selected.def)}" autocomplete="off" aria-label="Search ${escapeHtml(slotLabel)} textures" />
            <i class="material-icons">search</i>
          </span>
          <span class="texture-select-menu">
          </span>
        </span>
      </span>
    `;
    const textureSelect = row.querySelector('.texture-select');
    const textureInput = textureSelect.querySelector('.texture-select-input');
    const textureMenu = textureSelect.querySelector('.texture-select-menu');
    const renderTextureOptions = (filterText = '') => {
      const filter = filterText.trim().toLowerCase();
      const visibleOptions = options.filter((option) => option.toLowerCase().includes(filter));
      textureMenu.innerHTML = '';

      if (!visibleOptions.length) {
        const empty = document.createElement('span');
        empty.className = 'texture-select-empty';
        empty.textContent = 'No textures found';
        textureMenu.appendChild(empty);
        return;
      }

      visibleOptions.forEach((option) => {
        const optionButton = document.createElement('button');
        optionButton.className = `texture-select-option ${option === selected.def ? 'selected' : ''}`;
        optionButton.type = 'button';
        optionButton.dataset.value = option;
        optionButton.innerHTML = `
          <span class="texture-option-swatch" style="${materialSwatchStyle(slotLabel, mesh.texture.type, option)}"></span>
          <span>${escapeHtml(option)}</span>
        `;
        optionButton.addEventListener('click', (event) => {
          event.stopPropagation();
          state.meshMaterials[stateKey] = optionButton.dataset.value;
          textureSelect.classList.remove('open');
          updateSceneObject();
          renderMaterialPickers();
          renderPreview();
        });
        textureMenu.appendChild(optionButton);
      });
    };

    const openTextureSelect = (filterText = '') => {
      document.querySelectorAll('.texture-select.open').forEach((select) => {
        if (select !== textureSelect) select.classList.remove('open');
      });
      renderTextureOptions(filterText);
      textureSelect.classList.add('open');
    };

    textureInput.addEventListener('click', (event) => {
      event.stopPropagation();
      textureInput.select();
      openTextureSelect('');
    });

    textureInput.addEventListener('input', () => {
      openTextureSelect(textureInput.value);
    });

    textureInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const filter = textureInput.value.trim().toLowerCase();
      const exact = options.find((option) => option.toLowerCase() === filter);
      const firstMatch = options.find((option) => option.toLowerCase().includes(filter));
      const nextValue = exact || firstMatch;
      if (!nextValue) return;

      state.meshMaterials[stateKey] = nextValue;
      textureSelect.classList.remove('open');
      updateSceneObject();
      renderMaterialPickers();
      renderPreview();
    });

    row.querySelector('.material-mini-swatch').addEventListener('click', (event) => {
      event.stopPropagation();
      textureInput.focus();
      textureInput.select();
      openTextureSelect('');
    });

    materialRoot.appendChild(row);
  });

  if (meshSlots.length) {
    const heading = document.createElement('div');
    heading.className = 'material-section-heading';
    heading.textContent = 'Meshes';
    materialRoot.appendChild(heading);
  }

  meshSlots.forEach(({ mesh, index, stateKey }) => {
    const isHidden = isMeshHidden(mesh, index);
    const row = document.createElement('div');
    row.className = 'extra-toggle';
    row.classList.toggle('is-hidden', isHidden);
    row.innerHTML = `
      <span class="extra-toggle-label">
        <span>${mesh.name}</span>
        <small>${isHidden ? 'Off' : 'On'} | ${index} | mat ${mesh.materialId ?? '-'} | mesh ${mesh.meshId ?? '-'}</small>
      </span>
      <button class="material-hide-button" type="button" aria-label="${isHidden ? `Show ${mesh.name}` : `Hide ${mesh.name}`}" title="${isHidden ? 'Show extra' : 'Hide extra'}">
        <i class="material-icons">${isHidden ? 'visibility_off' : 'visibility'}</i>
      </button>
    `;

    row.querySelector('.material-hide-button').addEventListener('click', () => {
      state.hiddenMeshes[stateKey] = !isMeshHidden(mesh, index);

      updateSceneObject();
      renderMaterialPickers();
      renderPreview();
    });

    materialRoot.appendChild(row);
  });
}

function closeTextureSelects() {
  document.querySelectorAll('.texture-select.open').forEach((select) => {
    select.classList.remove('open');
  });
}

function selectObject(label) {
  objectInput.value = label;
  renderObjectPicker();
  if (dialogSelectObject && dialogSelectObject.close) dialogSelectObject.close();
  requestObject(label);
}

function renderObjectPicker(filterText = '') {
  if (!objectList || !objectInput) return;

  objectList.innerHTML = '';
  const filter = filterText.trim().toLowerCase();
  const labels = Object.keys(objectCatalog).filter((label) => label.toLowerCase().includes(filter));
  const currentVisible = labels.includes(state.objectName);

  if (!labels.length) {
    const empty = document.createElement('div');
    empty.className = 'object-empty';
    empty.textContent = 'No matching objects';
    objectList.appendChild(empty);
    return;
  }

  labels.forEach((label, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = label === state.objectName || (!currentVisible && index === 0) ? 'selected' : '';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      selectObject(label);
    });
    objectList.appendChild(btn);
  });
}

function initScene() {
  if (!sceneCanvas) return;

  applyUrlState();
  hydrateResourceOptions().then(() => {
    renderMaterialPickers();
  });
  renderMaterialPickers();
  renderObjectPicker();
  renderPreview();
  setupThreeScene();
  requestObject(state.objectName);

  document.getElementById('btn-changemodel')?.addEventListener('click', () => {
    openObjectPicker();
  });

  document.getElementById('btn-share')?.addEventListener('click', openShareDialog);
  document.getElementById('btn-random')?.addEventListener('click', () => {
    window.randomizeMAterials();
  });

  document.getElementById('btn-textures')?.addEventListener('click', openTexturePreview);
  document.getElementById('btn-open-textures')?.addEventListener('click', openTexturePreview);
  document.getElementById('btn-preview')?.addEventListener('click', () => {
    const query = objectInput.value.trim().toLowerCase();
    const exact = Object.keys(objectCatalog).find((label) => label.toLowerCase() === query);
    const firstMatch = Object.keys(objectCatalog).find((label) => label.toLowerCase().includes(query));
    const nextObject = exact || firstMatch;

    if (nextObject) selectObject(nextObject);
    else if (dialogSelectObject && dialogSelectObject.close) dialogSelectObject.close();
  });

  objectInput?.addEventListener('input', () => {
    renderObjectPicker(objectInput.value);
  });

  document.addEventListener('click', closeTextureSelects);

  document.getElementById('btn-share-close')?.addEventListener('click', () => {
    if (dialogLinkShare && dialogLinkShare.close) dialogLinkShare.close();
  });

  document.getElementById('switch-recipe')?.addEventListener('change', (event) => {
    toggleRecipeWidget(event.target);
  });

  texview?.addEventListener('click', (event) => {
    if (event.target === texview) closeTexturePreview();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && texview && !texview.classList.contains('hidden')) {
      closeTexturePreview();
    }
  });

  if (window.ResizeObserver) {
    new ResizeObserver(queueRendererResize).observe(sceneCanvas);
  }

  window.addEventListener('resize', queueRendererResize);
}

window.initScene = initScene;
window.randomizeMAterials = function () {
  if (!state.currentObjectData) return;

  state.currentObjectData.meshes.forEach((mesh, index) => {
    if (!mesh.texture || mesh.texture.readonly) return;
    const options = getOptionsForTextureType(mesh.texture.type);
    state.meshMaterials[getMeshStateKey(mesh, index)] = options[Math.floor(Math.random() * options.length)];
  });

  updateSceneObject();
  renderMaterialPickers();
  renderPreview();
};
window.toggleRecipeWidget = toggleRecipeWidget;
window.onCameraAxeChanged = function () {};
window.textureCatalog = textureCatalog;
window.getFullTextureCatalog = getFullTextureCatalog;
window.hydrateResourceOptions = hydrateResourceOptions;
window.buildTextureBackground = buildTextureBackground;
