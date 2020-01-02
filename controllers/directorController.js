var Director = require('../models/director');
var async = require('async');
var Movie = require('../models/movie');

// Display list of all directors
exports.director_list = function(req, res) {
    Director.find()
    .sort([['last_name', 'ascending']])
    .exec(function(err, list_directors) {
    if (err) { return next(err); }
    res.render('director_list', {title: 'Director List', director_list: list_directors});
    });
};

// Display detailed page of a specified director
exports.director_detail = function(req, res) {
    
    async.parallel({
        director: function(callback) {
            Director.findById(req.params.id)
            .exec(callback);
        },
        directors_movies: function(callback) {
            Movie.find({ 'director': req.params.id})
            .exec(callback)
        }
    }, function(err, results){
        if (err) { return next(err); }
        if (results.director == null) {
            var err = new Error("Director not Found");
            err.status = 404;
            return next(err);
        }

        res.render('director_detail', {title: 'Director Details', director: results.director, director_movies: results.directors_movies})
    })
}

// director create form on GET
exports.director_create_get = function(req, res) {
    res.send('Director form GET');
}

// Director create POST
exports.director_create_post = function(req, res) {
    res.send('Director create POST');
}

// Display director delete form on GET.
exports.director_delete_get = function(req, res) {
    res.send('director delete GET');
};

// Handle director delete on POST.
exports.director_delete_post = function(req, res) {
    res.send('director delete POST');
};

// Display director update form on GET.
exports.director_update_get = function(req, res) {
    res.send('director update GET');
};

// Handle director update on POST.
exports.director_update_post = function(req, res) {
    res.send('director update POST');
};