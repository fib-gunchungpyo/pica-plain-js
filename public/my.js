function onUploadChange(evt) {
  console.log("event.target.files[0]", event.target.files[0]);
  const reader = new FileReader();
  reader.onload = function () {
    const preview = document.getElementById("source-image");
    preview.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
  resizeByPica(event.target.files[0]);
}

function resizeByPica(file) {
  // const maxsize = 2000000; // more than 2MB will be converted
  const maxsize = 500000; // more than 500KB will be converted
  if (file.size < maxsize) {
    const newfile = file;
    console.log("newfile", newfile); // we can use this newfile to upload
    return;
  }
  const img = new Image();
  const resizer = window.pica();
  img.onload = () => {
    const width = 600; // set width
    const height = (img.height * width) / img.width;
    const from = img;
    const to = document.createElement("canvas");
    to.width = width;
    to.height = height;
    resizer
      .resize(from, to)
      .then(function (result) {
        const dataURL = result.toDataURL();
        const preview = document.getElementById("output-image");
        preview.src = dataURL;

        return resizer.toBlob(result, "image/jpeg", 0.9);
      })
      .then(function (blob) {
        const newfile = blobToFile(blob, file.name);
        console.log("newfile", newfile); // we can use this newfile to upload
      })
      .catch(function (err) {
        console.log(err);
        throw err;
      });
  };
  img.src = window.URL.createObjectURL(file);
}

function blobToFile(blob, fileName) {
  return new File([blob], fileName, {
    lastModified: new Date().getTime(),
    type: blob.type,
  });
}
