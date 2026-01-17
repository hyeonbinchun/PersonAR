import React, { useEffect, useRef, useState } from "react";
import {
  loadFaceModels,
  loadKnownFaces,
  createFaceMatcher,
  recognizeFaces,
} from "../face";

export default function VideoFeed() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceMatcher, setFaceMatcher] = useState(null);

  useEffect(() => {
    async function init() {
      await loadFaceModels();
      console.log("Models loaded!");

      const knownFaces = await loadKnownFaces(["Jun", "Owen", "Khoi"]);
      console.log("Known faces loaded:", knownFaces);

      const matcher = createFaceMatcher(knownFaces);
      setFaceMatcher(matcher);
    }

    init();
  }, []);

  useEffect(() => {
    async function startVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }

    startVideo();
  }, []);

  const handleVideoPlay = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!faceMatcher || !video) return;

    // Match video dimensions to canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    const detect = async () => {
      if (video.paused || video.ended) return;

      const results = await recognizeFaces(video, faceMatcher);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      results.forEach(face => {
        const { box, name } = face;
        // Draw box
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Draw name
        ctx.fillStyle = "red";
        ctx.font = "16px Arial";
        ctx.fillText(name, box.x, box.y > 20 ? box.y - 5 : box.y + 15);
      });

      requestAnimationFrame(detect);
    };

    detect();
  };

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ border: "1px solid black" }}
        onPlay={handleVideoPlay} // Wait until video starts
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}
