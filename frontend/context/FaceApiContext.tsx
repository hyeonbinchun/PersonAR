import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { loadFaceModels, loadKnownFaces, createFaceMatcher, recognizeFaces } from '@/lib';
import { useDatabase } from './DatabaseContext'; // Import useDatabase

interface FaceApiContextType {
  modelsLoaded: boolean;
  faceMatcher: faceapi.FaceMatcher | null;
  loadingError: Error | null;
  generateEmbedding: (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => Promise<{ descriptor: Float32Array } | null>;
  recognizeFacesInImage: (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => Promise<any[]>;
}

const FaceApiContext = createContext<FaceApiContextType | undefined>(undefined);

export const FaceApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profiles } = useDatabase(); // Use the database context to get profiles
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [loadingError, setLoadingError] = useState<Error | null>(null);

  useEffect(() => {
    const initFaceApi = async () => {
      try {
        await loadFaceModels();
        console.log("Face models loaded");
        setModelsLoaded(true);

        // Load known faces for initial FaceMatcher
        const knownFaceLabels = Object.keys(profiles); // Use profiles from DatabaseContext
        const labeledDescriptors = await loadKnownFaces(knownFaceLabels, profiles);
        const matcher = createFaceMatcher(labeledDescriptors);
        setFaceMatcher(matcher);
        console.log("Known faces and FaceMatcher initialized");
      } catch (error) {
        console.error("Failed to load face-api.js models or known faces:", error);
        setLoadingError(error as Error);
      }
    };

    initFaceApi();
  }, [profiles]); // Re-run if profiles change (e.g., new user added)

  const generateEmbedding = useCallback(async (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
    if (!modelsLoaded) {
      console.warn("Models not loaded yet. Cannot generate embedding.");
      return null;
    }
    try {
      const detection = await faceapi
        .detectSingleFace(image, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor();
      return detection ? { descriptor: detection.descriptor } : null;
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  }, [modelsLoaded]);

  const recognizeFacesInImage = useCallback(async (image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
    if (!modelsLoaded || !faceMatcher) {
      console.warn("Models or FaceMatcher not loaded yet. Cannot recognize faces.");
      return [];
    }
    try {
      const results = await recognizeFaces(image, faceMatcher);
      return results;
    } catch (error) {
      console.error("Error recognizing faces:", error);
      return [];
    }
  }, [modelsLoaded, faceMatcher]);


  return (
    <FaceApiContext.Provider value={{ modelsLoaded, faceMatcher, loadingError, generateEmbedding, recognizeFacesInImage }}>
      {children}
    </FaceApiContext.Provider>
  );
};

export const useFaceApi = () => {
  const context = useContext(FaceApiContext);
  if (context === undefined) {
    throw new Error('useFaceApi must be used within a FaceApiProvider');
  }
  return context;
};
