import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState<any>();
  const [progress, setProgress] = useState<number>();

  const handleChange = (e: any) => {
    if (e.target.files) {
      setValue(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (value) {
      let resource = {
        file: value,
        accessToken: import.meta.env.VITE_ACCESS_TOKEN,
        folderId: import.meta.env.VITE_FOLDER,
      };
      resumeableUpload(resource);
    }
  };

  const resumeableUpload = (resource: any) => {
    const ru = new ResumableUploadToGoogleDrive2();
    ru.Do(resource, function (res: any, err: any) {
      if (err) {
        console.log(err);
        return;
      }

      if (res.status == "Uploading") {
        let msg = Math.round(
          (res.progressNumber.current / res.progressNumber.end) * 100
        );
        setProgress(msg);
      }
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/tanaikech/ResumableUploadForGoogleDrive_js@master/resumableupload2_js.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="App">
      <input type="file" id="files" name="file" onChange={handleChange}></input>
      <button onClick={handleClick}>Submit</button>
      {progress && <div>{progress}</div>}
    </div>
  );
}

export default App;
