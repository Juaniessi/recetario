# Recetario

Sitio propio de recetas de Juan, para usar en la cocina desde el celular.
**Personal, no de Chitza.** Arrancó el 28/10/2026.

- Sitio: https://juaniessi.github.io/recetario/ (público, sin indexar: `noindex` y `robots.txt`)
- Repo: `Juaniessi/recetario`
- Agregar o corregir recetas: ver `COMO-AGREGAR-RECETA.md`.
- Publicado el 28/10/2026. Cada push a `main` publica en menos de un minuto; si
  la Action falla (receta mal escrita), el sitio queda como estaba.
- **Para subir cambios: doble click en `subir-recetas.bat`** (ver más abajo).
  Claude nunca hace git commit ni push: si Juan lo pide, lanza el .bat en la
  terminal de Juan, que responde y autoriza. Guía para Claude: `CLAUDE.md`.

## Cómo está hecho

Astro 7, sitio estático. Cada push a `main` lo compila y publica GitHub Actions
(`.github/workflows/deploy.yml`, copiado del de `comparador-alimentos-mascota-web`).
No hay backend ni base de datos: el escalado y los filtros corren en el navegador.

| Archivo | Qué hace |
|---|---|
| `src/content/recetas/*.md` | Una receta por archivo |
| `src/content.config.ts` | El esquema de la receta. Valida unidades (g, ml) y que las ramas existan |
| `src/data/categorias.yml` | El árbol de categorías por tipo de comida |
| `src/lib/escala.js` | Cuentas del escalado: factor, redondeo, molde, desde un ingrediente |
| `src/lib/filtros.js` | Cuentas de los filtros del inicio |
| `src/lib/receta.js` | Reemplaza `{id}` en los pasos por la cantidad escalable; un `{id}` inexistente corta la compilación |
| `src/pages/index.astro` | Inicio: árbol, botones transversales, buscador, tarjetas |
| `src/pages/[id].astro` | Página de receta: escalado, ingredientes con tilde, pantalla encendida |

## Subir cambios: `subir-recetas.bat` (desde el 28/10/2026)

Doble click. La lógica está en `scripts/subir.mjs`:

1. Muestra qué archivos cambiaron.
2. Corre las pruebas y compila. Si una receta tiene un error, dice cuál y en qué
   campo, y no sube nada.
3. Pregunta si subir y pide una línea que describa el cambio (opcional).
4. Hace el commit y el push. **Se abre la ventana de GitHub: «Sign in with your
   browser» y autorizar.** Nunca usuario y contraseña en la terminal.
5. **Borra la autorización de esta PC apenas termina**, haya salido bien o mal.
   Así nada (ni Claude) puede subir sin que Juan vuelva a autorizar.
6. Espera a que GitHub publique y avisa si salió bien.

Si el push falla (por ejemplo, se cerró la ventana), el cambio queda guardado en
la PC y la próxima vez que se abre el script lo sube.

Desde el 25/11/2026, antes de empezar, el script **trae lo que se haya subido
desde otra PC o desde la web de GitHub**. Si en esa PC falta configurar el
nombre y el mail de git, frena y avisa.

`subir-recetas.bat --prueba` (o `node scripts/subir.mjs --prueba`) hace los
pasos 1 y 2 y no sube nada: es lo que corre Claude para verificar.

## Correrlo en la PC

```
npm install
npm test          # escalado y filtros
npm run build     # compila; si una receta está mal, dice cuál
npm run preview   # http://localhost:4321/recetario/
```

En el navegador de la app de Claude: `preview_start` con el nombre `recetario`
(está en `.claude/launch.json` de este repo).

Para armar otra PC (la de casa, por ejemplo): ver «Preparar otra PC» en
`CLAUDE.md`. Hace falta Git para Windows, Node 22.23 o más, `git clone`,
`npm ci` y decirle a git el nombre y el mail una vez.

## Decisiones (28/10/2026)

- **Las categorías son lo central.** Árbol por tipo de comida en dos niveles,
  con la división principal entre comidas principales (almuerzo y cena) y
  postres. Las ramas grandes se ven siempre, aunque estén vacías; las sub-ramas
  solo si tienen recetas. Tres grupos de botones transversales: Dulce / Salado,
  Equipo e Ingrediente principal. Dentro de un grupo suman; entre grupos restan.
- **Sistema métrico siempre**, también el huevo (50 g = 1 huevo).

## Cambios del 28/10/2026, tarde (pedido de Juan)

- **Brownie con base 20 × 20 y chocolate 70 %** (sus números). La versión de
  30 × 30 con 54 % quedó en el registro de pruebas.
- **Seis formas de escalar, a la vista en pestañas**: molde, huevos, un
  ingrediente (por ejemplo, «quiero usar 700 g de harina»), masa total («quiero
  1 kg de masa»), lo que rinde y un número. **Por huevos** existe porque romper
  un huevo y usar una parte desperdicia: el peso de cada huevo se puede cambiar y
  el navegador lo recuerda entre recetas.
- **Paleta clara y en pastel**, sin modo oscuro: un color por rama grande
  (verde, amarillo, naranja, violeta, celeste, índigo) en `categorias.yml`.
- **Los botones bajan de renglón** en vez de deslizarse de costado: la fila
  cortada a la derecha no le gustaba.
- **La cobertura de chocolate no tenía cantidades** («aceite 5–8 % del
  chocolate»): se le puso una base de 200 g de chocolate para que escale.
- **Astro 7 y no 5**: la 5 tenía avisos de seguridad críticos de npm.
  Astro 7 trae un motor de Markdown propio (Sätteri) con otra API de plugins;
  por eso los `{id}` se reemplazan sobre el HTML ya armado y no con un plugin.

## Cambios del 25/11/2026

- **El brownie de manteca dorada pasa a ser el de la casa**: a Juan le gustó
  más que el brownie húmedo. La sal baja a 4 g y se bate con los huevos, porque
  sumada con la harina no se repartía pareja.
- La pestaña de escalar por molde ahora se llama «Molde o fuente».
- **Todo lo necesario para trabajar desde otra PC quedó en el repo**:
  - `CLAUDE.md`: el flujo, el formato, cómo subir y cómo preparar otra PC;
  - `.claude/launch.json`;
  - el script, que ahora trae lo de la otra PC antes de subir.

## Pendientes

- Brownie de manteca dorada: probar la sal a 4 g batida con los huevos, y
  anotar el tiempo real de horno y el día (la primera prueba no los registró).
- Brownie húmedo en 25 × 25 (07/11/2026): falta el resultado de gusto (costra,
  humedad, dulzor).
- Pollo «Gourmet de Shanghai» (https://www.instagram.com/reel/DfvA6RLBRJq/): el
  video no da cantidades. Se carga si Juan las averigua. Falta decidir si es una
  variante del pollo agridulce o una receta aparte.
- Tortas fritas: confirmar el título.
- Recetas de otros chats que faltan: yogur, frozen yogurt, puchero, ajo negro.

## Segunda tanda (pendiente, a pedido)

Timers por paso · hidratación calculada en panes · registro de pruebas con
formato (fecha, resultado, tiempo real) · páginas «Mi cocina» (horno, despensa,
equipamiento) y «Aprendizajes técnicos» · ícono para la pantalla de inicio del
celular.
