import { useState } from "react";

function App() {
  const [value, setValue] = useState<any>();
  const handleChange = (e: any) => {
    if (e.target.files) {
      setValue(e.target.files[0]);
    }
  };

  const handleClick = () => {
    let file = new Blob([value], { type: value.type });
    let metadata = {
      name: value.name, // Filename at Google Drive
      mimeType: value.type, // mimeType at Google Drive
      parents: [import.meta.env.VITE_FOLDER], // Folder ID at Google Drive
    };

    let form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=webViewLink,id",
      {
        method: "POST",
        headers: new Headers({ Authorization: "Bearer " + import.meta.env.VITE_ACCESS_TOKEN }),
        body: form,
      }
    )
      .then((res) => {
        return res.json();
      })
      .then(function (val) {
        console.log(val);
      });
  };

  return (
    <div className="App">
      <input type="file" id="files" name="file" onChange={handleChange}></input>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}

export default App;
