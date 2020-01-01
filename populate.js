console.log('This script populates test movies , directors and genres into the database')

var userArgs = process.argv.slice(2);

var async = require('async');
var Director = require('/models/director');
var Movie = require('./models/movie');
var Genre = require('./models/genre');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var directors = []
var genres = []
var movies = []

function directorCreate(first_name, last_name, d_birth, cb) {
    directordetail= {first_name:first_name , last_name: last_name}
    if (d_birth != false) directordetail.date_of_birth = d_birth;

    var director = new Director(directordetail);

    director.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Director: ' + director);
        directors.push(author)
        cb(null, author)
    })
}

function genreCreate(name, cb) {
    
    var genre = new Genre({ name: name});

    genre.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New Genre: " + genre);
        genres.push(genre)
        cb(null, genre);
    });
}

function movieCreate(name, director,release, desc, genre, cb) {

    moviedetail = {
        name: name,
        director: director,
        description: desc,
        release: release,
    }
    if (genre != false) bookdetail.genre = genre;

    var movie =  new Movie(moviedetail);
    movie.save(function (err) {
        if (err) {
            cb(err, null);
            return
        }
        console.log('New Movie: ' + movie);
        movies.push(movie);
        cb(null, movie);
    })
}


function createDirectorsGenres(cb) {
    async.series([
        function(callback) {
            directorCreate('Quentin', 'Tarantino', '1963-03-27', callback)
        },
        function(callback) {
            directorCreate('Christopher', 'Nolan', '1970-07-30', callback)
        },
        function(callback) {
            directorCreate('David', 'Fincher', '1962-08-28', callback)
        },
        function(callback) {
            directorCreate('Martin', 'Scorsese', '1942-11-17', callback)
        },
        function(callback) {
            directorCreate('James', 'Gunn', '1966-08-05', callback)
        },
        function(callback) {
            directorCreate('Taika', 'Waititi', '1975-08-16', callback)
        },
        function(callback) {
            directorCreate('Karthik', 'Subbaraj', '1983-03-19', callback)
        },
        function(callback) {
            directorCreate('Vetri', 'Maaran', '1975-09-04', callback)
        },
        function(callback) { // 0
            genreCreate("Fantasy", callback);
        },
        function(callback) { // 1
            genreCreate("Science Fiction", callback);
        },
        function(callback) { // 2
            genreCreate("Western", callback);
        },
        function(callback) { // 3
            genreCreate("Revisionist", callback);
        },
        function(callback) { // 4
            genreCreate("War", callback);
        },
        function(callback) { // 5
            genreCreate("Comedy", callback);
        },
        function(callback) { // 6
            genreCreate("Drama", callback);
        },
        function(callback) { // 7
            genreCreate("Crime", callback);
        },
        function(callback) { // 8
            genreCreate("Thriller", callback);
        },
        function(callback) { // 9
            genreCreate("Neo Noir", callback);
        },
        function(callback) { // 10
            genreCreate("Action", callback);
        },
        function(callback) { // 11
            genreCreate("Superhero", callback);
        },
        function(callback) { // 12
            genreCreate("Mystery", callback);
        },
        function(callback) { // 13
            genreCreate("Gangster", callback);
        },
        function(callback) { // 14
            genreCreate("Adventure", callback);
        }
    ],
    cb);
}

function createMovies(cb) {
    async.parallel([
        function(callback) {
            movieCreate('Django Unchained', directors[0], '2012','With the help of a German bounty hunter, a freed slave sets ' +
            'out to rescue his wife from a brutal Mississippi plantation owner.', [genre[3], genre[2], genre[6]], callback);
        },
        function(callback) {
            movieCreate('Inglourious Basterds', directors[0], '2009', 'In Nazi-occupied France during World War II, a plan to ' +
            "assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's" +
            "vengeful plans for the same.", [genre[14], genre[6], genre[4]], callback);
        },
        function(callback) {
            movieCreate('Inception', directors[1], '2010', 'A thief who steals corporate secrets through the use of dream-sharing ' +
            'technology is given the inverse task of planting an idea into the mind of a C.E.O.', [genre[10], genre[14], genre[1]], callback);
        },
        function(callback) {
            movieCreate('The Prestige', directors[1],'2006', 'After a tragic accident, two stage magicians engage in a battle to ' +
            'create the ultimate illusion while sacrificing everything they have to outwit each other.', [genre[6], genre[12], genre[1]], callback);
        },
        function(callback) {
            movieCreate('Se7en', directors[2], '1995', 'Two detectives, a rookie and a veteran, hunt a serial killer who uses ' +
            'the seven deadly sins as his motives.', [genre[3], genre[2], genre[6]], callback);
        },
        function(callback) {
            movieCreate('The Social Network', directors[2], '2010', 'As Harvard student Mark Zuckerberg creates the social networking site ' +
            'that would become known as Facebook, he is sued by the twins who claimed he stole their idea, and by the co-founder who was ' +
            'later squeezed out of the business.', [genre[6]], callback);
        },
        function(callback) {
            movieCreate('The Wolf of Wall Street', directors[3], '2013', 'Based on the true story of Jordan Belfort, from his rise to a ' +
            'wealthy stock-broker living the high life to his fall involving crime, corruption' + 
            'and the federal government. ', [genre[7], genre[6]], callback);
        },
        function(callback) {
            movieCreate('Shutter Island', directors[3], '2010', 'In 1954, a U.S. Marshal investigates the disappearance of a murderer who ' +
            'escaped from a hospital for the criminally insane.', [genre[12], genre[8]], callback);
        },
        function(callback) {
            movieCreate('Guardians of the Galaxy', directors[4], '2014', 'A group of intergalactic criminals must pull together to ' +
            'stop a fanatical warrior with plans to purge the universe.', [genre[10], genre[14], genre[5], genre[11]], callback);
        },
        function(callback) {
            movieCreate('Thor: Ragnarok', directors[5], '2017', 'Imprisoned on the planet Sakaar, Thor must race against time ' +
            'to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the ' + 
            'powerful and ruthless villain Hela.', [genre[10], genre[14], genre[5], genre[11]], callback);
        },
        function(callback) {
            movieCreate('Jigarthanda', directors[6], '2014', 'An aspiring director targets a ruthless gangster because he ' +
            'wants to make a violent gangster film. His discreet attempts to research the gangster fail miserably.' + 
            'Finally when he gets caught snooping, things hit the fan.', [genre[10], genre[7], genre[6]], callback);
        },
        function(callback) {
            movieCreate('Asuran', directors[7], '2019', 'The teenage son of a farmer from an underprivileged caste kills a rich, ' +
            'upper caste landlord. Will the farmer, a loving father and a pacifist by heart, be able to save his ' + 
            'hot-blooded son is the rest of the story.', [genre[10], genre[6]], callback);
        },
        function(callback) {
            movieCreate('Vada Chennai', directors[7], '2018', 'A young carrom player in north Chennai becomes a reluctant ' +
            'participant in a war between two warring gangsters.', [genre[10], genre[14], genre[5], genre[11]], callback);
        },

    ])
}


async.series([
    createDirectorsGenres,
    createMovies,
],

function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Movies: '+movies);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
}
)