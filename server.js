// This is the Server for User List
var express = require('express');
var path = require('path');

// MongoDB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://root:password@olympia.modulusmongo.net:27017/umaJej2o');
var Users = require('./app/models/users');
var Bear = require('./app/models/bear');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '/static')));

app.get('/users', function(req, res) {
    res.json(users);
});


var router = express.Router(); 

// more routes for our API will happen here
router.route('/users')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        var user = new Users();      // create a new instance of the Bear model
        
        user.id = req.body.id;
        user.fName = req.body.fName;
        user.lName = req.body.lName;
        user.title = req.body.title;
        user.sex = req.body.sex;
        user.age = req.body.age;
        
        // save the bear and check for errors
        user.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'User created!' });
        });  
    })
    .get(function(req, res) {
        Users.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });


router.route('/users/:userId')
    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Users.findOne({"id" : req.params.userId}, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    })
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Users.findOne({"id" : req.params.userId}, function(err, user) {
            if (err) {
                res.send(err);
            }
	        user.id = req.body.id;
	        user.fName = req.body.fName;
	        user.lName = req.body.lName;
	        user.title = req.body.title;
	        user.sex = req.body.sex;
	        user.age = req.body.age;
            // save the bear
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                // res.json(users);
                Users.find(function(err, users) {
		            if (err) {
		                res.send(err);
		            }
		            res.json(users);
		        });
            });
        });

    })
    .delete(function(req, res) {
        Users.remove({
            id: req.params.userId
        }, function(err, bear) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(8888, function() {
	console.log("Server is now running ..........");
});
