import crypto from 'crypto';
import config from '../config';
import sign from '../lib/sign';
import { get } from '../lib/server';

const getAccessToken = () => {
  return get('https://api.weixin.qq.com/cgi-bin/token', {
    query: {
      grant_type: 'client_credential',
      appid: config.appid,
      secret: config.secret,
    },
  });
}

const getJsapiTicket = access_token => {
  return get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
    query: {
      access_token: access_token,
      type: 'jsapi',
    },
  });
}

const wechatSignature = async (ctx, next) => {
  const url = ctx.request.href;
  try {
    if (!global.ACCESS_TOKEN) {
      const data = await getAccessToken();
      global.ACCESS_TOKEN = data.access_token;
    }
    const data = await getJsapiTicket(global.ACCESS_TOKEN);
    ctx.response.body = sign(data.ticket, url);
  } catch (error) {
    ctx.response.body = {error: error}
  }
}

module.exports = {
    'GET /wechat/signature': wechatSignature
};
