function convertToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  // headers
  for (let index in objArray[0]) {
    if (str != '') str += ',';
    str += index;
  }
  str += '\r\n';

  // data rows
  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line != '') line += ',';
      line += array[i][index];
    }
    str += line + '\r\n';
  }
  return str;
}
export function downloadCSV(objArray, title = "export") {
  const csv = convertToCSV(objArray);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${title}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

