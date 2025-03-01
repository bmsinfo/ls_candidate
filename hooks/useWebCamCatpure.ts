import { toast } from "@/components/ui/use-toast";
import { useMediaPermission } from "@/providers/MediaProvider";
import { useRef, useState, useCallback } from "react";

// Define the return type for the custom hook
interface UseWebcamCapture {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  errorMsg: string;
  candidateSelfie: string | null;
  captureSelfie: () => void;
  retakeSelfie: () => void;
}

const useWebcamCapture = (): UseWebcamCapture => {
  const { videoRef, setCandidateSelfie } = useMediaPermission(); // Access the videoRef from MediaProvider
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref for the canvas element
  const [candidateSelfie, _] = useState<string | null>(null); // State to store the captured screenshot
  const [errorMsg, setErrorMsg] = useState<string>(""); // State to store error messages

  // Capture a selfie from the webcam
  const captureSelfie = useCallback((): void => {
    const video = videoRef?.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      const errorMessage = "Video or canvas element is not initialized";
      console.error(errorMessage);
      setErrorMsg(errorMessage);
      return;
    }

    // Set the canvas size to match the video stream dimensions
    canvas.width = video.videoWidth || 320; // Fallback width
    canvas.height = video.videoHeight || 240; // Fallback height

    // Get the 2D drawing context
    const context = canvas.getContext("2d");
    if (!context) {
      const errorMessage = "Failed to get canvas context";
      console.error(errorMessage);
      setErrorMsg(errorMessage);
      return;
    }

    // Draw the current frame from the video onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a base64 image
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    setCandidateSelfie(imageDataUrl);

    toast({
      title: "Selfie captured!",
      description: "Your selfie has been captured.",
    });
  }, [videoRef, setCandidateSelfie, canvasRef]);

  const retakeSelfie = useCallback((): void => {
    setCandidateSelfie(""); // Clear the current screenshot
    setErrorMsg("");
  }, [setCandidateSelfie, setErrorMsg]);

  return {
    canvasRef,
    errorMsg,
    candidateSelfie,
    captureSelfie,
    retakeSelfie,
  };
};

export default useWebcamCapture;
