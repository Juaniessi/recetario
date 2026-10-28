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

// Acepta "2,25" y "2.25". Devuelve null si no es un número positivo.
export function leerNumero(texto) {
  const valor = Number(String(texto).trim().replace(',', '.'));
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}
