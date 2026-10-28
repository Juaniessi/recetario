import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vacia, filtrar, contarRama, contarValor, leerSeleccion, escribirSeleccion, normalizar, ingredientesQueCoinciden } from './filtros.js';

const r = (nombre, cats, sabor, equipo, ingredientes) => ({ nombre, cats, sabor: [sabor], equipo, ingredientes: ingredientes.map(normalizar), texto: normalizar(nombre) });

// Las 10 recetas, con algunos de sus ingredientes.
const RECETAS = [
  r('Brownie', ['postres-y-pasteleria/tortas-budines-y-brownies'], 'dulce', ['horno'], ['Manteca sin sal', 'Chocolate Tronador 71 %', 'Huevos', 'Harina 0000 común']),
  r('Waffles dulces', ['desayuno-y-merienda/waffles'], 'dulce', ['waflera'], ['Harina leudante', 'Harina integral', 'Huevo', 'Ralladura de mandarina']),
  r('Waffles salados', ['desayuno-y-merienda/waffles'], 'salado', ['waflera'], ['Harina leudante', 'Huevo', 'Ajo en polvo']),
  r('Ciabatta', ['panes-y-masas/panes'], 'salado', ['horno'], ['Harina panadera', 'Miel']),
  r('Miga regular', ['panes-y-masas/panes'], 'salado', ['horno'], ['Harina panadera']),
  r('Pehuenut', ['helados/paletas'], 'dulce', ['freezer', 'cacerola'], ['Untable Pehuenut', 'Leche deslactosada']),
  r('Pehuenia', ['helados/paletas'], 'dulce', ['freezer'], []),
  r('Coco, yogur y limón', ['helados/paletas'], 'dulce', ['freezer'], ['Coco rallado', 'Yogur griego', 'Chocolate blanco', 'Jugo de limón']),
  r('Cobertura', ['postres-y-pasteleria/chocolate', 'basicos'], 'dulce', ['sin-horno'], ['Chocolate cobertura Tronador 54 %', 'Aceite neutro']),
  r('Ganache', ['postres-y-pasteleria/chocolate', 'basicos'], 'dulce', ['sin-horno', 'cacerola'], ['Chocolate cobertura', 'Crema de leche', 'Manteca']),
];

const nombres = (sel) => filtrar(RECETAS, { ...vacia(), ...sel }).map((x) => x.nombre);

test('sin filtros salen las 10', () => {
  assert.equal(nombres({}).length, 10);
});

test('Dulce trae 7', () => {
  assert.equal(nombres({ sabor: ['dulce'] }).length, 7);
});

test('Dulce y Horno deja solo el brownie', () => {
  assert.deepEqual(nombres({ sabor: ['dulce'], equipo: ['horno'] }), ['Brownie']);
});

test('dentro de un grupo suman: Horno o Waflera', () => {
  assert.equal(nombres({ equipo: ['horno', 'waflera'] }).length, 5);
});

test('Helados trae las tres paletas', () => {
  assert.deepEqual(nombres({ cat: 'helados' }), ['Pehuenut', 'Pehuenia', 'Coco, yogur y limón']);
});

test('una receta en dos ramas sale en las dos', () => {
  assert.deepEqual(nombres({ cat: 'basicos' }), ['Cobertura', 'Ganache']);
  assert.deepEqual(nombres({ cat: 'postres-y-pasteleria/chocolate' }), ['Cobertura', 'Ganache']);
  assert.equal(nombres({ cat: 'postres-y-pasteleria' }).length, 3);
});

test('Comidas principales está vacía', () => {
  assert.equal(contarRama(RECETAS, vacia(), 'comidas-principales'), 0);
});

test('los conteos siguen lo elegido', () => {
  const sel = { ...vacia(), sabor: ['dulce'] };
  assert.equal(contarValor(RECETAS, sel, 'equipo', 'horno'), 1);
  assert.equal(contarValor(RECETAS, sel, 'equipo', 'waflera'), 1);
  assert.equal(contarValor(RECETAS, sel, 'sabor', 'salado'), 3); // el propio grupo no se resta
  assert.equal(contarRama(RECETAS, sel, 'panes-y-masas'), 0);
});

test('buscador sin acentos ni mayúsculas', () => {
  assert.deepEqual(nombres({ q: 'LIMON' }), ['Coco, yogur y limón']);
});

test('la selección va y vuelve de la dirección', () => {
  const sel = { ...vacia(), cat: 'helados/paletas', sabor: ['dulce'], equipo: ['horno', 'waflera'] };
  const s = escribirSeleccion(sel);
  assert.equal(s, '?cat=helados/paletas&sabor=dulce&equipo=horno,waflera');
  assert.deepEqual(leerSeleccion(s), sel);
  assert.equal(escribirSeleccion(vacia()), '');
});

test('ingrediente escrito: chocolate trae las que lo llevan', () => {
  assert.deepEqual(nombres({ ing: 'chocolate' }), ['Brownie', 'Coco, yogur y limón', 'Cobertura', 'Ganache']);
});

test('ingrediente escrito: cada palabra en algún ingrediente', () => {
  assert.deepEqual(nombres({ ing: 'coco limon' }), ['Coco, yogur y limón']);
  assert.deepEqual(nombres({ ing: 'harina huevo' }), ['Brownie', 'Waffles dulces', 'Waffles salados']);
  assert.deepEqual(nombres({ ing: 'trufa' }), []);
});

test('ingrediente escrito: dice cuáles coincidieron', () => {
  assert.deepEqual(ingredientesQueCoinciden(RECETAS[1], 'HARINA'), [0, 1]);
  assert.equal(ingredientesQueCoinciden(RECETAS[1], 'harina chocolate'), null);
});

test('cacerola trae Pehuenut y ganache', () => {
  assert.deepEqual(nombres({ equipo: ['cacerola'] }), ['Pehuenut', 'Ganache']);
});

test('el ingrediente escrito también va a la dirección', () => {
  const sel = { ...vacia(), ing: 'dulce de leche' };
  assert.equal(escribirSeleccion(sel), '?ing=dulce+de+leche');
  assert.deepEqual(leerSeleccion(escribirSeleccion(sel)), sel);
});
