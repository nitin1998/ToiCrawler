// Web crawler with nodejs using crawler library
let express = require("express");
let Crawler = require('crawler');
let app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
        
app.get("/", function(req, resp) {

    let crawl = new Crawler({
        maxConnections: 1,
        jQuery: false,
        callback: function (err, res, done) {
            if (err) {
                console.log(err);
            } else {
                const dom = new JSDOM(res.body);
                console.log(dom.window.document.querySelector("a").textContent);
                const $ = (require('jquery'))(dom.window);
                
                //let's start extracting the data
                var items = $(".media-heading");
                console.log(items);
                var html = "";
                var movie = [];
                for(var i = 0; i < items.length; i++) {
                    var movieName = $($(items[i]).find('a')[0]).html();
                    var movieYear = $($(items[i]).find('span')[0]).html();
                    html += (i + " -> " + movieYear + ":" + movieName);
                    movieName = movieName.replace(/\&nbsp;/g, '');  //  replace &nbsp; with '' so that it will not be passed to HTML
                    movie.push(movieName);  //  adding the movieName to array
                }
                resp.render('home', {data: movie});
            }
            done();
        }
    });

    // Enter the website to crawl
    crawl.queue('https://timesofindia.indiatimes.com/blogs/');
});

app.listen(process.env.PORT || 3000, function() {
    console.log("server started at port 3000");
});