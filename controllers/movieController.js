var Movie = require('../models/movie');
var Director = require('../models/director');
var Genre = require('../models/genre');

var async = require('async');
var multer = require('multer');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    
    async.parallel({
        movie_count: function(callback) {
            Movie.countDocuments({}, callback);
        },
        director_count: function(callback){
            Director.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results){
        res.render('index', {title: 'Movie Database', err:err, data:results})
    })
};

// Display list of all movies.
exports.movie_list = function(req, res) {
    Movie.find({}, 'name director')
        .populate('director')
        .exec(function(err, list_movies) {
            if (err) { return next(err)}
            res.render('movie_list', {title: 'Movie List', movie_list: list_movies});
        })
};

// Display detail page for a specific movie.
exports.movie_detail = function(req, res) {
    Movie.findById(req.params.id)
    .populate('director')
    .populate('genre')
    .exec(function(err, results) {
        if (err) { return next(err)};
        if(results == null) {
            var err = new Error('Movie not found')
            err.status = 404;
            return next(err);
        }
        res.render('movie_detail', { title: results.eventNames, movie:results});
    })
};

// Display Director create form on GET.
exports.movie_create_get = function(req, res, next) { 
      
    // Get all directors and genres, which we can use for adding to our movie.
    async.parallel({
        directors: function(callback) {
            Director.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('movie_form', { title: 'Create Movie', directors: results.directors, genres: results.genres });
    });
    
};

// Handle Director create on POST.
exports.movie_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {

        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('director', 'Director must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('release', 'Release Date must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('genre.*').escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('director').escape(),
    sanitizeBody('released').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a movie object with escaped and trimmed data.
        var movie = new Movie(
        { 
            name: req.body.name,
            director: req.body.director,
            description: req.body.description,
            release: req.body.release,
            genre: req.body.genre,
            image: req.file ? req.file.filename : null
        });

        if (!errors.isEmpty()) {

            // Get all directors and genres for form.
            async.parallel({
                directors: function(callback) {
                    Director.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (movie.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('movie_form', { title: 'Create Movie',directors:results.directors, genres:results.genres, movie: movie, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save movie.
            console.warn(movie.genre)
            console.log(movie.genre)
            movie.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new movie record.
                   res.redirect(movie.url);
                });
        }
    }
];

// Display movie delete form on GET.
exports.movie_delete_get = function(req, res) {
    
    async.parallel({
        movie: function(callback) {
            Movie.findById(req.params.id).exec(callback);
        }
    }, function(err, results){
        if (err) { return next(err); }
        if (results.movie==null) {
            res.redirect('/movies');
        }
        
        res.render('movie_delete', { title: 'Delete Movie', movies: results.movie } );
    })
};

// Handle movie delete on POST.
exports.movie_delete_post = function(req, res) {
    async.parallel({
        movie: function(callback) {
          Movie.findById(req.body.movieid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        
        Movie.findByIdAndRemove(req.body.movieid, function deletemovie(err) {
            if (err) { return next(err); }
            // Success - go to director list
            res.redirect('/movies')
        })
        
    });
};

// Display movie update form on GET.
exports.movie_update_get = function(req, res, next) {

        async.parallel({
            movie: function(callback) {
                Movie.findById(req.params.id).populate('director').populate('genre').exec(callback);
            },
            director: function(callback) {
                Director.find(callback);
            },
            genre: function(callback) {
                Genre.find(callback);
            },
            }, function(err, results) {

                if (err) { return next(err); }
                if (results.movie==null) {
                    var err = new Error('movie not found');
                    err.status = 404;
                    return next(err);
                }
                // Mark selected genres as checked.
                for (var allGenres = 0; allGenres < results.genre.length; allGenres++) {
                    for (var movieGenres = 0; movieGenres < results.movie.genre.length; movieGenres++) {
                        if (results.genre[allGenres]._id.toString()==results.movie.genre[movieGenres]._id.toString()) {
                            results.genre[allGenres].checked='true';
                        }
                    }
                }
                res.render('movie_form', { title: 'Update movie', directors: results.director, genres: results.genre, movie: results.movie });
            });
    };

// Handle movie update on POST.
exports.movie_update_post = [

    // Convert the genre to an array
    (req, res, next) => {

        
        if(!(req.body.genre instanceof Array)){
            
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
            
        }
        console.warn(req.body.genre)
        console.log(req.body.genre)
        console.log(req.body.name)
        console.log(req.body.director)
        console.log(req.body.released)
        next();
    },
   
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('director', 'Director must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty.').isLength({ min: 1 }).trim(),
    body('release', 'Release Date must not be empty').isLength({ min: 1 }).trim(),

    sanitizeBody('genre.*').escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('director').escape(),
    sanitizeBody('released').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var movie = new Movie(
          { name: req.body.name,
            director: req.body.director,
            description: req.body.description,
            release: req.body.release,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id,
            image: req.file ? req.file.filename : req.body.curImage
           });
        
        if (!errors.isEmpty()) {

            // Get all directors and genres for form.
            async.parallel({
                directors: function(callback) {
                    Director.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (movie.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('movie_form', { title: 'Update movie',directors: results.directors, genres: results.genres, movie: movie, errors: errors.array() });
            });
            return;
        }
        else {
            // Update record
            Movie.findByIdAndUpdate(req.params.id, movie, {}, function (err,themovie) {
                if (err) { return next(err); }

                   res.redirect(themovie.url);
                });
        }
    }
];

