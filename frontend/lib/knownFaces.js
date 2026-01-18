import * as faceapi from "face-api.js";

export async function loadKnownFaces(people, profiles = {}) {
  const labeledDescriptors = [];

  for (const person of people) {
    const descriptors = [];
    const profile = profiles[person];

    // Check if we have captured images from signup
    if (profile && profile.capturedImages && profile.capturedImages.length > 0) {
      // Use captured images from signup (base64 encoded)
      for (let i = 0; i < profile.capturedImages.length; i++) {
        const imageData = profile.capturedImages[i];
        if (imageData) {
          try {
            const img = new Image();
            img.src = imageData;
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });

            const detection = await faceapi
              .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (detection) {
              descriptors.push(detection.descriptor);
            }
          } catch (err) {
            console.warn(`Skipping captured image ${person}/${i}: ${err}`);
          }
        }
      }
    } else {
      // Fallback to filesystem images (existing behavior)
      for (let i = 1; i <= 3; i++) {
        try {
          const img = await faceapi.fetchImage(
            `/known_faces/${person}/${i}.jpg`
          );

          const detection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            descriptors.push(detection.descriptor);
          }
        } catch (err) {
          console.warn(`Skipping image ${person}/${i}.jpg: ${err}`);
        }
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
