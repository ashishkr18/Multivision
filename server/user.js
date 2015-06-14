var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/multivision');
var user = mongoose.Schema({
    message: String
});
module.exports = mongoose.model('User', user);
