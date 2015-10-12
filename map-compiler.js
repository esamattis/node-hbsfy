var Handlebars = require('handlebars');
var fs = require('fs');
var SourceMap = require('source-map');
var convertSourceMap = require('convert-source-map');

var input = fs.readFileSync('./maps.hbs', { encoding: 'utf8' });

var js = Handlebars.precompile(input, { srcName: 'maps.hbs' });

var consumer = new SourceMap.SourceMapConsumer(js.map);
var precompiled = SourceMap.SourceNode.fromStringWithSourceMap(js.code, consumer);

var sourceNode = new SourceMap.SourceNode();
sourceNode.add('var template = ');
sourceNode.add(precompiled);
//sourceNode.add('\n//# sourceMappingURL=maps.map\n');
//sourceNode.add(['\n//# sourceMappingURL=', precompiled])

var output = sourceNode.toStringWithSourceMap();
output.map = output.map + '';

//fs.writeFileSync('./maps.map', output.map, 'utf8');
fs.writeFileSync('./maps.js', output.code + '\n' + convertSourceMap.fromObject(output.map).toComment(), 'utf8');


//console.log(JSON.stringify(js, null, '  '))

//fs.writeFileSync('./maps.js', js.code + '\n' + convertSourceMap.fromObject(js).toComment());