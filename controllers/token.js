const crypto = require('crypto');

const token = 'yeshiyuan';

const checkSignature = (signature,timestamp,nonce,token) => {
  const tmpArr = [token,timestamp,nonce].sort();
  const tmpStr = tmpArr.join('');
  const shaResult = crypto
    .createHash('sha1')
    .update(tmpStr)
    .digest('hex');
  return shaResult === signature;
}

const wechatToken = async (ctx, next) => {
    const { signature, timestamp, nonce, echostr } = ctx.request.query;
    if (checkSignature(signature, timestamp, nonce, token)) {
      ctx.response.body = echostr;
    } else {
      ctx.response.body = 'invalid request';
    }
};

module.exports = {
    'GET /wechat/token': wechatToken
};