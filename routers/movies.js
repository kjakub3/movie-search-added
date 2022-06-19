const express = require('express');
const { db } = require("../utils/db");
const { validate, Joi } = require('express-validation');
const movieRouter = express.Router();


const newMovieValidation = {
    body: Joi.object({
        genres: Joi.array(),
        title: Joi.string()
            .max(255)
            .required(),
        year: Joi.number()
            .required(),
        runtime: Joi.number()
            .required(),
        director: Joi.string()
            .max(255)
            .required(),
        actors: Joi.string(),
        plot: Joi.string(),
        posterUrl: Joi.string(),
    }),
}

movieRouter

    .post('/add', validate(newMovieValidation), (req, res) => {

        const listOfGenres = db.genresData();


        const { title, year, runtime, director, actors, plot, posterUrl, genres } = req.body;

        const listOfGenresLower = listOfGenres.map(item => item.toLowerCase())
        const genresLower = genres.map(item => item.toLowerCase())

        const genresValidation = genresLower.every((item) => listOfGenresLower.includes(item));


        // const genresValidation = genres.every((item) => listOfGenres.includes(item));

        if (!genresValidation) {
            return res
                .status(400)
                .send('Error, bad genres')
        }


        db.create({
            genres,
            title,
            year: year.toString(),
            runtime: runtime.toString(),
            director,
            actors,
            plot,
            posterUrl,
        })
        const newObj = db.newObj()

        res
            .status(201)
            .json(newObj);
    })

    .get('/search', (req, res) => {

        const { runtime, genres } = req.query;
        const one = db.search(runtime, genres);
        res.json(one);
    })

module.exports = {
    movieRouter,
};


