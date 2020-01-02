var mongoose = require('mongoose');
var moment = require('moment');

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
	if (this.first_name && this.last_name) {
		fullname = this.last_name + ', ' + this.first_name
	}
	if (!this.first_name || !this.last_name) {
		fullname = '';
	}

	return fullname;
});

DirectorSchema
.virtual('dob')
.get(function () {
  return moment(this.date_of_birth).format('MMMM Do, YYYY');
});

// Virtual for director age
DirectorSchema
.virtual('age')
.get(function() {
	var today = new Date;
	return (today.getFullYear() - this.date_of_birth.getFullYear()).toString();
});

// Virtual for director's URL
DirectorSchema
.virtual('url')
.get(function () {
	return '/director/' + this._id;
});

//Export model
module.exports = mongoose.model('Director', DirectorSchema);