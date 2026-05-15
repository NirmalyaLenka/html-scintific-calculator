/**
 * calculator.js
 * Core calculation engine: state, expression building, evaluation.
 */

'use strict';

// ─── State ────────────────────────────────────────────────────────────────────

export const state = {
  /** Internal expression sent to Function() */
  internal: '',
  /** Human-readable display expression */
  display: '',
  /** Whether the last action was an evaluation */
  evaled: false,
  /** Current angle mode: 'deg' | 'rad' | 'grad' */
  angleMode: 'deg',
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const CONSTANTS = [
  { sym: 'π',   label: 'Pi',                     val: Math.PI },
  { sym: 'e',   label: "Euler's number",          val: Math.E },
  { sym: 'φ',   label: 'Golden ratio',            val: 1.6180339887498948 },
  { sym: '√2',  label: 'Square root of 2',        val: Math.SQRT2 },
  { sym: 'ln2', label: 'Natural log of 2',        val: Math.LN2 },
  { sym: 'c',   label: 'Speed of light (m/s)',    val: 299_792_458 },
  { sym: 'G',   label: 'Gravitational const.',    val: 6.674e-11 },
  { sym: 'Nₐ',  label: 'Avogadro (mol⁻¹)',       val: 6.02214076e23 },
  { sym: 'kB',  label: 'Boltzmann (J/K)',         val: 1.380649e-23 },
  { sym: 'R',   label: 'Gas constant (J/mol·K)', val: 8.314462618 },
  { sym: 'h',   label: 'Planck (J·s)',            val: 6.62607015e-34 },
  { sym: 'e⁺',  label: 'Elementary charge (C)',  val: 1.602176634e-19 },
  { sym: 'mₑ',  label: 'Electron mass (kg)',      val: 9.1093837015e-31 },
  { sym: 'mₚ',  label: 'Proton mass (kg)',        val: 1.67262192369e-27 },
  { sym: 'σ',   label: 'Stefan-Boltzmann',        val: 5.670374419e-8 },
];

// ─── Internal → evaluable code mappings ───────────────────────────────────────

const FN_INTERNAL_MAP = {
  sin:   'TRIG_sin(',
  cos:   'TRIG_cos(',
  tan:   'TRIG_tan(',
  asin:  'ATRIG_asin(',
  acos:  'ATRIG_acos(',
  atan:  'ATRIG_atan(',
  sinh:  'HTRIG_sinh(',
  cosh:  'HTRIG_cosh(',
  tanh:  'HTRIG_tanh(',
  asinh: 'Math.asinh(',
  acosh: 'Math.acosh(',
  atanh: 'Math.atanh(',
  log:   'Math.log10(',
  log2:  'Math.log2(',
  ln:    'Math.log(',
  exp:   'Math.exp(',
  sqrt:  'Math.sqrt(',
  cbrt:  'Math.cbrt(',
  abs:   'Math.abs(',
  fact:  'FACT(',
};

const FN_DISPLAY_MAP = {
  sin:   'sin(',
  cos:   'cos(',
  tan:   'tan(',
  asin:  'sin⁻¹(',
  acos:  'cos⁻¹(',
  atan:  'tan⁻¹(',
  sinh:  'sinh(',
  cosh:  'cosh(',
  tanh:  'tanh(',
  asinh: 'sinh⁻¹(',
  acosh: 'cosh⁻¹(',
  atanh: 'tanh⁻¹(',
  log:   'log(',
  log2:  'log₂(',
  ln:    'ln(',
  exp:   'e^(',
  sqrt:  '√(',
  cbrt:  '∛(',
  abs:   '|',
  fact:  'n!(',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Compute n! — used inside evaluated expressions */
function factorial(n) {
  n = Math.round(n);
  if (n < 0) return NaN;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/**
 * Transform the internal expression string into a JS-evaluable string,
 * inserting trig angle conversions based on the current angle mode.
 * @param {string} code
 * @returns {string}
 */
function prepareCode(code) {
  const { angleMode } = state;
  const toRadDiv = angleMode === 'deg' ? 180 : angleMode === 'grad' ? 200 : 1;
  const fromRadMul = angleMode === 'deg' ? '180/Math.PI' : angleMode === 'grad' ? '200/Math.PI' : '1';

  // Forward trig: convert input angle → radians
  code = code.replace(/TRIG_sin\(([^)]*)\)/g, (_, a) =>
    `Math.sin(${a.trim() ? `(${a})*Math.PI/${toRadDiv}` : '0'})`);
  code = code.replace(/TRIG_cos\(([^)]*)\)/g, (_, a) =>
    `Math.cos(${a.trim() ? `(${a})*Math.PI/${toRadDiv}` : '0'})`);
  code = code.replace(/TRIG_tan\(([^)]*)\)/g, (_, a) =>
    `Math.tan(${a.trim() ? `(${a})*Math.PI/${toRadDiv}` : '0'})`);

  // Inverse trig: convert result radians → output angle unit
  code = code.replace(/ATRIG_asin\(([^)]*)\)/g, (_, a) => `(Math.asin(${a})*${fromRadMul})`);
  code = code.replace(/ATRIG_acos\(([^)]*)\)/g, (_, a) => `(Math.acos(${a})*${fromRadMul})`);
  code = code.replace(/ATRIG_atan\(([^)]*)\)/g, (_, a) => `(Math.atan(${a})*${fromRadMul})`);

  // Hyperbolic (no angle conversion needed)
  code = code.replace(/HTRIG_sinh\(([^)]*)\)/g, (_, a) => `Math.sinh(${a})`);
  code = code.replace(/HTRIG_cosh\(([^)]*)\)/g, (_, a) => `Math.cosh(${a})`);
  code = code.replace(/HTRIG_tanh\(([^)]*)\)/g, (_, a) => `Math.tanh(${a})`);

  // Factorial
  code = code.replace(/FACT\(([^)]*)\)/g, (_, a) => `FACTORIAL(${a})`);

  return code;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Append a numeric digit to the expression */
