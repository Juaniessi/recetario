// Lee el árbol de src/data/categorias.yml. Corre solo al compilar.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

export function leerArbol() {
  const texto = readFileSync(join(process.cwd(), 'src/data/categorias.yml'), 'utf8');
  return parse(texto).map((rama) => ({
    id: rama.id,
    nombre: rama.nombre,
    aclaracion: rama.aclaracion ?? '',
    sub: (rama.sub ?? []).map((s) => ({ id: `${rama.id}/${s.id}`, nombre: s.nombre })),
  }));
}

// Todos los ids válidos: "helados" y "helados/paletas".
export function idsValidos(arbol = leerArbol()) {
  return new Set(arbol.flatMap((r) => [r.id, ...r.sub.map((s) => s.id)]));
}

// "postres-y-pasteleria/chocolate" -> "Postres y pastelería › Chocolate"
export function nombreDeRama(id, arbol = leerArbol()) {
  const [padre, hijo] = id.split('/');
  const rama = arbol.find((r) => r.id === padre);
  if (!rama) return id;
  if (!hijo) return rama.nombre;
  const sub = rama.sub.find((s) => s.id === id);
  return `${rama.nombre} › ${sub ? sub.nombre : hijo}`;
}
