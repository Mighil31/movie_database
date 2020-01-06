var express = require('express');
var router = express.Router();

var movie_controller = require('../controllers/movieController');
var director_controller = require("../controllers/directorController");
var genre_controller = require('../controllers/genreController');

// Multer setup
const multer = require('multer');
var path = require("path");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    var name = (req.body.name) ? req.body.name : req.body.first_name;
    cb(
      null,
        name +
        Date.now() +
        path.extname(file.originalname)
    )
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(new Error('File formate should be PNG, JPG, or JPEG'))
  }
}

/// MOVIE ROUTES ///

router.get('/', movie_controller.index);

// GET request for creating a movie. 
router.get('/movie/create', movie_controller.movie_create_get);

// POST request for creating movie.
router.post('/movie/create', 
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'), 
    movie_controller.movie_create_post
);

// GET request to delete movie.
router.get('/movie/:id/delete', movie_controller.movie_delete_get);

// POST request to delete movie.
router.post('/movie/:id/delete', movie_controller.movie_delete_post);

// GET request to update movie.
router.get('/movie/:id/update', movie_controller.movie_update_get);

// POST request to update movie.
router.post('/movie/:id/update',
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'), 
  movie_controller.movie_update_post);


// GET request for one movie.
router.get('/movie/:id', movie_controller.movie_detail);

// GET request for list of all movie items.
router.get('/movies', movie_controller.movie_list);

/// DIRECTOR ROUTES ///

router.get('/director/create', director_controller.director_create_get);

// POST request for creating director.
router.post('/director/create', 
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'),
    director_controller.director_create_post
    );

// GET request to delete director.
router.get('/director/:id/delete', director_controller.director_delete_get);

// POST request to delete director.
router.post('/director/:id/delete', director_controller.director_delete_post);

// GET request to update director.
router.get('/director/:id/update', director_controller.director_update_get );

// POST request to update director.
router.post('/director/:id/update', 
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'), 
  director_controller.director_update_post);

// GET request for one director.
router.get('/director/:id', director_controller.director_detail);

// GET request for list of all directors.
router.get('/directors', director_controller.director_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. N
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

module.exports = router;
