---
titulo: Nombre de la receta
estado: en-prueba            # final | en-prueba | pendiente
categorias:                  # una o varias, de src/data/categorias.yml
  - postres-y-pasteleria/tortas-budines-y-brownies
sabor: dulce                 # dulce | salado
equipo: [horno]              # horno | waflera | freezer | sin-horno (una o varias)
ingrediente_principal: [chocolate]   # minúsculas, guiones en vez de espacios
fuente:                      # opcional; sacalo entero si la receta es propia
  autor: Quién la hizo
  link: https://...
  aclaracion: Qué se cambió o de dónde salió.
rinde:                       # opcional; habilita «escalar por lo que rinde»
  cantidad: 12
  unidad: porciones
molde:                       # opcional; habilita «escalar por molde»
  forma: rectangular         # o: forma: redondo + diametro: 24
  ancho: 20
  largo: 20
datos:                       # opcional; lo que sirve tener a mano
  - Horno: 180 °C
ingredientes:
  - lista:
      - id: harina           # solo si un paso la nombra como {harina}
        nombre: Harina 0000
        cantidad: 200
        unidad: g            # g o ml, nada más
      - nombre: Sal
        cantidad: [1, 2]     # rango
        unidad: g
      - nombre: Ralladura de limón
        texto: de 1 limón    # lo que no se pesa: no escala
  - grupo: Cobertura         # opcional: un segundo grupo con título
    lista:
      - nombre: Chocolate
        cantidad: 100
        unidad: g
        opcional: true
        nota: picado
---

## Procedimiento

1. Tamizá {harina} de harina. Las cantidades van entre llaves y escalan solas.
2. Cortá en {rinde}.

## Notas

## Cambios respecto de la original

## Registro de pruebas

- **DD/MM/AAAA** — qué pasó, tiempo real en mi horno.

## Pendiente
