# Recetario: cómo trabaja Claude acá

Este archivo se carga solo en cualquier sesión de Claude Code que trabaje en
esta carpeta, en cualquier PC. Lo pidió Juan el 09/11/2026 (armar recetas con
él desde cualquier sesión y subirlas) y lo amplió el 25/11/2026: **todo lo que
hace falta saber vive en el repo**, para que el Claude de su casa lo lea y Juan
suba recetas desde allá.

Sitio: https://juaniessi.github.io/recetario/ (personal, público pero sin indexar).
Repo: `Juaniessi/recetario`. Una receta = un archivo `.md` en `src/content/recetas/`.

Qué leer, según lo que haya que hacer:

| Para | Leer |
|---|---|
| Escribir o corregir una receta | `COMO-AGREGAR-RECETA.md` (el formato), `_plantilla.md`, `src/data/categorias.yml` (el árbol) y una receta parecida |
| Entender cómo está hecho el sitio, las decisiones y lo pendiente | `LEEME.md` |
| Subir | la sección «Subir» de acá abajo |

## Quién es Juan y cómo trabajar con él

- Juan usa el sitio **en la cocina, desde el celular**. Lo central son las
  **categorías** (árbol por tipo de comida, con comidas principales separadas
  de postres, más botones Dulce / Salado, Equipo e Ingrediente principal) y
  **escalar** (por molde o fuente, por huevos enteros, por un ingrediente, por
  masa total, por rinde y por un número; todas a la vista en pestañas).
- Escribir en castellano rioplatense, con voseo. Nombres y marcas locales
  (Tronador, Pehuenia, Las Tres Niñas).
- **Ante la duda, preguntar.** Juan puede dar por sentado que Claude se acuerda
  de algo que no tiene: preguntarle si ya se trabajó.
- Estética: clara, en pastel, fondo blanco, sin modo oscuro. **Nada cortado a la
  derecha**: los botones bajan de renglón, no se deslizan de costado.

## El flujo

1. **Juan pasa la receta**: texto, otro chat, una foto o un video.
   - YouTube: abrir el panel «Transcripción» del video en el navegador.
   - Reel de Instagram: se ve sin iniciar sesión. El texto del posteo (tocar
     «más» y leer `main.innerText`) suele traer solo los ingredientes.
   - Si el reel tiene subtítulos pegados en la imagen: poner un `<canvas>`
     propio, fijo y encima de todo, y dibujar ahí cuadros del `<video>` en una
     grilla (por ejemplo 3 × 3, un cuadro cada 2 segundos, recortando la franja
     de los subtítulos); después, captura de pantalla y leer. **No esconder el
     cartel de inicio de sesión**: se lleva el video con él.
   - Si el panel del navegador está oculto, mover el video (`currentTime`) se
     cuelga: pedirle a Juan que lo muestre, o trabajar en tandas chicas.
   - Si el video no da cantidades ni las dice, **no inventarlas**: decírselo a
     Juan y que él decida.
2. **Se discute antes de escribir.** Mostrale lo que hay que decidir:
   conversiones de tazas o cucharadas a gramos, cantidades estimadas porque la
   fuente no las da, en qué ramas va, qué cambia de la original.
3. **Escribir el `.md`.** Nuevas recetas sin probar van con `estado: en-prueba`.
4. **Verificar**: `npm run build` (si una receta está mal, dice cuál y qué
   campo), y mirarla en la vista previa: `preview_start` con el nombre
   `recetario` (está en `.claude/launch.json` de este repo), página
   `http://localhost:4321/recetario/<archivo-sin-.md>/`. La vista previa muestra
   lo último compilado: correr `npm run build` antes. Revisar que los pasos se
   lean bien con las cantidades reemplazadas.
5. **Subir, solo si Juan lo pide** (ver abajo).

## Subir: con el script, nunca con git a mano

**Claude no hace `git commit` ni `git push` en este repo**, en ninguna PC.
**Why:** que nada se publique sin que Juan lo apruebe, y que no quede una
autorización de GitHub guardada en la PC. Se sube siempre con
`subir-recetas.bat` (en Windows; en otro sistema, `node scripts/subir.mjs`):

1. Si se subió algo desde otra PC o desde la web de GitHub, lo trae primero.
2. Muestra qué cambió, corre las pruebas y compila. Si algo está mal, frena.
3. Pregunta «¿Subo estos cambios al sitio? (s/n)» y pide una línea que describa
   el cambio.
4. Hace el commit y el push: **se abre la ventana de GitHub**, Juan elige *Sign
   in with your browser* y autoriza en el navegador.
