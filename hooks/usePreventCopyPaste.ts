import { useEffect } from 'react';

import { toast } from 'sonner';

export const usePreventCopyPaste = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12 key (including with Fn key)
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }

      // Prevent Devleoper (Option+Cmd + J)
      if (e.metaKey) {
        e.preventDefault();
        // toast.error('Meta key is not allowed!');
        return;
      }
      // prevent reload / hard reload
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'R') ||
        (e.ctrlKey && e.key === 'r')
      ) {
        e.preventDefault();
        // toast.error('reloading is not  allowed!');
        return;
      }

      // Prevent (select all)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        // toast.error('Selecting all is not allowed!');
        return;
      }

      // Check for Windows (Ctrl/Win + V) or Mac (Cmd + V)
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        toast.error('Pasting is not allowed!');
        return;
      }
      // Prevent cut (Ctrl/Cmd + X)
      if ((e.metaKey || e.ctrlKey) && e.key === 'x') {
        e.preventDefault();
        toast.error('Cutting is not allowed!');
        return;
      }

      // Prevent copy (Ctrl/Cmd + C)
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault();
        toast.error('Copying is not allowed!');
        return;
      }

      // Prevent paste (Ctrl/Cmd + V)
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        // toast.error('Windows clipboard history is disabled!');
        return;
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error('Pasting is not allowed!');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error('Right-click menu is disabled!');
    };

    // Add global event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup function to remove event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
};
