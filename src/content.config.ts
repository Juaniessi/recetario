// El esquema de una receta. Si un archivo no lo cumple, la compilación falla
// con el nombre del archivo y el sitio publicado queda como estaba.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { idsValidos } from './lib/categorias.js';

const RAMAS = idsValidos();

const cantidad = z.union([
  z.number().positive(),
  z.tuple([z.number().positive(), z.number().positive()]), // rango: [2, 3]
]);

// Solo sistema métrico. Una receta en tazas o cucharadas no compila.
const unidad = z.enum(['g', 'ml'], {
  error: 'la unidad tiene que ser g o ml (nada de tazas ni cucharadas)',
});

const slug = z.string().regex(/^[a-z0-9-]+$/, 'solo minúsculas, números y guiones');

const ingrediente = z
  .object({
    id: slug.optional(), // solo hace falta si un paso lo nombra como {id}
    nombre: z.string(),
    cantidad: cantidad.optional(),
    unidad: unidad.optional(),
    texto: z.string().optional(), // para lo que no se pesa: "de 1 limón"
    escala: z.boolean().default(true),
    opcional: z.boolean().default(false),
    nota: z.string().optional(),
    funcion: z.string().optional(),
    alternativa: z
      .object({ nombre: z.string(), cantidad: cantidad, unidad: unidad })
      .optional(),
    // Lo que se cuenta entero: el huevo. Habilita «escalar por huevos».
    unidad_natural: z
      .object({ nombre: z.string(), plural: z.string(), gramos: z.number().positive() })
      .optional(),
  })
  .refine((i) => i.cantidad !== undefined || i.texto !== undefined, {
    message: 'cada ingrediente lleva cantidad + unidad, o texto',
  })
  .refine((i) => i.cantidad === undefined || i.unidad !== undefined, {
    message: 'si tiene cantidad, tiene que tener unidad (g o ml)',
  });

const molde = z.discriminatedUnion('forma', [
  z.object({ forma: z.literal('rectangular'), ancho: z.number(), largo: z.number() }),
  z.object({ forma: z.literal('redondo'), diametro: z.number() }),
]);

const recetas = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/recetas' }),
  schema: z.object({
    titulo: z.string(),
    estado: z.enum(['final', 'en-prueba', 'pendiente']),
    categorias: z
      .array(
        z.string().refine((c) => RAMAS.has(c), {
          error: (issue) => `la rama "${issue.input}" no existe en src/data/categorias.yml`,
        }),
      )
      .min(1),
    sabor: z.enum(['dulce', 'salado']),
    equipo: z.array(z.enum(['horno', 'waflera', 'freezer', 'cacerola', 'sarten', 'sin-horno'])).min(1),
    ingrediente_principal: z.array(slug).min(1),
    fuente: z
      .object({
        autor: z.string().optional(),
        link: z.url().optional(),
        aclaracion: z.string().optional(),
      })
      .optional(),
    rinde: z.object({ cantidad: z.number().positive(), unidad: z.string() }).optional(),
    molde: molde.optional(),
    datos: z.array(z.record(z.string(), z.string())).default([]),
    ingredientes: z
      .array(
        z.object({
          grupo: z.string().optional(),
          aclaracion: z.string().optional(),
          // Correcciones, alternativas, extracciones: no suman a la masa total.
          fuera_de_la_masa: z.boolean().default(false),
          lista: z.array(ingrediente).min(1),
        }),
      )
      .default([]),
  }),
});

export const collections = { recetas };
