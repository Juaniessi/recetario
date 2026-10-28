import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vacia, filtrar, contarRama, contarValor, leerSeleccion, escribirSeleccion, normalizar } from './filtros.js';

const r = (nombre, cats, sabor, equipo, ing) => ({ nombre, cats, sabor: [sabor], equipo, ing, texto: normalizar(nombre) });

// Las 10 recetas de la carga inicial, como quedaron en la tabla del plan.
const RECETAS = [
  r('Brownie', ['postres-y-pasteleria/tortas-budines-y-brownies'], 'dulce', ['horno'], ['chocolate']),
  r('Waffles dulces', ['desayuno-y-merienda/waffles'], 'dulce', ['waflera'], ['harina']),
  r('Waffles salados', ['desayuno-y-merienda/waffles'], 'salado', ['waflera'], ['harina']),
  r('Ciabatta', ['panes-y-masas/panes'], 'salado', ['horno'], ['harina']),
  r('Miga regular', ['panes-y-masas/panes'], 'salado', ['horno'], ['harina']),
  r('Pehuenut', ['helados/paletas'], 'dulce', ['freezer'], ['avellana']),
  r('Pehuenia', ['helados/paletas'], 'dulce', ['freezer'], ['pistacho', 'chocolate']),
  r('Coco, yogur y limón', ['helados/paletas'], 'dulce', ['freezer'], ['coco', 'yogur']),
  r('Cobertura', ['postres-y-pasteleria/chocolate', 'basicos'], 'dulce', ['sin-horno'], ['chocolate']),
  r('Ganache', ['postres-y-pasteleria/chocolate', 'basicos'], 'dulce', ['sin-horno'], ['chocolate']),
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
