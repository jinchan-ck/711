var Mongolian = require('mongolian');

function Share (shareInfo, callback){
  var mongo = this.mongo = new Mongolian();
  this.shareDb = mongo.db('share');
  
  var coll = this.shareDb.collection('data');
  console.log(shareInfo);
  delete shareInfo._id
  coll.insert(shareInfo, function (err, res){
    if (err) {
      console.log(err);
      callback(err);
      mongo.close();
      return;
    }
    mongo.close();
    callback(null);
    console.log(res);
  });
}
module.exports = Share;