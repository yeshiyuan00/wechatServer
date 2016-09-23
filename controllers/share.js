module.exports = {
    'GET /share': async (ctx, next) => {
        ctx.render('wechat.html', {
            title: 'Welcome'
        });
    }
};