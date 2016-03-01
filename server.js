// https://codeforgeek.com/2014/11/file-uploads-using-node-js/

var express         =       require("express");
var session         = 		require('express-session');
var multer          =       require('multer');
var path 			= 		require("path");
var passwordHash 	= 		require('password-hash');
var fs 				= 		require('fs');
var Engine 			= 		require('tingodb')(), assert = require('assert');
var bodyParser 		= 		require('body-parser');
var ncp 			= 		require('ncp').ncp;
//var mime = require("mime");

var upload      	=   	multer({ dest: './uploads/'});

var filenameoutput; 
var pathtemp;

var app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use('/',     express.static(path.join(__dirname, 'draggable')));
/*app.use('/css',express.static(path.join(__dirname, 'autorensystem/css')));
app.use('/fonts',express.static(path.join(__dirname, 'fonts')));
app.use('/img',express.static(path.join(__dirname, 'img')));
app.use('/js',express.static(path.join(__dirname, 'autorensystem/js')));
*/
app.use('/', express.static(path.join(__dirname, 'autorensystem')));

app.use(multer({ dest: './uploads/',
    rename: function (fieldname, filename) {
        //return filename+Date.now();
		filenameoutput = filename+Date.now();//+ '.' + mime.extension(file.mimetype);
		return filenameoutput;
		
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
		pathtemp = path.extname(file.originalname);
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
		//filenameoutput = file.path;
    }
}));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/autorensystem/index.html");
});

app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        //res.end("File is uploaded: " + "uploads/" + filenameoutput);
		
		res.end(filenameoutput+pathtemp);
    });
});

// parse application/json
app.use(bodyParser.json());  
//app.use(express.bodyParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/saveExport', function(req, res) {
	try {
		fs.mkdirSync("./export");
	} catch(e) {
		// nothing to do here
	}

	fs.writeFile("./export/nodeRules.js", req.body.rules, function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("Rules file was saved!");

		fs.writeFile("./export/content.json", req.body.content, function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("Content file was saved!");

			ncp("./uploads", "./export/media", function (err) {
				if (err) {
					return console.error(err);
				}

				console.log('Uploaded media was copied!');
				res.send("OK");
			});
		});
	});
});

app.post('/saveData', function(req ,res) {
	fs.writeFile("savedData.json", req.body.json, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
		res.send("OK");
	});
});

app.post('/loadData', function(req, res) {
	fs.stat('savedData.json', function(err, stat) {
		if(err == null) {
			fs.readFile('savedData.json', function (err, data) {
				res.send(data.toString());
			});
		} else if(err.code == 'ENOENT') {
			res.send("NO_SAVED_DATA");
		} else {
			console.log('Some other error: ', err.code);
		}
	});
});


app.post('/save', function(req, res){
	var obj = {};
	//console.log('body: ' + req);
	//console.log('body: ' + JSON.stringify(req.body));
	//console.log('body: ' + req.body.ratioHeight);
	var db = new Engine.Db('db', {});
	//var collection = db.collection("batch_document_insert_collection_safe");
	/*collection.insert([{hello:'world_safe1'}, {hello:'world_safe2'}], {w:1}, function(err, result) {
		assert.equal(null, err);
	});
	*/
	
	var dataguis 		= data.guis;
	var dataauthorname 	= data.authorname;
	var dataauthorsys 	= data.authorsystem;
	
	
	var authorsystem = {};
	authorsystem.authorsystem = dataauthorsys;
	authorsystem.authorname   = dataauthorname ;

	var guis = {};
	guis.guis 		= dataguis;
	guis.authorname = dataauthorname ;
	
	if (req.session.username = dataauthorname) {
		var collection = db.collection("authorsystem");
		collection.insert(authorsystem);
	
		collection = db.collection("gui");
		collection.insert(guis);
		
		res.send("OK");
	} else {
		res.send("OK");
	}
	

	
});

