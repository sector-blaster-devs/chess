# Licenses & Open Source Attributions

This project (**Wizard Chess 3D**) is released under the **MIT License**.

Below is the license inventory of all third-party libraries, frameworks, tools, and 3D assets used in this application.

---

## 1. Application Software License

- **License**: MIT License
- **Copyright**: © 2026 Wizard Chess 3D Contributors
- **Full Text**: See [`LICENSE`](./LICENSE)

---

## 2. Core Dependencies & Libraries

| Dependency | Purpose | License | Copyright / Author |
| :--- | :--- | :--- | :--- |
| **Three.js** (`three`) | 3D WebGL Scene, Camera, Shaders, PBR Materials | **MIT** | © 2010–2024 Three.js Authors (Ricardo Cabello / mrdoob) |
| **React** (`react`) | Declarative UI Framework | **MIT** | © Meta Platforms, Inc. and affiliates |
| **React DOM** (`react-dom`) | DOM Renderer for React | **MIT** | © Meta Platforms, Inc. and affiliates |
| **Vite** (`vite`) | Next-Gen Frontend Tooling & Bundler | **MIT** | © 2019–present Evan You & Vite Contributors |
| **@vitejs/plugin-react** | React Fast Refresh & JSX Babel Plugin | **MIT** | © Evan You & Vite Contributors |
| **@google/genai** | Google Gen AI SDK | **Apache-2.0** | © Google LLC |

---

## 3. Development & Build Tools

| Package | Purpose | License |
| :--- | :--- | :--- |
| **TypeScript** (`typescript`) | Typed JavaScript compiler | **Apache-2.0** (© Microsoft Corp.) |
| **@types/three** | TypeScript definitions for Three.js | **MIT** (DefinitelyTyped) |
| **@types/react** | TypeScript definitions for React | **MIT** (DefinitelyTyped) |
| **@types/react-dom** | TypeScript definitions for ReactDOM | **MIT** (DefinitelyTyped) |
| **@types/node** | TypeScript definitions for Node.js | **MIT** (DefinitelyTyped) |

---

## 4. 3D Models & Media Assets

All 3D assets in `/public/assets/glb/` are procedural and custom-sculpted binary glTF 2.0 models exported via Blender:
- `option8_cathedral.glb.gz.b64` (Gothic Cathedral Sanctum, Rose Windows, Stone Columns, Vaults)
- `pawn_white.glb.gz.b64` (Sculpted Stone Foot Soldier / Pawn)
- `rook_white.glb.gz.b64` (Sculpted Gothic Citadel / Rook)
- `knight_white.glb.gz.b64` (Sculpted War Horse / Knight)
- `bishop_white.glb.gz.b64` (Sculpted Mitred Cleric / Bishop)
- `queen_white.glb.gz.b64` (Sculpted Gothic Sovereign / Queen)
- `king_white.glb.gz.b64` (Sculpted Monarch / King)

**Asset License**: **Creative Commons Attribution 4.0 International (CC-BY 4.0)** / Permissive Open Source Game Asset License.
Allowed for personal and commercial use with attribution.

---

## 5. Web Fonts & Icons

- System Font Stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- Monospace Stack: `'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace`
