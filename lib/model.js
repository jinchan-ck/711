
var Share = require('./share_manager');
var fs = require('fs');

/*
{
  "pic": "",
  "user": "",
  "title": "",
  "timestamp": 0,
  "type": "",
  "sourceId": ""
}
*/
exports.handleUpload = function handleUpload (req, res){
	console.log("upload starting ");

	var temp_path = req.files.photo.path;
	var targetPath = './uploads/' + req.files.photo.name;
	fs.rename(temp_path, targetPath, function (err){
		if (err) {
			console.log("move file :" + err);
			res.writeHead(500, {"Content-Type":"application/json"});
    		res.end('{"status":"ERROR"}');
			return;
		}
		var shareInfo = require('../share.json');
		// shareInfo.pic = req.files.photo.path;
		shareInfo.user = req.body.user;
		shareInfo.title = req.body.title;
		shareInfo.timestamp = Date.now();
		shareInfo.sourceId = targetPath;
		shareInfo.type = getTypeByFileName(shareInfo.sourceId);
		new Share(shareInfo, function (err){
			if (err) {
				res.writeHead(500, {"Content-Type":"application/json"});
	    		res.end('{"status":"ERROR"}');
				return;
			}
			res.writeHead(200, {"Content-Type":"application/json"});
	    	res.end('{"status":"OK"}');
		});
	});
}

var fileType = {
	".png":"image",
	".ppt":"ppt",
	".pptx":"ppt"
}

getTypeByFileName = function (fileName){
	var ad = fileName.substring(fileName.lastIndexOf("."));
	var type = fileType[ad];
	return type ? type : "file";
}