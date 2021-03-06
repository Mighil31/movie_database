var Genre = require('../models/genre');
var Movie = require('../models/movie');

var async = require('async');
const validator = require('express-validator');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Genre.
exports.genre_list = function(req, res) {
    Genre.find()
    .exec(function(err, list_genres) {
    if (err) { return next(err); }
    res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
    })
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res) {
    
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_movies: function(callback) {
            Movie.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_movies: results.genre_movies } );
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate that name field is not empty
    body('name', 'Genre name required').isLength({ min: 1}).trim(),

    // Sanitize (escape) name field
    sanitizeBody('name').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
            { name: req.body.name}
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with errors
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
            .exec( function(err, found_genre) {
            if (err) { return next(err); }

            if (found_genre) {
            // Genre exists, redirect to its detail page.
                res.redirect(found_genre.url);
            } else {

                genre.save(function (err) {
                    if (err) { return next(err); }
                    // Genre saved. Redirect to genre detail page.
                    res.redirect(genre.url);
                    });

                }

            });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        }
    }, function(err, results){
        if (err) { return next(err); }
        if (results.genre==null) {
            res.redirect('/genre');
        }
        
        res.render('genre_delete', { title: 'Delete genre', genre: results.genre } );
    })
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    async.parallel({
        genre: function(callback) {
          Genre.findById(req.body.genreid).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        
        Genre.findByIdAndRemove(req.body.genreid, function deletegenre(err) {
            if (err) { return next(err); }

            res.redirect('/genres')
        })
        
    });
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {

    async.parallel({
        genre: function(callback) {
            Genre.find(callback);
        },
        }, function(err, results) {

            if (err) { return next(err); }
            if (results.genre==null) { // No results.
                var err = new Error('genre not found');
                err.status = 404;
                return next(err);
            }
            res.render('genre_form', { title: 'Update movie', genre: results.genre});
        });

};

// Handle Genre update on POST.
exports.genre_update_post = [
   
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    sanitizeBody('name').escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var genre = new Genre(
            { name: req.body.name,
                _id:req.params.id,
            }
        );
        
        if (!errors.isEmpty()) {
            async.parallel({
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('genre_form', { title: 'Update genre', genre: results.genres, errors: errors.array() });
            });
            return;
        }
        else {

            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,themovie) {
                if (err) { return next(err); }

                   res.redirect(themovie.url);
                });
        }
    }
];