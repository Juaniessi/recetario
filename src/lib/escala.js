// Cuentas del escalado. Sin DOM: se usan en la página y en los tests.

// Redondeo de cocina: un decimal debajo de 10, enteros arriba.
export function redondear(valor) {
  if (valor < 10) return Math.round(valor * 10) / 10;
  return Math.round(valor);
}

// 1.5 -> "1,5" · 384 -> "384" · 1200 -> "1.200"
export function numero(valor) {
  return valor.toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

// base es un número o un rango [desde, hasta].
export function cantidad(base, factor, unidad) {
  const [desde, hasta] = Array.isArray(base) ? base : [base];
  const a = numero(redondear(desde * factor));
  const texto = hasta === undefined ? a : `${a}–${numero(redondear(hasta * factor))}`;
  return unidad ? `${texto} ${unidad}` : texto;
}

// Piezas, porciones, paletas: siempre enteros, nunca menos de 1.
export function rinde(base, factor) {
  return Math.max(1, Math.round(base * factor));
}

export function superficie(molde) {
  if (molde.forma === 'redondo') return Math.PI * (molde.diametro / 2) ** 2;
  return molde.ancho * molde.largo;
}

// Mismo espesor: escala por superficie. 30×30 sobre 20×20 = 2,25.
export function factorPorMolde(original, nuevo) {
  return superficie(nuevo) / superficie(original);
}

// "Tengo 384 g de huevo": el factor sale de lo que hay contra lo que pide.
export function factorDesde(base, tengo) {
  const pide = Array.isArray(base) ? base[0] : base;
  return tengo / pide;
}

// "Tengo 3 huevos de 50 g" sobre una receta que pide 175 g.
export function factorPorUnidades(base, unidades, gramosPorUnidad) {
  return (unidades * gramosPorUnidad) / base;
}

// 175 g de huevo a 50 g cada uno -> "3,5". Redondea a medio.
export function unidades(gramos, gramosPorUnidad) {
  return numero(Math.round((gramos / gramosPorUnidad) * 2) / 2);
}

// Masa total de la receta: lo que tiene cantidad y escala, sin opcionales ni
// grupos marcados fuera_de_la_masa. Los ml se cuentan como g (aproximado);
// un rango cuenta por su punto medio.
export function masaTotal(ingredientes) {
  let total = 0;
  const fuera = [];
  let hayMl = false;
  for (const g of ingredientes) {
    if (g.fuera_de_la_masa) {
      fuera.push(g.grupo ?? 'un grupo');
      continue;
    }
    for (const i of g.lista) {
      if (i.cantidad === undefined || !i.escala || i.opcional) continue;
      total += Array.isArray(i.cantidad) ? (i.cantidad[0] + i.cantidad[1]) / 2 : i.cantidad;
      if (i.unidad === 'ml') hayMl = true;
    }
  }
  return { total, fuera, hayMl };
}

// Acepta "2,25" y "2.25". Devuelve null si no es un número positivo.
export function leerNumero(texto) {
  const valor = Number(String(texto).trim().replace(',', '.'));
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}
