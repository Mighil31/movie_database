var Movie = require('../models/movie');
var Director = require('../models/director');
var Genre = require('../models/genre');

var async = require('async');

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
    res.send('NOT IMPLEMENTED: movie list');
};

// Display detail page for a specific movie.
exports.movie_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: movie detail: ' + req.params.id);
};

// Display movie create form on GET.
exports.movie_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: movie create GET');
};

// Handle movie create on POST.
exports.movie_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: movie create POST');
};

// Display movie delete form on GET.
exports.movie_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: movie delete GET');
};

// Handle movie delete on POST.
exports.movie_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: movie delete POST');
};

// Display movie update form on GET.
exports.movie_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: movie update GET');
};

// Handle movie update on POST.
exports.movie_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: movie update POST');
};
