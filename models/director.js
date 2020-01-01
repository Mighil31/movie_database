var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DirectorSchema = new Schema(
    {
        first_name: {type:String, required:true, max:100},
        last_name: {type: String, required:true, max:100},
        date_of_birth: {type: Date},
    }
);

// Virtual for director full name
DirectorSchema
.virtual('name')
.get(function() {

	var fullname = '';
	if (this.first_name && this.family_name) {
		fullname = this.family_name + ', ' + this.first_name
	}
	if (!this.first_name || !this.family_name) {
		fullname = '';
	}

	return fullname;
});

// Virtual for director age
DirectorSchema
.virtual('age')
.get(function() {
	var today = new Date;
	return (today.getFullYear - this.date_of_birth.getFullYear()).toString();
});

// Virtual for director's URL
AuthorSchema
.virtual('url')
.get(function () {
	return '/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Director', DirectorSchema);