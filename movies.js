
import express from 'express';
import {validate, partialMovie} from './zod.js';
import fs from 'node:fs';
const app = express();

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const movies = require('./movies.json');

app.use(express.json());

function save(object){
    fs.writeFileSync('./movies.json', JSON.stringify(object, null, 4));
}

app.get('/movies/:id', (req, res)=>{
    const {id} = req.params;
    const found = movies.find(movie => movie.id === parseInt(id));

    if(found){
        res.json(found);
    }else{
        res.status(404).json('The movie wasnt found');
    }
})

app.delete('/movies/:id', (req, res)=>{
    const {id} = req.params;
    const index = movies.findIndex(movie => movie.id === parseInt(id));

    if(index != -1){
        res.json(movies[index]);
        movies.splice(index, 1);
        save(movies);
    }else{
        res.status(404).json('no se enccontro');
    }
})

app.post('/movies', (req, res)=>{
    const result = validate(req.body);

    if(result.error){
        return res.status(400).json({error: JSON.parse(result.error.message)});
    }

    let id = movies.at(-1);
    let identity=0;
    if(id==undefined){
        identity = 1
    }else{
        identity = id.id + 1
    }

    const newMovie  = {
        id: identity,
        ...result.data
    }

    movies.push(newMovie);
    save(movies);
    res.json(newMovie);
});

app.get('/movies', (req, res)=>{
    res.json(movies);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, ()=>{
    console.log('localhost running on link http://localhost:'+PORT);
})