import Promise from 'bluebird';

export function readFile(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function(evt) {
      resolve({ name: file.name, content: evt.target.result });
    }
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
