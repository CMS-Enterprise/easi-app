import axios from 'axios';

export function downloadBlob(filename: string, blob: Blob) {
  // This approach to downloading files works fine in the tests I've done in Chrome
  // with PDF files that are < 100kB. For larger files we might need to
  // instead redirect the browser to a URL that returns the file. That
  // approach is complicated by using JWTs for auth.
  //
  // TODO test this in various browsers. Some reports say this might not work
  // properly in Firefox and that firing a MouseEvent is required instead.
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;

  // This downloads the file to the user's machine.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadFileFromURL(downloadURL: string, fileName: string) {
  return axios
    .request({
      url: downloadURL,
      responseType: 'blob',
      method: 'GET'
    })
    .then(response => {
      const blob = new Blob([response.data]);
      downloadBlob(fileName, blob);
    })
    .catch(() => {
      // We don't currently handle errors from this function, but when we do we should update this to pull from i18n
      throw new Error('Failed to download file');
    });
}

export function blobToBase64(fileBlob: File): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(fileBlob);
  });
}

export async function fileToBase64File(fileBlob: File): Promise<File> {
  const b64String = await blobToBase64(fileBlob);
  return new Promise((resolve, _) => {
    const newFile = new File([b64String], fileBlob.name);
    resolve(newFile);
  });
}
