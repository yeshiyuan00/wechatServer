const crypto = require('crypto');

const token = 'yeshiyuan';

const checkSignature = (signature,timestamp,nonce,token) => {
  const tmpArr = [token,timestamp,nonce].sort();
  const tmpStr = tmpArr.join('');
  let shasum = crypto.createHash('sha1');
  shasum.update(tmpStr);
  const shaResult = shasum.digest('hex');
  if(shaResult === signature){
    return true;
  }
  return false;
}

var weToken = async (ctx, next) => {
    const { signature, timestamp, nonce, echostr } = ctx.request.query;
    if (checkSignature(signature, timestamp, nonce, token)) {
      ctx.response.body = echostr;
    }
    ctx.response.body = 'invalid request';
};

module.exports = {
    'GET /token': weToken
};