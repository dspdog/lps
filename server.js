var url = require('url');

var http = require('http');
var request = require('request');
var util = require('util');

//var exec = require('child_process').exec;
var exec = require('exec');

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

var getPlateOutputForImage = function(picurl, cb){

    var file = picurl.substring(picurl.lastIndexOf('/')+1);

    exec(['wget {0} && docker run -it --rm -v $(pwd):/data:ro openalpr -c eu {1}'.format(picurl, file)], function(err, out, code) {
        if (err instanceof Error)
            throw err;
        process.stderr.write(err);
        process.stdout.write(out);
        process.exit(code);

        setTimeout(function(){
            cb("okok");
        },1000);
    });

   /* exec(cmd, function(error, stdout, stderr) {
        console.log("OUT1",util.inspect(stdout));

        cmd = 'docker run -it --rm -v $(pwd):/data:ro openalpr -c eu {0}'.format(file);

        console.log("CMD2",cmd);

        exec(cmd, function(error, stdout, stderr) {
            // command output is in stdout
            console.log("OUT2",util.inspect(stdout));
            cb(stdout);
        });
    });*/
}

var server = http.createServer(function(req, res) {
    var queryData = url.parse(req.url, true).query; //eg, if(queryData.eventpush || queryData.eventpusher){
    if(queryData.picurl){

        var onGotResult = function(result){
            res.end(result);
        };

        getPlateOutputForImage(queryData.picurl, onGotResult);

    }else{
        res.end("no img provided");
    }
});

console.log("SERVER LISTEN", 80);
server.listen(80);