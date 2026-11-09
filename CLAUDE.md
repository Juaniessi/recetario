# Recetario: cómo trabaja Claude acá

Este archivo se carga solo en cualquier sesión de Claude Code que trabaje en
esta carpeta. Lo pidió Juan el 09/11/2026: armar recetas con él desde cualquier
sesión y subirlas.

Sitio: https://juaniessi.github.io/recetario/ (personal, público pero sin indexar).
Repo: `Juaniessi/recetario`. Una receta = un archivo `.md` en `src/content/recetas/`.

## Antes de escribir una receta

Leé `COMO-AGREGAR-RECETA.md` (el formato), `_plantilla.md`, `src/data/categorias.yml`
(el árbol) y una receta parecida de `src/content/recetas/`.

## El flujo

1. **Juan pasa la receta**: texto, otro chat, una foto o un video.
   - YouTube: abrir el panel «Transcripción» del video en el navegador de la app.
   - Reel de Instagram: se ve sin iniciar sesión. El texto del posteo suele
     traer solo los ingredientes. Si el video tiene subtítulos pegados en la
     imagen, se leen dibujando cuadros del `<video>` en un `<canvas>` propio
     puesto encima de todo (el cartel de inicio de sesión tapa el video; no
     esconderlo, porque se lleva el video con él).
2. **Se discute antes de escribir.** Mostrale lo que hay que decidir:
   conversiones de tazas o cucharadas a gramos, cantidades estimadas porque la
   fuente no las da, en qué ramas va, qué cambia de la original. Ante la duda,
   preguntar.
3. **Escribir el `.md`.** Nuevas recetas sin probar van con `estado: en-prueba`.
4. **Verificar**: `npm run build` (si una receta está mal, dice cuál y qué
   campo), y mirarla en la vista previa: `preview_start` con el nombre
   `recetario` (está en `C:\Proyectos Claude\.claude\launch.json`), página
   `http://localhost:4321/recetario/<archivo-sin-.md>/`. Revisar que los pasos
   se lean bien con las cantidades reemplazadas.
5. **Subir, solo si Juan lo pide** (ver abajo).

## Subir: con el script, nunca con git a mano

**Claude no hace `git commit` ni `git push` en este repo.** Se sube siempre con
`subir-recetas.bat`, que revisa todo, hace el commit y el push, borra la
autorización de GitHub de la PC al terminar y espera a que el sitio se publique.

- Probar sin subir: `subir-recetas.bat --prueba` (o `node scripts/subir.mjs --prueba`).
- Para subir, cuando Juan lo pide: correr `subir-recetas.bat` **en su terminal**
  (la herramienta `run_in_terminal`), no en el Bash de Claude. El script pregunta
  «¿Subo estos cambios? (s/n)», pide una línea de descripción y abre la ventana
  de GitHub: **Juan responde y autoriza**. Avisale que la ventana va a aparecer.
- O Juan le da doble click al `.bat` él mismo. Las dos vías son iguales.
- En la ventana de GitHub: *Sign in with your browser*. **Nunca usuario y
  contraseña en la terminal**: GitHub los rechaza (ya pasó).
- El script sube **todo** lo que cambió en la carpeta. Antes de lanzarlo,
  `git status --short` y contale a Juan qué va a subir.

## Reglas del formato (las que más se olvidan)

- **Gramos y mililitros siempre**, también el huevo (`unidad_natural`, 50 g = 1).
- **Las cantidades dentro de los pasos van como `{id}`**, nunca un número fijo.
  `{rinde}` da lo que rinde. Un `{id}` que no existe corta la compilación.
- Correcciones, coberturas, alternativas y extracciones van en un grupo con
  `fuera_de_la_masa: true`.
- `datos` es una lista de `Clave: valor`. **No poner la línea entre comillas**:
  queda como texto y el esquema la rechaza.
- **Un valor con `: ` adentro** (un título de video, por ejemplo) **va entre
  comillas**, o el YAML se rompe.
- `categorias` tiene que existir en `categorias.yml`. Para una rama nueva, se
  agrega ahí. `equipo`: horno, waflera, cacerola, sarten, freezer, sin-horno.
  `sabor`: dulce o salado.
- **La fuente nunca se inventa**: si no hay link real, va solo el autor. Las
  cantidades que no son de la fuente se dicen en `fuente.aclaracion` y en las
  notas («estimación»).
- **El nombre de una persona sale de lo que dijo Juan**, nunca de deducirlo
  (en un video, el usuario de la cuenta y no un nombre sacado de los comentarios).
- Voseo, nombres y marcas locales (Tronador, Pehuenia), secciones en este orden:
  Procedimiento, Notas, Cambios respecto de la original, Registro de pruebas,
  Pendiente.
- **Registro de pruebas**: `- **DD/MM/AAAA — molde o variante.**` y después qué
  pasó, con el tiempo real en su horno, temperaturas medidas y qué cambiaría.
  Si la prueba cambia un dato (tiempo de horno), actualizar también `datos`.

## Trampas de esta PC

- No hay Python: para scripts, Node.
- `npm run build` a veces termina con «Assertion failed … async.c»: es ruido de
  Node en Windows después de terminar; lo que vale es si dice `Complete!` o un error.

## Al terminar

- Si se armó o cambió algo del proyecto (no una receta suelta), actualizar
  `LEEME.md` de esta carpeta y la sección `PP\recetario` del `LEEME.md` de la raíz.
- Lo que valga para más de una sesión, a la memoria de la raíz
  (`recetario.md`).
