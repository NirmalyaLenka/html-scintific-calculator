# html-scintific-calculator
# SciCalc — Mobile Scientific Calculator
 
A fully featured, mobile-first scientific calculator built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies, no build step.
 
![SciCalc Preview](https://img.shields.io/badge/version-1.0.0-4f8ef7?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-22d3ee?style=flat-square) ![PWA](https://img.shields.io/badge/PWA-ready-34d399?style=flat-square)
 
## Features
 
- **Full scientific function set** — trig, inverse trig, hyperbolic, log, exp, powers, roots, factorial, absolute value
- **Physical constants** — π, e, φ, speed of light, Planck, Avogadro, Boltzmann and more
- **Memory system** — MS / MR / M+ / M− / MC
- **Calculation history** — last 30 results, tap to recall
- **Angle modes** — DEG / RAD / GRAD
- **Mobile-first design** — large touch targets, safe-area insets, PWA installable
- **Keyboard support** — full keyboard input on desktop
- **Zero dependencies** — pure HTML/CSS/JS, works offline
## Project Structure
 
```
scicalc/
├── index.html          # App shell & markup
├── css/
│   └── style.css       # All styles (variables, layout, buttons)
├── js/
│   ├── calculator.js   # Core calculation engine & state
│   ├── display.js      # Display rendering & formatting
│   ├── history.js      # History management
│   ├── memory.js       # Memory (MS/MR/M+/M−/MC)
│   └── ui.js           # UI interactions (panels, keyboard)
├── manifest.json       # PWA manifest
├── .gitignore
└── README.md
```
 
## Getting Started
 
```bash
git clone https://github.com/yourusername/scicalc.git
cd scicalc
# Open index.html in any browser — no build step needed
open index.html
```
 
Or serve locally:
 
```bash
npx serve .
# Visit http://localhost:3000
```
 
## PWA Installation
 
On mobile, tap **Share → Add to Home Screen** (iOS) or the install prompt (Android/Chrome) to install as a native-like app.
 
## Keyboard Shortcuts
 
| Key | Action |
|-----|--------|
| `0–9`, `.` | Digit / decimal |
| `+` `-` `*` `/` | Operators |
| `(` `)` | Parentheses |
| `%` | Modulo / percent |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last character |
| `Escape` | Clear all |
 
## License
 
MIT © 2025
