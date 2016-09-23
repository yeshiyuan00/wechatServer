var fetch = require('node-fetch');

// if you are on node v0.10, set a Promise library first, eg.
// fetch.Promise = require('bluebird');

// plain text or html
export default function getWechatToken(){

	fetch('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf1555fcc2e2dbb93&secret=39dc2dba48823cc3866e585eac285f17')
    	.then(function(res) {
        	return res.text();
    	}).then(function(body) {
        	console.log(body);
    	});
};

