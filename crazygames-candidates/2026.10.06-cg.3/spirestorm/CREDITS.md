# Artwork and audio

Spirestorm (previous working title: Emberwake) is an original game with its own setting, characters, artwork, interface, and implementation. Knightmare Tower is a gameplay reference; no assets from that game are included.

The title-screen knight, engraved Spirestorm crest, storm spire painting and transparent cloud layer were made specifically for this game with the built-in image-generation tool. Original pixels, alpha, prompts and SHA-256 hashes are preserved in [assets/boot](assets/boot). The title screen reuses only Understar's owner-approved `sprites/UI/baked-copy-v1/controls.png` for its baked button lettering and frames. The file matches the source library's approved manifest hash. No Understar title-screen landscape or movie is included. See [BOOT-MENU.md](BOOT-MENU.md).

Custom raster artwork was made with OpenAI's built-in image-generation tool for this project:

The September 22 combat-art pass adds 36 upward-attack cels across all nine forged armor/blade combinations, four exposed cut-surface materials and twelve matching fragments. These were generated with the built-in image-generation tool from the project's own art direction; no reference-game pixels were copied. Native PNGs, full prompts, registered atlases and nine editable Piskel projects are in [assets/combat-art](assets/combat-art). See [COMBAT-ART.md](COMBAT-ART.md) for source provenance and optional repacking instructions. Existing audio and third-party asset credits remain unchanged.

| File | Contents |
| --- | --- |
| assets/hero-atlas.png | 30 poses: idle, rise, dive, slash / rebound, victory |
| assets/costume-atlas.png | Six armor sets in five gameplay poses |
| assets/enemy-atlas.png | Original reference designs for 30 creatures |
| assets/boss-atlas.png | Original reference designs for 10 guardians |
| assets/upgrade-atlas.png | 30 illustrated upgrade items |
| assets/realm-atlas.png | Original design reference for ten tower environments |
| assets/backgrounds/*-far.png | Ten dedicated 1254 × 1254 realm paintings |
| assets/backgrounds/*-depth.png | Ten transparent 1254 × 1254 sheets with forty architecture pieces |

The knight, costumes and upgrade icons use the established atlases. Each realm now uses a dedicated painting and transparent architecture layers generated with the built-in image-generation tool; prompts and native dimensions are preserved in assets/backgrounds. The encounter revision adds thirty enemy and ten guardian sheets generated from the project's original creature identities. Each has four authored state poses: idle, anticipation, action and hurt. The runtime strips use individual source cuts, one scale per creature, explicit body anchors, transparent padding and premultiplied-alpha resampling. State poses are held while continuous transforms provide motion; they are not a constantly cycling idle flipbook.

Original source sheets and runtime strips are in assets/enemies and assets/bosses. Forty editable Piskel v2 projects are in assets/piskel. The body-pivot and cut metadata is in assets/creature-manifest.json, and all forty prompts are in assets/creature-generation-prompts.json. Piskel/Piksel MCP was unavailable; no MCP or editor pass is claimed. The local packing pipeline and browser review performed the anchor polish.

The prompts used for initial generation and atlas refinement are preserved in assets/generation-prompts.json.

Movement, launch timing, the dive-and-rebound loop, Web Audio effects, and parts of the particle system were developed from the previous Emberwake slice. Music and recorded sound effects now come from the owner-approved Dig Game library. The original synthesized cues were replaced. See [AUDIO-CREDITS.md](AUDIO-CREDITS.md) for selected Freesound and Sonniss attribution, project music provenance, and derivative edits.

Blender MCP was not available in this session. This build uses 2D painted assets and Canvas rendering.

The 5 October 2026 Hollow Spire architectural rebuild adds eight active independent scenery masters generated with OpenAI's built-in image tool. Nine originals are preserved, including the rose-window input for the supported wall edit. Native pixels, exact prompts, alpha and SHA-256 are in assets/hollow-architecture/. See SCENERY-REBUILD.md.

The all-biome follow-up adds 27 independent masonry, landmark and gallery masters across the other nine realms, also generated with OpenAI's built-in image tool. Exact prompts, native alpha, dimensions, provenance and hashes are preserved in assets/biome-architecture-v2/. Runtime WebP derivatives retain the masters' dimensions. Scenery and title artwork use quality 92 with lossless alpha; character and combat atlases use lossless encoding. Editable masters remain in the source workspace, outside the prepared runtime package.
