const uuidv5 = require('uuid/v5');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
var crypto = require('crypto'),
    algorithm = 'aes256',
    password = 'Veysel Atilgan';

    
    exports.encrypt = (text) => {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  };
   

  exports.apiSecretDateTime = (data) => {
	 data = moment(data).utc().format();
    var a = moment(data).format("YYYY-MM-DD HH:mm:ss") ;
    return moment().diff(a, 'minutes');
  };
  exports.decrypt = (text) => {
    try {
        var decipher = crypto.createDecipher(algorithm,password)
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    } catch (ex) {
        return "errror";
    }
  };


  exports.createApiKey = (username, pass, id) => {
    var accessToken = username + uuidv1() + pass + moment(new Date()).format("YYYY-MM-DD HH-mm") + id  ;
    var apikey = username + uuidv1() + pass + moment(new Date()).format("YYYY-MM-DD HH-mm") ;
    const globalPass = '1b671a64-40d5-491e-99b0-da01ff1f3341';
    var newApikey = uuidv1() +  uuidv1() + uuidv5(accessToken, globalPass) + uuidv1()  + uuidv5(apikey, globalPass) +  uuidv5(accessToken, globalPass) +uuidv1() +uuidv1();
    var newAccessToken = uuidv1()+  uuidv1() + uuidv1() + uuidv5(apikey, globalPass) +  uuidv1()   + uuidv5(apikey, globalPass) + uuidv1();
      return newApikey + "+++---+++___----" + newAccessToken;
  };


  function controlData(data) {
    var size = data.length;
    var errorMesage = "";
    for(var i = 1; i < size; i=i+2){
       if(data[i] === "" || data[i] == undefined ){
           errorMesage += data[i-1] + " missing. ";
       }
   };
   return errorMesage;
 
} ;



exports.errorDatabase = (apiName) => {
    return (apiName +  "  api database error");
};

function controlData(data) {
    var size = data.length;
    var errorMesage = "";
    for(var i = 1; i < size; i=i+2){
       if(data[i] === "" || data[i] == undefined ){
           errorMesage += data[i-1] + " missing. ";
       }
   };
   return errorMesage;
 
};


exports.dataEror = (data) => {
    return (controlData(data));
};

exports.fieldControl = (data) => {
    if(data != undefined && data != "") {
        return 1;
    }else {
        return 0;
    }
}



