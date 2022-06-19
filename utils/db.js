const { readFile, writeFile } = require('fs').promises;
const { join } = require('path');


class Db {
    constructor(dbFileName) {
        this.dbFileName = join(__dirname, '../data', dbFileName);
        this.load();
    }

    async load() {

        this.data = JSON.parse(await readFile(this.dbFileName, 'utf8'));
    }

    genresData() {
        return this.data.genres;
    }

    create(obj) {

        const data = this.data.movies.map((el, index) => ({
            id: index + 1,
        }));

        const id = data.length + 1;
        this.data.movies.push({
            id,
            ...obj,
        });

        writeFile(this.dbFileName, JSON.stringify(this.data), 'utf8');
    }

    newObj() {
        return this.data.movies[this.data.movies.length - 1];
    }

    search(runtime, genres) {

        // const genresParsed = genres && JSON.parse(genres);
        const num = (Number(runtime) + Number(10));
        const num2 = (Number(runtime) - Number(10));

        if (runtime && genres.length) {

            console.log('dwa parametry');
            const genresParsed = JSON.parse(genres);

            return this.data.movies.filter(({ runtime, genres }) => runtime <= num && runtime >= num2 && genresParsed.every(gen => genres?.includes(gen)));

            // this.data.movies.filter((props) => {
            //     const { runtime, genres } = props;
            //     if (runtime <= num && runtime >= num2) {
            //         genresParsed.every(gen =>genres && genres?.includes(gen));
            //     }
            // })

        } else if (runtime) {

            console.log('tylko czas trwania');
            const allMovies = this.data.movies.filter(oneObj => oneObj.runtime <= num && oneObj.runtime >= num2);
            const arrayMoviesId = allMovies.map(oneObj => oneObj.id);
            const randomNumber = Math.floor(Math.random() * arrayMoviesId.length);
            return this.data.movies.filter(oneObj => oneObj.id === arrayMoviesId[randomNumber]);

        } else if (genres) {

            console.log('tylko gatunki');
            const genresParsed = JSON.parse(genres);

            const genresLength = genresParsed.length

            const filteredMovies = this.data.movies.filter(oneObj => genresParsed.every(gen => oneObj.genres?.includes(gen)));

            const sortedMovies = filteredMovies.sort((a, b) => {

                if (a.genres.length === genresLength) {
                    return -1;
                } else {
                    if (a.genres.length > b.genres.length) {
                        return 0;
                    } else {
                        return -1;
                    }
                }
            })

            return sortedMovies;

        } else {

            console.log('losowy film');
            const index = Math.floor(Math.random() * (this.data.movies.length + 1));
            return this.data.movies.filter(oneObj => oneObj.id === index);

        }
    }
}

const db = new Db('db.json');

module.exports = {
    db,
};