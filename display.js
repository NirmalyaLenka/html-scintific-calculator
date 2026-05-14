/**
 * display.js
 * Handles all DOM rendering for the calculator display.
 */

'use strict';

import { state } from './calculator.js';

// ─── DOM refs (resolved once on init) ────────────────────────────────────────

let elMain, elExpr, elHist;

export function initDisplay() {
  elMain = document.getElementById('dMain');
  elExpr = document.getElementById('dExpr');
  elHist = document.getElementById('dHist');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Format a number for display — scientific notation for very large/small values.
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  if (!isFinite(n)) return n > 0 ? '+∞' : isNaN(n) ? 'NaN' : '−∞';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e13 || abs < 1e-9)) return n.toExponential(6);
  return parseFloat(n.toPrecision(11)).toString();
}

/**
 * Derive the CSS size class based on display string length.
 * @param {string} text
 * @returns {string}
 */
function sizeClass(text) {
  if (text.length > 20) return 'd-main tiny';
  if (text.length > 13) return 'd-main shrink';
  return 'd-main';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Render the current expression from state */
export function renderExpression() {
  const text = state.display || '0';
  elMain.className = sizeClass(text);
  elMain.textContent = text;
  elExpr.textContent = state.display || '\u00a0';
}

/**
 * Render the result of a successful evaluation.
 * @param {string} displayStr  — formatted result string
 * @param {string} exprStr     — the expression that was evaluated
 */
export function renderResult(displayStr, exprStr) {
  // Move current expression to history line
  elHist.textContent = exprStr + ' =';

  // Show result in main display
  elMain.className = sizeClass(displayStr);
  elMain.textContent = displayStr;

  // Clear live expression line
  elExpr.textContent = '\u00a0';
}

/** Render an error state */
export function renderError(msg = 'Syntax Error') {
  elMain.className = 'd-main error';
  elMain.textContent = msg;
}

/** Render a full clear (back to 0) */
export function renderClear() {
  elMain.className = 'd-main';
  elMain.textContent = '0';
  elExpr.textContent = '\u00a0';
  elHist.textContent = '\u00a0';
}

/** Update the memory badge in the top bar */
export function renderMemoryBadge(value) {
  const el = document.getElementById('memBadge');
  if (!el) return;
  el.textContent = value !== 0 ? `M=${formatNumber(value)}` : '';
}

/** Update the memory display inside the MEM panel */
export function renderMemoryPanel(value) {
  const el = document.getElementById('memDisplay');
  if (!el) return;
  el.textContent = value !== 0 ? `Memory: ${formatNumber(value)}` : 'Memory: empty';
}
