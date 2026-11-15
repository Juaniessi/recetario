// Sube al sitio los cambios del recetario. Lo abre subir-recetas.bat.
//
// 1. Muestra qué archivos cambiaron.
// 2. Corre las pruebas y compila: si una receta tiene un error, frena acá.
// 3. Pide confirmación, hace el commit y el push.
// 4. Borra la autorización de GitHub de esta PC, así ningún otro programa
//    (ni Claude) puede subir sin que Juan vuelva a autorizar en el navegador.
// 5. Espera a que GitHub termine de publicar.
//
// «node scripts/subir.mjs --prueba» hace los pasos 1 y 2 y no sube nada.

import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const REPO = 'Juaniessi/recetario';
const SITIO = 'https://juaniessi.github.io/recetario/';
const prueba = process.argv.includes('--prueba');

// Corre un comando en la carpeta del recetario. «ver» muestra la salida en pantalla.
function correr(cmd, args, { ver = false, entrada } = {}) {
  const r = spawnSync(cmd, args, {
    cwd: RAIZ,
    encoding: 'utf8',
    shell: process.platform === 'win32' && cmd === 'npm',
    stdio: ver ? 'inherit' : ['pipe', 'pipe', 'pipe'],
    input: entrada,
  });
  return { ok: r.status === 0, salida: (r.stdout ?? '') + (r.stderr ?? '') };
}

const git = (...args) => correr('git', args);
const titulo = (t) => console.log(`\n=== ${t} ===\n`);

function salir(mensaje) {
  console.log(`\n${mensaje}`);
  process.exit(1);
}

// Qué significa cada letra de «git status --short».
function explicar(linea) {
  const estado = linea.slice(0, 2).trim();
  const archivo = linea.slice(3).replace(/^"|"$/g, '');
  const nombres = { '??': 'nuevo', A: 'nuevo', M: 'cambiado', D: 'borrado', R: 'renombrado' };
  const que = nombres[estado] ?? nombres[estado[0]] ?? estado;
  return `  ${que.padEnd(11)} ${archivo}`;
}

async function esperarPublicacion(sha) {
  // La Action del repo es pública: se puede consultar sin autorización.
  const url = `https://api.github.com/repos/${REPO}/actions/runs?head_sha=${sha}&per_page=1`;
  const hasta = Date.now() + 5 * 60_000;
  process.stdout.write('Esperando a GitHub (suele tardar 1 o 2 minutos; un punto cada 10 segundos)');
  while (Date.now() < hasta) {
    await new Promise((r) => setTimeout(r, 10_000));
    process.stdout.write('.');
    try {
      const run = (await (await fetch(url)).json()).workflow_runs?.[0];
      if (run?.status === 'completed') {
        console.log('');
        return run.conclusion === 'success'
          ? `Listo: el sitio ya está actualizado. ${SITIO}`
          : `La publicación falló (${run.conclusion}). Mirá el detalle en ${run.html_url}`;
      }
    } catch {
      // Sin internet o GitHub lento: se vuelve a probar en 10 segundos.
    }
  }
  console.log('');
  return `GitHub sigue publicando. Mirá cómo va en https://github.com/${REPO}/actions`;
}

titulo('Qué cambió');
const cambios = git('status', '--short', '--untracked-files=all').salida.split('\n').filter(Boolean);
git('fetch', '--quiet', 'origin');
const sinSubir = git('rev-list', '--count', 'origin/main..HEAD').salida.trim();
const pendientes = Number(sinSubir) || 0;

if (!cambios.length && !pendientes) {
  console.log('No hay nada para subir: el sitio ya tiene todo.');
  process.exit(0);
}
cambios.forEach((l) => console.log(explicar(l)));
if (pendientes) console.log(`  ...y ${pendientes} cambio(s) guardado(s) de antes que todavía no se subieron.`);

titulo('Revisando que las recetas estén bien');
const pruebas = correr('npm', ['test', '--silent']);
if (!pruebas.ok) salir(`${pruebas.salida}\nLas pruebas fallaron. No se subió nada.`);
const build = correr('npm', ['run', 'build', '--silent']);
if (!build.ok) {
  // Del error de Astro sirve el principio: dice qué receta y qué campo. El resto es ruido.
  const lineas = build.salida.replace(/\x1b\[[0-9;]*m/g, '').split('\n');
  const desde = Math.max(0, lineas.findIndex((l) => /Error\]/.test(l)));
  const hasta = lineas.findIndex((l, i) => i > desde && /^\s*(Hint:|Stack trace:|Location:)/.test(l));
  const util = lineas.slice(desde, hasta === -1 ? desde + 15 : hasta).filter((l) => l.trim()).join('\n');
  salir(`${util}\n\nHay un error en una receta (arriba dice cuál). No se subió nada.`);
}
console.log('Todo bien: compila sin errores.');

if (prueba) {
  console.log('\nModo prueba: no se sube nada.');
  process.exit(0);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
titulo('Subir');
if ((await rl.question('¿Subo estos cambios al sitio? (s/n): ')).trim().toLowerCase() !== 's') {
  rl.close();
  salir('No se subió nada.');
}
if (cambios.length) {
  const nota = (await rl.question('Una línea que describa el cambio (Enter para dejarla en blanco): ')).trim();
  const mensaje = nota || `Recetas: ${cambios.length} archivo(s) actualizado(s)`;
  git('add', '--all');
  const commit = git('commit', '--quiet', '-m', mensaje);
  if (!commit.ok) {
    rl.close();
    salir(`No se pudo guardar el cambio:\n${commit.salida}`);
  }
}
rl.close();

console.log('\nSe va a abrir la ventana de GitHub: elegí «Sign in with your browser» y autorizá.');
console.log('(No escribas usuario ni contraseña acá: GitHub no los acepta.)\n');
const push = correr('git', ['push', '--quiet', 'origin', 'main'], { ver: true });

// Pase lo que pase con el push, la autorización no queda guardada.
correr('git', ['credential', 'reject'], { entrada: 'protocol=https\nhost=github.com\n\n' });

if (!push.ok) {
  salir('No se pudo subir (¿se cerró la ventana de GitHub?). El cambio quedó guardado en esta PC: volvé a abrir el script y lo sube.');
}

titulo('Publicando');
console.log(await esperarPublicacion(git('rev-parse', 'HEAD').salida.trim()));
