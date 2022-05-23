const fsPromises = require('fs/promises');
const PATH = require('path');

const listOfFiles = async (path) => {
  const filesToShow = [];
  const files = await fsPromises.readdir(path, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const dir = PATH.resolve(path, file.name);
      const { size } = await fsPromises.stat(dir);
      const fileInfo = [file.name.substring(0, file.name.lastIndexOf('.')), file.name.substring(file.name.lastIndexOf('.') + 1)];
      filesToShow.push([...fileInfo, size / 1024 + 'kb']);
    }
  }
  return filesToShow;
};

const filesInfoOutput = async () => {
  const list = await listOfFiles(PATH.resolve(__dirname, './secret-folder'));
  list.map(x => console.log(x.join(' - ')));
};

filesInfoOutput();