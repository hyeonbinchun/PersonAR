import * as faceapi from "face-api.js";

export async function loadKnownFaces(people) {
  const labeledDescriptors = [];

  for (const person of people) {
    const descriptors = [];

    for (let i = 1; i <= 3; i++) {
      try {
        const img = await faceapi.fetchImage(
          `/known_faces/${person}/${i}.jpg`
        );

        const detection = await faceapi
          .detectSingleFace(img, new faceapi.SsdMobilenetv1Options()) // <-- use SSD here
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          descriptors.push(detection.descriptor);
        }
      } catch (err) {
        console.warn(`Skipping image ${person}/${i}.jpg: ${err}`);
      }
    }

    if (descriptors.length > 0) {
      labeledDescriptors.push(
        new faceapi.LabeledFaceDescriptors(person, descriptors)
      );
    }
  }

  return labeledDescriptors;
}
