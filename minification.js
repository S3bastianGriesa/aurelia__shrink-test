const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const crypto = require('crypto');
const UglifyJS = require('uglify-js');

const distfolder = 'scripts';
let distFolderFiles;
let bundleName;

function compressFile(filename) {
  const compress = zlib.createGzip();
  const input = fs.createReadStream(filename);
  const output = fs.createWriteStream(`${filename}.gz`);
  input.pipe(compress).pipe(output);
}

function readDir(location) {
  return new Promise((resolve, reject) => {
    fs.readdir(location, (error, files) => {
      if (error) {
        return reject(error);
      }
      
      return resolve(files);
    });
  });
}

function readFile(path) { 
  return new Promise((resolve, reject) => { 
    fs.readFile(path, 'utf8', (error, data) => { 
      if (error) { 
        return reject(error); 
      } 
 
      return resolve(data); 
    }) 
  }); 
} 
 
function writeFile(location, content) { 
  return new Promise((resolve, reject) => { 
    fs.writeFile(location, content, (error) => { 
      if (error) { 
        return reject(error); 
      } 
 
      return resolve(); 
    }); 
  }) 
} 

readDir(distfolder)
  .then((files) => {
    distFolderFiles = files;

    const order = ['vendor', 'app'];
    jsfiles = distFolderFiles.filter((file) => { 
      return path.extname(file) === '.js'; 
    })
      .sort((file1, file2) => {
        let score1 = 0;
        let score2 = 0;
        for (let i = 0; i < order.length; i++) {
          if (file1.indexOf(order[i]) === 0) {
            score1 = i + 1;
          }
          if (file2.indexOf(order[i]) === 0) {
            score2 = i + 1;
          }
        }

        return score1 - score2;
      })
      .map((file) => {
        return path.join(distfolder, file);
      }); 
 
    const content = UglifyJS.minify(jsfiles);
    bundleName = `aurelia__shrink.js`; 
    return writeFile(path.join(distfolder, bundleName), content.code);
  }) 
  .then(() => { 
    const filetypes = new Set(['.html', '.css', '.js']);
    distFolderFiles.push(bundleName);
    distFolderFiles.filter((file) => {
      return filetypes.has(path.extname(file));
    })
    .map((file) => {
      return compressFile(path.join(distfolder, file));
    });
  });
