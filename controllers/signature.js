import crypto from 'crypto';
import config from '../config';
import sign from '../lib/sign';
import { get } from '../lib/server';

const getAccessToken = ({appid, secret}) => {
  return get('https://api.weixin.qq.com/cgi-bin/token', {
    query: {
      grant_type: 'client_credential',
      appid: appid,
      secret: secret,
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
  const body = ctx.request.body || {};
  try {
    if (!global.ACCESS_TOKEN) {
      const data = await getAccessToken(body);
      global.ACCESS_TOKEN = data.access_token;
    }
    const data = await getJsapiTicket(global.ACCESS_TOKEN);
    ctx.response.body = sign(data.ticket, url);
  } catch (error) {
    ctx.response.body = {error: error}
  }
}

module.exports = {
    'POST /wechat/signature': wechatSignature
};
