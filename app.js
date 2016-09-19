// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('Koa');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

//用来解析Request的body
const bodyParser = require('koa-bodyparser'); 

// 创建一个Koa对象表示web app本身:
const app = new Koa();

const nunjucks = require('nunjucks');

const fs = require('fs');

const templating = require('./templating.js');

const isProduction = process.env.NODE_ENV === 'production';

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`); // 打印URL
    var
        start = new Date().getTime(),
        execTime;
    await next();  // 调用下一个middleware
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
});

// static file support:
if (! isProduction) {
	let staticFiles = require('./static-files');
	app.use(staticFiles('/static/', __dirname + '/static'));
}

// parse request body:
app.use(bodyParser());


// add nunjucks as view:
app.use(templating('view', {
    noCache: !isProduction,
    watch: !isProduction
}));

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router) {
    var files = fs.readdirSync(__dirname + '/controllers');
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    }, files);

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    }
}

addControllers(router);

// add router middleware:
app.use(router.routes());

// 对于任何请求，app将调用该异步函数处理请求
// app.use(async(ctx,next){
// 	await next();
// 	ctx.response.type = 'text/html';
// 	ctx.response.body = '<h1>Hello koa2!!!</h1>';
// });

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');