app.post('/load', function(req, res){
	var obj = {};
	//console.log('body: ' + req);
	//console.log('body: ' + JSON.stringify(req.body));
	//console.log('body: ' + req.body.ratioHeight);
	res.send("Daten gesendet");
	var db = new Engine.Db('db', {});
	//var collection = db.collection("batch_document_insert_collection_safe");
	/*collection.insert([{hello:'world_safe1'}, {hello:'world_safe2'}], {w:1}, function(err, result) {
		assert.equal(null, err);
	});
	*/
	var collection = db.collection("learningunit");
	collection.insert(req.body);

	var result = collection.findOne({"ratioWidth":4});
	print (tojson(result));
});

/*app.use(express.bodyParser());

app.post('/', function(request, response){

    console.log(request.body.user.name);
    console.log(request.body.user.email);

});
*/


app.use(session({secret: 'secretpsst'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




var sess;

app.post('/login',function(req,res){
	sess=req.session;
	//In this we are assigning email to sess.email variable.
	//email comes from HTML page.

	var username = req.body.username;
	var password = req.body.password;
	var out='NO';
	/*if (validatepassword(username, password)) {
		out='welcome';
		sess.username=req.body.username;
	}*/
	
	var db = new Engine.Db('db', {});
	var collection = db.collection("users");
	var valid = false;
	collection.findOne({"username":username}, function(err, result) {
		if (err) { 
			console.log('error'); 
			res.end('NO');
		}
		if (result) {
			// we have a result
			console.log('result');
			resultpassword = result.password;
			console.log(resultpassword + ' ' + password);
			
			if (passwordHash.verify(password, resultpassword)) { 
			//if (resultpassword == password) {
				valid = true;
				console.log("OK");
				res.end('OK');
				req.session.username = username;
			} else {
				res.end('NO');
			}
		} else {
			// we don't
			console.log('no result');
			res.end('no result');
		}
		
	});

	
	//res.end(out);
});

app.post('/deleteuser',function(req,res){ 
	//TODO
});

app.post('/register',function(req,res){
	sess=req.session;
	//In this we are assigning email to sess.email variable.
	//email comes from HTML page.

	var username = req.body.username;
	var password = req.body.password;
	
	
	//console.log(hashedPassword);
	
	// TODO: teste, ob Nutzername schon vergeben
	
	
		var db = new Engine.Db('db', {});
	var collection = db.collection("users");
	var valid = false;
	collection.findOne({"username":username}, function(err, result) {
		if (err) { 
			console.log('error'); 
			res.end('error');
		}
		if (result) {
			// Nutzername schon vergeben!
			console.log('Name bereits vergeben');
			res.end('vergeben');
		} else {
			// Nutzername noch frei -> Nutzerdaten abgespeichert
			var hashedPassword = passwordHash.generate(password);;
			var db = new Engine.Db('db', {});
			var collection = db.collection("users");
			collection.insert({"username":username, "password":hashedPassword});

			console.log('Name frei');
			res.end('OK');
		}
	});
	

	
	res.end('done');
});

app.listen(3000,function(){
	console.log("Working on port 3000");
});

function validatepassword(username, password) {
/*var db = new Engine.Db('db', {});
var collection = db.collection("users");
var result = collection.findOne({"ratioWidth":4});
print (tojson(result));*/
//return (password == result);

	var db = new Engine.Db('db', {});
	var collection = db.collection("users");
	var valid = false;
	collection.findOne({"username":username}, function(err, result) {
		if (err) { 
			console.log('error'); 
			return false;
		}
		if (result) {
			// we have a result
			console.log('result');
			resultpassword = result.password;
			console.log(resultpassword + ' ' + password);
			
			if (resultpassword == password) {
				valid = true;
				console.log("Passwoerter gleich");
				return true;
			} else {
				return false;
			}
		} else {
			// we don't
			console.log('no result');
			return false;
		}
	});

}
