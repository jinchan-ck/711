
var Share = require('./share_manager');
var fs = require('fs');
var unzip = require('unzip');

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
  var fileName = req.files.photo.name;
  var targetPath = './view/' + req.files.photo.name;
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
    shareInfo.title = req.body.title || fileName.substring(0, fileName.lastIndexOf("."));
    shareInfo.timestamp = Date.now();
    shareInfo.type = getTypeByFileName(targetPath);
    
    if (shareInfo.type === "zip") {
      console.log("unziping");
      var unzipPath = "./view/" + fileName.substring(0, fileName.lastIndexOf("."));
      var extract = unzip.Extract({ path:  unzipPath });  
      extract.on('error', function(err) {  
          console.log("error++++++++++++++++++++++");  
          console.log(err);  
          //解压异常处理  
      });  
      extract.on('finish', function() {
          console.log("解压完成!!");  
          //解压完成处理  
          // var files = fs.readdirSync(unzipPath);
          // console.log(files);
          // files.forEach(function (f, i) {
          //   // 每找到一个文件都会调用一次此函数
          //   // 参数s是通过 fs.stat() 获取到的文件属性值
          //   console.log('file: %s', f);
          // });
      });
      fs.createReadStream(targetPath).pipe(extract);
      shareInfo.sourceId = fileName.substring(0, fileName.lastIndexOf("."));
    }else{
      shareInfo.sourceId = req.files.photo.name;
    }
    var shareManager = new Share();
    shareManager.addShareInfo(shareInfo, function (err){
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
  ".ppt":"docs",
  ".pptx":"docs",
  ".zip": "docs",
  ".pdf": "docs"
};

getTypeByFileName = function (fileName){
  var ad = fileName.substring(fileName.lastIndexOf("."));
  var type = fileType[ad];
  return type ? type : "file";
}

exports.getAll = function getAll (req, res){
  var shareManager = new Share();
  shareManager.getAll(function (err, results){
    if (err) {
      res.writeHead(500, {"Content-Type":"application/json"});
        res.end('{"status":"ERROR"}');
      return;
    }
    res.writeHead(200, {"Content-Type":"application/json;charset=utf-8"});
      var responseData = {
        "status": "OK",
        "shareInfos": results
      }
      res.end(JSON.stringify(responseData));
  });
}

exports.avatar = function avatar (req, res){
  var user = req.query.user;
  res.redirect('./' + user + ".png");
}