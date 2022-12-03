import { useEffect, useState } from 'preact/hooks';
import { useCanvas } from '../utilities/hooks';

export default function Canvas({ className, draw }) {
  const [observing, setObserving] = useState(false);
  const canvasRef = useCanvas(draw);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!observing && canvas) {
      const observer = new ResizeObserver(() => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      });

      observer.observe(canvas);
      setObserving(true);
    }
  }, [observing, canvasRef]);

  return (
    <canvas className={className} ref={canvasRef} />
  );
}
