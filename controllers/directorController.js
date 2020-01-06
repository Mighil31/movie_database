var Director = require('../models/director');
var async = require('async');
var Movie = require('../models/movie');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var multer = require('multer');

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
    res.render('director_form', { title: 'Create Director'})
}

// Director create POST
exports.director_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),
    sanitizeBody('date_of_birth').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('director_form', { title: 'Create Director', director: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create director object with escaped and trimmed data.
            var director = new Director(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    date_of_birth: req.body.date_of_birth,
                    image: req.file ? req.file.filename : null
                });
            director.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new director record.
                res.redirect(director.url);
            });
        }
    }
];

// Display director delete form on GET.
exports.director_delete_get = function(req, res, next) {

    async.parallel({
        director: function(callback) {
            Director.findById(req.params.id).exec(callback)
        },
        directors_movies: function(callback) {
          Movie.find({ 'director': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.director==null) {
            res.redirect('/directors');
        }
        
        res.render('director_delete', { title: 'Delete Director', director: results.director, director_movies: results.directors_movies } );
    });

};

// Handle director delete on POST.
exports.director_delete_post = function(req, res, next) {

    async.parallel({
        director: function(callback) {
          Director.findById(req.body.directorid).exec(callback)
        },
        directors_movies: function(callback) {
          Movie.find({ 'director': req.body.directorid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.directors_movies.length > 0) {
            // director has movies. Render in same way as for GET route.
            res.render('director_delete', { title: 'Delete director', director: results.director, director_movies: results.directors_movies } );
            return;
        }
        else {
            // director has no movies. Delete object and redirect to the list of directors.
            Director.findByIdAndRemove(req.body.directorid, function deletedirector(err) {
                if (err) { return next(err); }
                // Success - go to director list
                res.redirect('/directors')
            })
        }
    });
};

// Display director update form on GET.
exports.director_update_get = function(req, res) {
    Director.findById(req.params.id).exec((err, director) => {
        if (err) {
          return next(err);
        }
    
        if (director === null) {
          const err = new Error("director not found");
          err.status = 404;
          return next(err);
        }
    
        res.render("director_form", {
          title: "Update director",
          director: director
        });
      });
    };

// Handle director update on POST.
exports.director_update_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody('first_name').escape(),
    sanitizeBody('last_name').escape(),
    sanitizeBody('date_of_birth').toDate(),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('director_form', { title: 'Create Director', director: req.body, errors: errors.array() });
            return;
        }
        else {

            // Create director object with escaped and trimmed data.
            var director = new Director(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    date_of_birth: req.body.date_of_birth,
                    _id:req.params.id,
                    image: req.file ? req.file.filename : req.body.curImage
                });
            Director.findByIdAndUpdate(req.params.id, director, {}, function (err,thedirector) {
                if (err) { return next(err); }
                    res.redirect(thedirector.url);
                });
        }
    }
];