# SciCalc — Mobile Scientific Calculator

A mobile-first scientific calculator prototype built with HTML, CSS, and JavaScript. The repository currently contains a self-contained HTML page plus two separate JavaScript modules; those modules are not imported by the self-contained page.

## Features in the standalone page

- Trigonometric, inverse-trigonometric, and hyperbolic functions
- Logarithms, exponentials, powers, roots, factorial, and absolute value
- Mathematical and physical constants
- DEG/RAD/GRAD angle modes
- Memory controls and a calculation history
- Touch-oriented layout and keyboard input

## Repository contents

| Path | Purpose / status |
|---|---|
| `scientific-calculator for mobilr browser.html` | Main self-contained browser app. Its CSS and JavaScript are embedded in the file. Keep this exact filename when opening it from the current checkout. |
| `calculator.js` | Separate ES module for expression state, functions, constants, and evaluation. The standalone HTML does not import it. |
| `display.js` | Separate ES module for DOM display rendering. The standalone HTML does not import it. |
| `manifest.json` | Manifest draft. It references `icons/icon-192.png` and `icons/icon-512.png`, which are not present in the tracked root tree. |
| `gitignore (4)` | Text file containing ignore patterns, but Git does not treat this suffixed filename as the active `.gitignore`. |
| `README.md` | Project documentation. |

## Run locally

### Option 1: open the standalone page

Open `scientific-calculator for mobilr browser.html` directly in a modern browser. It does not require Node.js, a package install, or a build step.

### Option 2: serve the repository locally

From the repository root, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/scientific-calculator%20for%20mobilr%20browser.html` in your browser. Stop the server with `Ctrl+C` when finished.

## PWA and offline status

Do not treat the current checkout as a complete installable PWA. The standalone HTML does not link `manifest.json`, the manifest's icon files are absent, and no service worker is checked in. The calculator logic is embedded locally, but the page requests fonts from Google Fonts, so the intended typography may not load without an internet connection.

## Implementation notes and limitations

- The standalone page and the separate `calculator.js` / `display.js` modules are not wired together in the current tree; edits to the modules do not automatically change the standalone page.
- The JavaScript evaluates internally generated expressions using `Function()`. This is not a hardened expression parser; do not adapt it to execute arbitrary expressions from untrusted sources without redesigning the evaluator.
- No automated test suite or browser compatibility matrix is included. Calculations and installation behavior were not tested as part of this documentation review.

## License

No conventional `LICENSE` file is present in the tracked root tree. Confirm the intended license before redistributing the project.

## Maintenance & Audit

- **Audit date:** 18 November 2026
- **Documentation status:** File layout, launch instructions, and PWA claims reviewed.
- **Verification status:** Documentation and source inspection only; no browser test or automated test run is claimed.
- **Scope:** Application code and runtime behavior were not changed by this documentation update.

## Contact

Maintained up to 25 November 2026.

If you encounter any problems, please contact [carmodbhai@gmail.com](mailto:carmodbhai@gmail.com).
