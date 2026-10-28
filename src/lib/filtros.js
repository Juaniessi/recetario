// Cuentas de los filtros del inicio. Sin DOM: se usan en la página y en los tests.
//
// Una receta: { cats, sabor, equipo, ingredientes, texto }.
//   - ingredientes: los nombres de sus ingredientes, ya normalizados.
// La selección: { cat, sabor, equipo, ing, q }.
//   - cat: una rama del árbol ("helados" o "helados/paletas"), o "".
//   - sabor, equipo: listas. Dentro de un grupo suman; entre grupos restan.
//   - ing: lo que se escribió en «Ingrediente». Cada palabra tiene que estar en
//     algún ingrediente de la receta («chocolate coco» = las que llevan los dos).
//   - q: el buscador de arriba, que mira todo.

export const GRUPOS = ['sabor', 'equipo'];

export function vacia() {
  return { cat: '', sabor: [], equipo: [], ing: '', q: '' };
}

export function normalizar(texto) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

// Una receta está en "helados" si cuelga de "helados" o de "helados/lo-que-sea".
export function enRama(receta, cat) {
  return !cat || receta.cats.some((c) => c === cat || c.startsWith(`${cat}/`));
}

function pasa(receta, sel) {
  if (!enRama(receta, sel.cat)) return false;
  for (const g of GRUPOS) {
    if (sel[g].length && !sel[g].some((v) => receta[g].includes(v))) return false;
  }
  if (sel.ing && ingredientesQueCoinciden(receta, sel.ing) === null) return false;
  if (sel.q && !palabrasDe(sel.q).every((p) => receta.texto.includes(p))) return false;
  return true;
}

const palabrasDe = (texto) => normalizar(texto).split(/\s+/).filter(Boolean);

// Los ingredientes de la receta que coinciden con lo escrito, o null si alguna
// palabra no aparece en ninguno.
export function ingredientesQueCoinciden(receta, texto) {
  const palabras = palabrasDe(texto);
  const indices = new Set();
  for (const p of palabras) {
    const hallados = receta.ingredientes.flatMap((nombre, i) => (nombre.includes(p) ? [i] : []));
    if (!hallados.length) return null;
    hallados.forEach((i) => indices.add(i));
  }
  return [...indices].sort((a, b) => a - b);
}

export function filtrar(recetas, sel) {
  return recetas.filter((r) => pasa(r, sel));
}

// Cuántas trae un botón del árbol con el resto de lo elegido.
export function contarRama(recetas, sel, cat) {
  return filtrar(recetas, { ...sel, cat }).length;
}

// Cuántas trae un botón transversal: lo demás elegido, y ese valor en su grupo.
export function contarValor(recetas, sel, grupo, valor) {
  return filtrar(recetas, { ...sel, [grupo]: [valor] }).length;
}

export function alternar(lista, valor) {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

// La selección vive en la dirección: ?cat=helados&sabor=dulce&equipo=horno,waflera
export function leerSeleccion(search) {
  const p = new URLSearchParams(search);
  const lista = (k) => (p.get(k) ? p.get(k).split(',').filter(Boolean) : []);
  return { cat: p.get('cat') ?? '', sabor: lista('sabor'), equipo: lista('equipo'), ing: p.get('ing') ?? '', q: p.get('q') ?? '' };
}

export function escribirSeleccion(sel) {
  const p = new URLSearchParams();
  if (sel.cat) p.set('cat', sel.cat);
  for (const g of GRUPOS) if (sel[g].length) p.set(g, sel[g].join(','));
  if (sel.ing) p.set('ing', sel.ing);
  if (sel.q) p.set('q', sel.q);
  const s = p.toString().replaceAll('%2F', '/').replaceAll('%2C', ',');
  return s ? `?${s}` : '';
}
