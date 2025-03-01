import { useEffect } from 'react';

/**
 * Updates the favicon link in the document head
 * @param url - URL of the favicon image
 */
const updateFavicon = (url: string): void => {
  const link = document.querySelector(
    "link[rel*='icon']",
  ) as HTMLLinkElement | null;

  if (link) {
    link.href = url;
  } else {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.type = 'image/x-icon';
    newLink.href = url;
    document.head.appendChild(newLink);
  }
};

/**
 * Custom hook to manage favicon
 * @param url - URL of the favicon image
 * @param fallbackUrl - Fallback URL if primary URL is not available
 */
export const useFavicon = (
  url: string | null | undefined,
  fallbackUrl: string = '/vite.svg',
): void => {
  console.count('faviconhhhhhhh');
  useEffect(() => {
    const faviconUrl = url || fallbackUrl;

    // Create an image element to verify the favicon URL is valid
    const img = new Image();

    img.onload = () => {
      updateFavicon(faviconUrl);
    };

    img.onerror = () => {
      console.warn(
        `Failed to load favicon from ${faviconUrl}, falling back to default`,
      );
      updateFavicon(fallbackUrl);
    };

    img.src = faviconUrl;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url, fallbackUrl]);
};
