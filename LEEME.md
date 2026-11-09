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
(está en `C:\Proyectos Claude\.claude\launch.json`).

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

## Segunda tanda (pendiente, a pedido)

Timers por paso · hidratación calculada en panes · registro de pruebas con
formato (fecha, resultado, tiempo real) · páginas «Mi cocina» (horno, despensa,
equipamiento) y «Aprendizajes técnicos» · ícono para la pantalla de inicio del
celular.

Recetas que faltan, de otros chats: yogur, frozen yogurt, puchero, ajo negro.
