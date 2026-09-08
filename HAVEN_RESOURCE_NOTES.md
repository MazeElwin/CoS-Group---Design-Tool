# Haven Resource Notes

Useful upstream references while replacing CarryGun runtime assets:

- Official Hafen client git: `git://sh.seatribe.se/hafen-client`
- Official resource endpoint: `http://game.havenandhearth.com/res/<resource-path>.res`
- ResForge parser/tooling reference: `https://github.com/Nightdawg/ResForge`
- CarryGun HafenResourceTool parser reference: `https://gitlab.com/CarryGun/HafenResourceTool`
- Brodgar resource cache/index: `https://brodgar.io/res/` and `https://brodgar.io/res/?json=`

Current material-resource findings:

- Wood material textures live under `gfx/terobjs/trees/<tree>-tex`.
- WoodOuter/block texture appears to be `tex` id `0`.
- WoodInner/board/plank texture appears to be `tex` id `2`.
- Substance material textures live under `gfx/terobjs/subst/<material>`, e.g. `steel`, `bronze`, `hempcloth`, `acreclay`.
- Thatching materials use both tree-object textures for boughs and `gfx/terobjs/subst/<material>` for glimmermoss, reeds, straw, and tar.
- Brick materials reuse matching clay substance textures, e.g. `Acre Brick` maps to `gfx/terobjs/subst/acreclay`.
- Object `mat2` layers use `mlink` to reference these material resources.
- Current intentional blank placeholders pending client/cache capture: `Bloodstone`, `Heavy Earth`, `Iron Ochre`, `Korund`, `Primitive Cloth`.
- Future resource discovery likely needs resources observed through the official client cache or a proxy such as `-U http://brodgar.io/res/`.
