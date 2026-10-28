# Cómo agregar o corregir una receta

**Una receta es un archivo** en `src/content/recetas/`. Agregar una es crear un
archivo; corregirla es editarlo. No hay que tocar código.

## La vía corta: pedírselo a Claude

Pasale la receta o el chat y pedile que la cargue en el recetario. Claude escribe
el archivo, compila para ver que no tenga errores y la sube.

## A mano, desde la web de GitHub (sirve desde el celular)

1. Entrá a `github.com/Juaniessi/recetario`, carpeta `src/content/recetas`.
2. **Para corregir:** abrí el archivo, tocá el lápiz, cambiá lo que haga falta y
   tocá **Commit changes**.
3. **Para agregar:** copiá el contenido de `_plantilla.md` (está en la raíz del
   repo), tocá **Add file → Create new file** dentro de `src/content/recetas`,
   poné un nombre en minúsculas con guiones y `.md` al final
   (`pan-de-campo.md`), pegá y completá.
4. En un par de minutos el sitio se actualiza solo.

**Si te equivocás, el sitio no se rompe.** Si el archivo tiene un error, la
publicación se frena, el sitio sigue mostrando la versión anterior y GitHub te
manda un mail. El error dice qué archivo y qué campo. Los más comunes:

| El error dice | Qué pasó |
|---|---|
| `la rama "..." no existe en src/data/categorias.yml` | Una categoría mal escrita, o una nueva que hay que agregar al árbol |
| `la unidad tiene que ser g o ml` | Quedó una taza, una cucharada o una unidad sin pasar a gramos |
| `un paso usa {xxx} y no hay ningún ingrediente con «id: xxx»` | Un paso nombra un ingrediente que no tiene ese `id` |
| `cada ingrediente lleva cantidad + unidad, o texto` | Un ingrediente sin cantidad ni texto |

## Las reglas del formato

- **Gramos y mililitros siempre.** Nada de tazas ni cucharadas: si la receta
  viene en volumen, se pasa a peso. Un huevo va en gramos (unos 50 g) para que
  escale bien.
- **Las cantidades de los pasos van entre llaves**: `{harina}` muestra la cantidad
  del ingrediente con `id: harina`, ya escalada. `{rinde}` muestra cuánto rinde.
  Así nunca queda un «8 piezas» fijo cuando duplicás la receta.
- Lo que no tiene sentido pesar va con `texto` en vez de `cantidad` («de 1
  limón», «2 o 3 gotas») y no escala.
- Lo que se pesa pero no conviene escalar lleva `escala: false`.
- Los números fijos en las notas y el registro de pruebas están bien: cuentan lo
  que pasó, no se escalan.
- Secciones del cuerpo, en este orden: **Procedimiento**, **Notas**, **Cambios
  respecto de la original**, **Registro de pruebas**, **Pendiente**. Las que no
  hagan falta se sacan.

## Categorías

El árbol vive en `src/data/categorias.yml`. Una receta puede estar en varias
ramas (la ganache está en «Postres y pastelería › Chocolate» y en «Básicos»).
Para sumar una rama o una sub-rama, se agrega ahí. Las sub-ramas aparecen en el
sitio solas cuando alguna receta las usa.

Los botones de **Dulce / Salado**, **Equipo** e **Ingrediente principal** salen
de cada receta (`sabor`, `equipo`, `ingrediente_principal`). Un ingrediente
principal nuevo aparece solo como botón.
