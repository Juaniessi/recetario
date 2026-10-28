// Armado de la página de una receta, al compilar.
import { cantidad, rinde, unidades } from './escala.js';

const escapar = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Una cantidad que el script de la página reescala. Si no escala, texto fijo.
export function htmlCantidad(base, unidad, escala = true) {
  const texto = cantidad(base, 1, unidad);
  if (!escala) return `<span class="cant fija">${texto}</span>`;
  const datos = Array.isArray(base) ? base.join(',') : base;
  return `<span class="cant" data-base="${datos}" data-unidad="${escapar(unidad)}">${texto}</span>`;
}

export function htmlRinde(r) {
  return `<span class="cant" data-base="${r.cantidad}" data-unidad="${escapar(r.unidad)}" data-entero>${rinde(r.cantidad, 1)} ${escapar(r.unidad)}</span>`;
}

export function htmlIngrediente(ing) {
  if (ing.cantidad === undefined) return `<span class="cant fija">${escapar(ing.texto)}</span>`;
  return htmlCantidad(ing.cantidad, ing.unidad, ing.escala);
}

// "≈ 3,5 huevos", que el script de la página recalcula al escalar.
export function htmlUnidadNatural(ing) {
  const u = ing.unidad_natural;
  if (!u || Array.isArray(ing.cantidad)) return '';
  const n = unidades(ing.cantidad, u.gramos);
  return `<span class="natural" data-base="${ing.cantidad}" data-gramos="${u.gramos}" data-nombre="${escapar(u.nombre)}" data-plural="${escapar(u.plural)}">≈ ${n} ${n === '1' ? escapar(u.nombre) : escapar(u.plural)}</span>`;
}

// Reemplaza {id} y {rinde} en el procedimiento por la cantidad escalable.
// Un {id} que no existe corta la compilación: mejor un error que un paso mudo.
export function reemplazarCantidades(html, receta, archivo) {
  const porId = new Map();
  for (const grupo of receta.ingredientes) for (const ing of grupo.lista) if (ing.id) porId.set(ing.id, ing);
  return html.replace(/\{([a-z0-9-]+)\}/g, (_, id) => {
    if (id === 'rinde') {
      if (!receta.rinde) throw new Error(`${archivo}: un paso usa {rinde} y la receta no tiene «rinde».`);
      return htmlRinde(receta.rinde);
    }
    const ing = porId.get(id);
    if (!ing) throw new Error(`${archivo}: un paso usa {${id}} y no hay ningún ingrediente con «id: ${id}».`);
    return htmlIngrediente(ing);
  });
}

export const ETIQUETAS = {
  estado: { final: 'Final', 'en-prueba': 'En prueba', pendiente: 'Pendiente' },
  sabor: { dulce: 'Dulce', salado: 'Salado' },
  equipo: { horno: 'Horno', waflera: 'Waflera', freezer: 'Freezer', 'sin-horno': 'Sin horno' },
};

// "pistacho" -> "Pistacho" · "dulce-de-leche" -> "Dulce de leche"
export function etiquetaIngrediente(slug) {
  const t = slug.replaceAll('-', ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}
