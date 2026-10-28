import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redondear, cantidad, rinde, factorPorMolde, factorDesde, leerNumero, factorPorUnidades, unidades, masaTotal } from './escala.js';

const ing = (cantidad, extra = {}) => ({ nombre: 'x', cantidad, unidad: 'g', escala: true, opcional: false, ...extra });
// El brownie de 20 × 20 con chocolate 70 %.
const BROWNIE = [
  {
    lista: [ing(175), ing(200), ing(35), ing(3), ing(2, { opcional: true }), ing(175), ing(250), ing(80)],
  },
];

test('masa total del brownie: 918 g, sin el café opcional', () => {
  assert.equal(masaTotal(BROWNIE).total, 918);
});

test('quiero 1 kg de masa: la harina pasa a 87 g', () => {
  const f = 1000 / masaTotal(BROWNIE).total;
  assert.equal(cantidad(80, f, 'g'), '87 g');
});

test('quiero usar 700 g de harina: el huevo pasa a 1.531 g', () => {
  const f = factorDesde(80, 700);
  assert.equal(cantidad(175, f, 'g'), '1.531 g');
});

test('los grupos fuera de la masa no suman, los rangos cuentan por el medio, los ml como g', () => {
  const r = masaTotal([
    { lista: [ing(400, { unidad: 'ml' }), ing([10, 20])] },
    { grupo: 'Corrección', fuera_de_la_masa: true, lista: [ing(96)] },
  ]);
  assert.deepEqual(r, { total: 415, fuera: ['Corrección'], hayMl: true });
});

test('por huevos: 4 huevos de 50 g sobre 175 g', () => {
  const f = factorPorUnidades(175, 4, 50);
  assert.equal(cantidad(200, f, 'g'), '229 g'); // chocolate
  assert.equal(unidades(175, 50), '3,5');
  assert.equal(unidades(175 * f, 50), '4');
});

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

test('caso testigo: brownie de 20×20 a 30×30 es ×2,25', () => {
  const f = factorPorMolde({ forma: 'rectangular', ancho: 20, largo: 20 }, { forma: 'rectangular', ancho: 30, largo: 30 });
  assert.equal(f, 2.25);
  assert.equal(cantidad(175, f, 'g'), '394 g'); // manteca
  assert.equal(rinde(16, f), 36); // 6 × 6 cuadrados de 5 cm
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
