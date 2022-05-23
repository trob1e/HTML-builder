const { deepStrictEqual } = require('assert');
const { FILE } = require('dns');
const fs = require('fs');
const path = require('path');


fs.mkdir(path.join(__dirname, `project-dist`), () => { });

const htmlwriteStream = fs.createWriteStream(path.join(__dirname, `project-dist`, `index.html`), { encoding: 'utf-8' });
const htmlreadStream = fs.createReadStream(path.join(__dirname, `project-dist`, `index.html`), { encoding: 'utf-8' });
const htmlTemplatereadStream = fs.createReadStream(path.join(__dirname, `template.html`), { encoding: 'utf-8' });
const csswriteStream = fs.createWriteStream(path.join(__dirname, `project-dist`, `style.css`), { encoding: 'utf-8' });

let pullinformHTML = '';
let nameVstavki = [];

const readhtml = (NameHtml) => {
    const nameHtml = path.join(__dirname, NameHtml);
    const stream = fs.createReadStream(nameHtml, 'utf8');
    stream.on('data', chunk => pullinformHTML += chunk);
};

const createIndexHTML = () => {
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, file) => {
        if (err) throw err;
        for (let i = 0; i < file.length; i++) {
            let filehtml = path.join(path.join(__dirname, 'components'), file[i].name);
            let informFile = path.parse(filehtml);
            if (file[i].isFile() && informFile.ext === '.html') {
                nameVstavki.push(`{{${informFile.name}}}`);
                const stream = fs.createReadStream(filehtml, 'utf-8');
                stream.on('data', chunk => {
                    const pos = pullinformHTML.indexOf(nameVstavki[i]);
                    pullinformHTML = pos !== -1 ? pullinformHTML.slice(0, pos) + chunk + pullinformHTML.slice(pos + nameVstavki[i].length) : pullinformHTML;
                });
                stream.on('end', () => fs.writeFile(path.join(path.join(__dirname, 'project-dist'), 'index.html'), pullinformHTML, err => { if (err) throw err; }));
            }
        }
    });
};

fs.readdir(path.join(__dirname, "styles"), { withFileTypes: true }, (err, data) => {

    if (err) return err;

    data.forEach(file => {

        if ((file.isFile() && (path.extname(file.name).slice(1) == `css`))) {

            let readStream = fs.createReadStream(path.join(__dirname, "styles", file.name), { encoding: 'utf-8' });

            //создаем поток для чтения для каждого файла с расширением css и по частям записываем его в bundle

            readStream.on(`data`, data => {
                csswriteStream.write(data);
            })

        }
    })
})

copeDir();
function copeDir() {

    fs.readdir(path.join(__dirname, `project-dist`, `assets`), { withFileTypes: true }, (err, data) => {
        if (err) return err;
        data.forEach(file => {
            fs.readdir(path.join(__dirname, `project-dist`, `assets`, file.name), { withFileTypes: true }, (err, data) => {
                if (err) return err;
                data.forEach(fil => {
                    fs.unlink(path.join(__dirname, `project-dist`, `assets`, file.name, fil.name), err => { });
                })
            })
        })
    });

    fs.mkdir(path.join(__dirname, `project-dist`, `assets`), { recursive: true }, (err) => {
        if (err) return err;
    });
    fs.readdir(path.join(__dirname, `assets`), { withFileTypes: true }, (err, data) => {
        if (err) return err;
        data.forEach(file => {

            fs.mkdir(path.join(__dirname, `project-dist`, "assets", file.name), err => { });

            fs.readdir(path.join(__dirname, `assets`, file.name), { withFileTypes: true }, (err, data) => {
                if (err) return err;
                data.forEach(fil => {
                    fs.copyFile(path.join(__dirname, `assets`, file.name, fil.name), path.join(__dirname, `project-dist`, `assets`, file.name, fil.name), err => { });

                })
            })
        })
    });
}

readhtml('template.html');
createIndexHTML();
