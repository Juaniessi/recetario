# Recetario

Sitio propio de recetas de Juan, para usar en la cocina desde el celular.
**Personal, no de Chitza.** Arrancó el 28/10/2026.

- Sitio: https://juaniessi.github.io/recetario/ (público, sin indexar: `noindex` y `robots.txt`)
- Repo: `Juaniessi/recetario`
- Agregar o corregir recetas: ver `COMO-AGREGAR-RECETA.md`.

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