export function appendDigit(d) {
  if (state.evaled) { state.internal = ''; state.display = ''; state.evaled = false; }
  state.internal += d;
  state.display += d;
}

/** Append an operator, replacing a trailing operator if present */
export function appendOperator(op, displayChar) {
  state.evaled = false;
  const last = state.internal.slice(-1);
  if (['+', '-', '*', '/'].includes(last)) {
    state.internal = state.internal.slice(0, -1);
    state.display  = state.display.slice(0, -1);
  }
  state.internal += op;
  state.display  += displayChar;
}

/** Append a raw string to both internal and display (e.g. parentheses, power operators) */
export function appendRaw(internalStr, displayStr) {
  if (state.evaled && internalStr !== '(' && !internalStr.startsWith('**')) {
    state.internal = '';
    state.display  = '';
    state.evaled   = false;
  }
  state.internal += internalStr;
  state.display  += displayStr;
}

/** Append a named function (sin, cos, log, etc.) */
export function appendFunction(fn) {
  if (state.evaled) { state.internal = ''; state.display = ''; state.evaled = false; }
  state.internal += FN_INTERNAL_MAP[fn];
  state.display  += FN_DISPLAY_MAP[fn];
}

/** Insert a named constant value */
export function insertConstant(value, symbol) {
  if (state.evaled) { state.internal = ''; state.display = ''; state.evaled = false; }
  state.internal += value;
  state.display  += symbol;
}

/** Negate the current expression */
export function negateExpression() {
  if (!state.internal) return;
  state.internal = `(-(${state.internal}))`;
  state.display  = `-(${state.display})`;
}

/** Delete the last character from internal and display */
export function deleteLast() {
  if (!state.internal) return;
  state.internal = state.internal.slice(0, -1);
  state.display  = state.display.slice(0, -1);
}

/** Clear the entire expression */
export function clearAll() {
  state.internal = '';
  state.display  = '';
  state.evaled   = false;
}

/** Set angle mode */
export function setAngleMode(mode) {
  if (!['deg', 'rad', 'grad'].includes(mode)) return;
  state.angleMode = mode;
}

/**
 * Evaluate the current expression.
 * @returns {{ result: number, display: string } | { error: string }}
 */
export function evaluate() {
  if (!state.internal) return { error: 'empty' };
  try {
    const code = prepareCode(state.internal);
    // eslint-disable-next-line no-new-func
    const result = Function(
      '"use strict"; const FACTORIAL = ' + factorial.toString() + '; return (' + code + ');'
    )();

    if (isNaN(result)) throw new Error('NaN result');

    let displayResult;
    if (!isFinite(result)) {
      displayResult = result > 0 ? '+∞' : '−∞';
    } else {
      const abs = Math.abs(result);
      if (abs !== 0 && (abs >= 1e13 || abs < 1e-9)) {
        displayResult = result.toExponential(6);
      } else {
        displayResult = parseFloat(result.toPrecision(11)).toString();
      }
    }

    return { result, display: displayResult };
  } catch (err) {
    return { error: err.message || 'Syntax Error' };
  }
}

/**
 * Evaluate the current expression silently (used by memory operations).
 * Returns 0 on failure.
 * @returns {number}
 */
export function evaluateSilent() {
  if (!state.internal) return 0;
  try {
    const code = prepareCode(state.internal);
    // eslint-disable-next-line no-new-func
    return Function(
      '"use strict"; const FACTORIAL = ' + factorial.toString() + '; return (' + code + ');'
    )();
  } catch {
    return 0;
  }
}
