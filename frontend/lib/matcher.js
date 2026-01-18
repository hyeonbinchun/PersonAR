import * as faceapi from "face-api.js";

export function createFaceMatcher(labeledDescriptors, threshold = 0.6) {
  return new faceapi.FaceMatcher(labeledDescriptors, threshold);
}
