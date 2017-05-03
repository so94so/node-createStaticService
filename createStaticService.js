/*--=== 引入核心模块 fs、http、url、path ===--*/
const  fs = require('fs');
const  http = require('http');
const  url = require('url');
const  path = require('path');

/*--=== 创建server对象 ===--*/
const server = http.createServer(function(req,res){

    var pathname = url.parse(req.url).pathname;//把request的url转成对象 pathname只的是路径例如格式：/index/main/2.txt

    /*--===默认根目录展示的是首页 ===--*/
    if(pathname == '/'){
        pathname = 'index.html';
    }

    /*--=== path 获得拓展名 .html .css .jpg ===--*/
    var extname = path.extname(pathname);
    console.log(extname); //.css .jpg

    /*--=== fs读取文件流 ===--*/
    fs.readFile('./static'+ pathname,function(err,data){

        /*--=== 如果找不到，就返回一个404页面 ===--*/
        if(err){
            fs.readFile('./static/404.html',function(err,data){

                if(err){
                    throw err;
                }

                res.writeHead(404,{'Content-Type':'text/html;charset=utf-8'});
                res.end(data);
            });
            return;
        }

        /*--=== 如果有对应的文件，就读取这个文件返回给前台展示给用户 response的mime类型一定要相对应 ===--*/
        var mime = getMime(extname);

        res.writeHead(200,{'Content-Type':mime});
        res.end(data);

    });

});

server.listen(3000);
console.log('server is listening at port:3000 ...');

/*--=== 封装一个获取mime类型，response给客户端的函数/方法 ===--*/
function getMime(extname){
    switch(extname){
        case '.html' : return 'text/html';break;
        case '.css' : return 'text/css';break;
        case '.jpg' : return 'text/jpg';break;
    }
}

//以上实现了Apache的功能：静态服务器 文件夹里面任何文件都可以被找到！