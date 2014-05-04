var Mongolian = require('mongolian');

function Share (){
  var mongo = this.mongo = new Mongolian();
  this.shareDb = mongo.db('share');
}
module.exports = Share;

Share.prototype.addShareInfo = function addShareInfo (shareInfo, callback){
  var self = this;
  var coll = self.shareDb.collection('data');
  console.log(shareInfo);
  delete shareInfo._id
  coll.insert(shareInfo, function (err, res){
    if (err) {
      console.log(err);
      callback(err);
      self.mongo.close();
      return;
    }
    self.mongo.close();
    callback(null);
    console.log(res);
  });
}

Share.prototype.getAll = function getAll(callback){
  var self = this;
  var coll = self.shareDb.collection('data');
  coll.find().sort({timestamp: -1}).toArray(function(err, results){
    if (err) {
      console.log(err);
      callback(err);
      self.mongo.close();
      return;
    }
    self.mongo.close();
    callback(null, results);
  });
}