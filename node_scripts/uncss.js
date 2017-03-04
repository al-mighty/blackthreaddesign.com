const uncss = require('uncss');
// import path from 'path';
const fs  = require('fs');


// console.log(uncss);
const files   = ['http://127.0.0.1:4000/'];

const options = {
    ignore       : [new RegExp('^\.gallery.*')],
   //media        : ['(min-width: 700px) handheld and (orientation: landscape)'],
   //csspath        : '../_site/assets/css/main.css',
   //     raw          : 'h1 { color: green }',
   //     stylesheets  : ['lib/bootstrap/dist/css/bootstrap.css', 'src/public/css/main.css'],
  //ignoreSheets : [/main.js/],
   //     timeout      : 1000,
  //      htmlroot     : 'public',
   //     report       : false,
  //      uncssrc      : '.uncssrc'
    };

uncss(files, options, function (error, output) {
  if(error) console.log(error)
  else { 
    fs.writeFile('uncss.css', output, err => {
      if (err) {
          return console.error(`Autsch! Failed to store file: ${err.message}.`);
      }

      console.log('Saved uncss.css!');
    });
  }
});

// /* Look Ma, no options! */
// uncss(files, function (error, output) {
//     console.log(output);
// });

// /* Specifying raw HTML */
// var rawHtml = '...';

// uncss(rawHtml, options, function (error, output) {
//     console.log(output);
// });