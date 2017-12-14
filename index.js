var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var chunks = [];

var url = 'http://blog.csdn.net/?&page=';
function getTitle(url,i){
    console.log('正在获取第'+i+'页内容');
    http.get(url+i,function(res){
        res.on('data',function(chunk){
            chunks.push(chunk);
            // console.log(chunks);
        });
        res.on('end',function () {
        var sources = [];
            var html = iconv.decode(Buffer.concat(chunks),'utf-8');
            
            var $ = cheerio.load(html,{decodeEntities: false});
            $('.blog_list_wrap .csdn-tracking-statistics a').each(function(idx,element){
                var $element = $(element);
                sources.push({
                    title: $element.text(),
                    bt: $element.attr('href')
                })
            })
            console.log(sources);
            if(i>=2){
                getTitle(url,--i);
            }else console.log("内容获取完毕！");
        });
    });
}
function main(){
   console.log("开始爬取……");
   getTitle(url,5);
}
main();