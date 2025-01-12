import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
  const { url, width, height } = image;

  const [faces, setFaces] = useState([]); //yüzlerin konumların tutar
  const [friends, setFriends] = useState({}); //kullanıcıların etiketlediği arkadaş isimlerini tutar
  const [expressions, setExpressions] = useState([]); //yüz ifadelerini tutar

  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    //yüz tespitlerinden elde edilen bilgi
    const detections = await faceapi.detectAllFaces( 
      imgRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions(); 
  
    //yüzlerin etrafındaki dikdörtgenlerin koordinatları, faces state'ine atanır
    const faceBoxes = detections.map((d) => Object.values(d.detection.box));
    setFaces(faceBoxes);

    //her yüz için en baskın duyguyu tespit eder ve expressions state'ine kaydeder
    const faceExpressions = detections.map((d) => {
      const { expressions } = d;
      // En yüksek olasılığa sahip ifadeyi al
      const maxExpression = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );
      return maxExpression;
    });
    setExpressions(faceExpressions);
  };

  //canvas üzerine çizim yapar
  const enter = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Temizle
    ctx.lineWidth = 5;
    ctx.strokeStyle = "yellow";

    faces.forEach((face, index) => {
      ctx.strokeRect(...face);

      const expression = expressions[index] || "N/A"; // Expression boşsa 'N/A' yaz
      ctx.font = "16px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(expression, face[0], face[1] - 10); // Yüz ifadesini çerçevenin üstünde yaz
    });
  };

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };

    imgRef.current && loadModels();
  }, []);

  // Arkadaş etiketleme
  const addFriend = (e) => {
    const friendName = e.target.value;
    const index = e.target.name;

    // Arkadaş ismini güncelle
    setFriends((prev) => ({
      ...prev,
      [index]: friendName, // index ile birlikte arkadaşı ekle
    }));
  };

  return (
    <div className="container">
      <div className="left" style={{ width, height }}>
        <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
        <canvas
          onMouseEnter={enter}
          ref={canvasRef}
          width={width}
          height={height}
        />
        {faces.map((face, i) => (
          <input
            name={i} 
            style={{ left: face[0], top: face[1] + face[3] + 5 }}
            placeholder="Tag a friend"
            key={i}
            className="friendInput"
            onChange={addFriend}
          />
        ))}
      </div>
      <div className="right">
        <h1>Share your post</h1>
        <input
          type="text"
          placeholder="What's on your mind?"
          className="rightInput"
        />
        {Object.keys(friends).length > 0 && (
          <span className="friends">
            with <span className="name">{Object.values(friends).join(", ")}</span>
          </span>
        )}
        <button className="rightButton">Send</button>
      </div>
    </div>
  );
};

export default NewPost;
