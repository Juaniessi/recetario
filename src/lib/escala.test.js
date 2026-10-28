import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redondear, cantidad, rinde, factorPorMolde, factorDesde, leerNumero } from './escala.js';

test('redondeo de cocina', () => {
  assert.equal(redondear(170.67), 171);
  assert.equal(redondear(3.11), 3.1);
  assert.equal(redondear(0.533), 0.5);
});

test('cantidades con coma decimal, rangos y miles', () => {
  assert.equal(cantidad(4.5, 1, 'g'), '4,5 g');
  assert.equal(cantidad([10, 16], 1.5, 'g'), '15–24 g');
  assert.equal(cantidad(600, 2, 'ml'), '1.200 ml');
});

test('caso testigo: brownie de 30×30 a 20×20', () => {
  const f = factorPorMolde({ forma: 'rectangular', ancho: 30, largo: 30 }, { forma: 'rectangular', ancho: 20, largo: 20 });
  assert.equal(Math.round(f * 1000) / 1000, 0.444);
  assert.equal(cantidad(384, f, 'g'), '171 g'); // manteca
  assert.equal(rinde(36, f), 16); // 4 × 4 cuadrados de 5 cm
});

test('de 20×20 a 30×30 es ×2,25', () => {
  const f = factorPorMolde({ forma: 'rectangular', ancho: 20, largo: 20 }, { forma: 'rectangular', ancho: 30, largo: 30 });
  assert.equal(f, 2.25);
});

test('molde redondo: 24 cm sobre 20×20', () => {
  const f = factorPorMolde({ forma: 'rectangular', ancho: 20, largo: 20 }, { forma: 'redondo', diametro: 24 });
  assert.equal(Math.round(f * 100) / 100, 1.13);
});

test('desde un ingrediente: 384 g de huevo sobre 384 da ×1', () => {
  assert.equal(factorDesde(384, 384), 1);
  assert.equal(factorDesde(50, 100), 2);
  assert.equal(factorDesde([10, 16], 20), 2); // con rango manda el primero
});

test('lee números con coma o punto', () => {
  assert.equal(leerNumero('2,25'), 2.25);
  assert.equal(leerNumero(' 2.25 '), 2.25);
  assert.equal(leerNumero('0'), null);
  assert.equal(leerNumero('abc'), null);
});
