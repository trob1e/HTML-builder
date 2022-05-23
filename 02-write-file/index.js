const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin } = require('process');

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);
 
let read = readline.createInterface({
  input: stdin
});

console.log('Write text here: ');

read.on('line', (input) => {
  if (input === 'exit') {
    console.log('Exit complete');
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), `${input}\n`, err => {if (err) throw err;});
  }
});