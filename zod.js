import z from 'zod';

const movieSchema = z.object({
    name: z.string().min(10),
    year: z.number().int().min(1920).max(2025),
    sinopsis: z.string().min(20)
});

export function validate(object){
    return movieSchema.safeParse(object);
}

export function partialMovie(object){
    return movieSchema.partial().safeParse(object);
}