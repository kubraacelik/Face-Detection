import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NewPost from "./components/NewPost";

function App() {
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    const getImage = () => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setImage({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    };

    file && getImage();
  }, [file]);

  return (
    <div className="app">
      <Navbar />
      {image ? (
        <NewPost image={image} />
      ) : (
        <div className="newPostCard">
          <div className="addPost">
            <img
              src="https://images.pexels.com/photos/18398361/pexels-photo-18398361/free-photo-of-kadin-model-ayakta-portre-modu.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="avatar"
            />
            <div className="postForm">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="postInput"
              />
              <label htmlFor="file">
                <img className="addImg" src="/icons/gallery.png" alt="" />
                <img className="addImg" src="/icons/map.png" alt="" />
                <img className="addImg" src="/icons/timetable.png" alt="" />
              </label>
              <button>Send</button>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                style={{ display: "none" }}
                type="file"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

    //   canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    //   faceapi.matchDimensions(canvasRef.current, {
    //     width,
    //     height,
    //   });

    // const resized = faceapi.resizeResults(detections, {
    //   width,
    //   height,
    // });

    // faceapi.draw.drawDetections(canvasRef.current, resized);
    // faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
