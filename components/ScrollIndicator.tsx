import { useEffect, useState } from 'react';

import { ChevronDown } from 'lucide-react';

export function ScrollIndicator({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollHeight, clientHeight, scrollTop } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      setIsVisible(scrollHeight > clientHeight && !isAtBottom);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    return () => container.removeEventListener('scroll', checkScroll);
  }, [containerRef]);

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce bg-yellow-100">
      <ChevronDown className="h-6 w-6 text-black" />
    </div>
  );
}
