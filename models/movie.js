var mongoose = require('mongoose');

var Schema = mongoose.Schema;

MovieSchema = new Schema(
    {
        name: {type: String, required: true},
        director: {type: Schema.Types.ObjectId, ref: 'Director', required: true},
        description: {type: String, required: true},
        release: {type: String, required: true},
        genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
    }
);

// Virtual for movie's url
MovieSchema
.virtual('url')
.get(function() {
    return '/movie/' + this._id;
});

// Export model
module.exports = mongoose.model('Movie', MovieSchema);