5. Borra la autorización de la PC, salga bien o mal.
6. Espera a que GitHub publique (uno o dos minutos) y dice «Listo».

Cómo lo usa Claude:

- Probar sin subir: `node scripts/subir.mjs --prueba` (pasos 1 y 2).
- Antes de subir, `git status --short` y contale a Juan qué va a subir: el
  script sube **todo** lo que cambió en la carpeta.
- Si la sesión tiene la herramienta `run_in_terminal` (la app de escritorio de
  Claude): lanzar `subir-recetas.bat` **en la terminal de Juan**, nunca en el
  Bash de Claude, y decirle que tiene que responder y autorizar. Si no la tiene
  (Claude Code en una terminal), pedirle a Juan que le dé doble click al `.bat`
  o que lo corra él. El script necesita que Juan escriba: Claude no puede
  responderle.
- **Nunca usuario y contraseña en la terminal**: GitHub no los acepta (ya pasó).
- Si el push falla (se cerró la ventana de GitHub), el commit queda guardado en
  la PC y la próxima vez que se abre el script lo sube. **No decirle a Juan que
  está en el sitio sin verlo**: comprobar que la página responde
  (`https://juaniessi.github.io/recetario/<archivo-sin-.md>/`) o leer el final
  de la terminal.

## Preparar otra PC (una sola vez)

Lo que necesita, y cómo comprobarlo:

1. **Git para Windows** (`git --version`), que trae el Git Credential Manager:
   es el que abre la ventana de GitHub al subir.
2. **Node 22.23 o más** (`node --version`). Lo pide Astro 7.
3. Traer el repo (es público: no pide autorización):
   ```
   git clone https://github.com/Juaniessi/recetario.git
   cd recetario
   npm ci
   ```
4. Decirle a git quién es Juan (si falta, el script lo avisa y dice cómo):
   ```
   git config --global user.name "Juan"
   git config --global user.email "<el mail de su cuenta de GitHub>"
   ```
5. Probar: `node scripts/subir.mjs --prueba` tiene que terminar en «Todo bien:
   compila sin errores».
6. Abrir las sesiones de Claude **en la carpeta del repo**, así se carga este
   archivo y la vista previa (`.claude/launch.json`) funciona.

**Trabajar en dos PC:** cada una tiene su copia. Antes de tocar una receta,
`git pull` (traer no es subir: está permitido y no pide autorización). El
script igual trae lo nuevo antes de subir. Si la misma receta cambió en las
dos PC, el script frena y lo avisa: resolver el choque con Juan, mirando las
dos versiones.

## Reglas del formato (las que más se olvidan)

- **Gramos y mililitros siempre**, también el huevo (`unidad_natural`, 50 g = 1).
- **Las cantidades dentro de los pasos van como `{id}`**, nunca un número fijo.
  `{rinde}` da lo que rinde. Un `{id}` que no existe corta la compilación.
  Los `id` van solo con minúsculas, números y guiones: `agua-gelatina`, no
  `agua_gelatina`.
- Para que se pueda escalar por molde o fuente, la receta lleva `molde`
  (`forma: rectangular` con `ancho` y `largo`, o `forma: redondo` con
  `diametro`, en cm).
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
- Secciones en este orden: Procedimiento, Notas, Cambios respecto de la
  original, Registro de pruebas, Pendiente.
- **Registro de pruebas**: `- **DD/MM/AAAA — molde o variante.**` y después qué
  pasó, con el tiempo real en su horno, temperaturas medidas y qué cambiaría.
  Si la prueba cambia un dato (tiempo de horno, una cantidad), actualizar
  también `datos` o el ingrediente, y explicarlo en «Cambios respecto de la
  original».

## Trampas

- En la PC del trabajo no hay Python: para scripts, Node.
- `npm run build` a veces termina con «Assertion failed … async.c»: es ruido de
  Node en Windows después de terminar; lo que vale es si dice `Complete!` o un error.
- Astro 7 trae su propio motor de Markdown: los `{id}` se reemplazan sobre el
  HTML ya armado (`src/lib/receta.js`), no con un plugin de remark.

## Al terminar

- Si se armó o cambió algo del proyecto (no una receta suelta), actualizar
  `LEEME.md` de este repo: es el registro que ven todas las PC.
- Lo pendiente (recetas que faltan, pruebas por anotar) va en la sección
  «Pendientes» de `LEEME.md`.
- En la PC del trabajo, además: la sección `PP\recetario` del `LEEME.md` de
  `C:\Proyectos Claude` y la memoria compartida (`recetario.md`).
