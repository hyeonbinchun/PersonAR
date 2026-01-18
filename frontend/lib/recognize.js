import * as faceapi from "face-api.js";

export async function recognizeFaces(video, faceMatcher) {
  // Use SSD Mobilenet instead of TinyFaceDetector
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
    .withFaceLandmarks()
    .withFaceDescriptors();

  return detections.map(det => {
    const match = faceMatcher.findBestMatch(det.descriptor);

    return {
      box: det.detection.box,
      landmarks: det.landmarks.positions,
      name: match.label,
      distance: match.distance,
    };
  });
}
