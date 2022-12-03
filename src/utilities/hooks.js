import { useEffect, useRef } from 'preact/hooks';

export function useCanvas(draw) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let count = 0;
    let requestId = 0;

    const render = () => {
      count++;
      draw(ctx, count);
      requestId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, [draw]);

  return canvasRef;
}
