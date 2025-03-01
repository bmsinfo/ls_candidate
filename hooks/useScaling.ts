import { useState, useEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
  scale: number;
  x: number;
  y: number;
}

export function useScaling(targetWidth = 1280, targetHeight = 720): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: targetWidth,
    height: targetHeight,
    scale: 1,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isPortrait = viewportHeight > viewportWidth;

      // For portrait mode (tablets), we prioritize width scaling
      // to ensure content is always visible and properly aligned
      let scale;
      if (isPortrait) {
        // In portrait, we primarily scale based on width
        // but ensure we don't make it too big if height is constrained
        const maxScaleByWidth = viewportWidth / targetWidth;
        const maxScaleByHeight = viewportHeight / targetHeight;
        scale = Math.min(maxScaleByWidth, maxScaleByHeight * 1); // 0.8 factor to leave some breathing room
      } else {
        // In landscape, use regular scaling
        const scaleX = viewportWidth / targetWidth;
        const scaleY = viewportHeight / targetHeight;
        scale = Math.min(scaleX, scaleY);
      }

      // Calculate centered position
      const x = Math.max(0, (viewportWidth - targetWidth * scale) / 2);

      // For portrait mode, we always start from top with a small padding
      const y = isPortrait
        ? 20 // Add a small top padding in portrait mode
        : viewportHeight < targetHeight * scale
          ? 0
          : (viewportHeight - targetHeight * scale) / 2;

      setDimensions({
        width: targetWidth,
        height: targetHeight,
        scale,
        x,
        y,
      });
    };

    // Initial update
    updateDimensions();

    // Update on resize and orientation change
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [targetWidth, targetHeight]);

  return dimensions;
}
