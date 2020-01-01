var director = require('../models/director');

// Display list of all directors
exports.director_list = function(req, res) {
    res.send('Director list');
}

// Display detailed page of a specified director
exports.director_detail = function(req, res) {
    res.send('Director detail');
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