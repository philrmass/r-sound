import { useEffect, useRef } from 'preact/hooks';

export function useCanvas(draw) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    console.log('w', width, 'h', height);
    const ctx = canvas.getContext('2d');
    let count = 0;
    let requestId = 0;

    const render = () => {
      count++;
      const { width, height } = canvas.getBoundingClientRect();
      console.log('w', width, 'h', height, 'W', ctx.canvas.width, 'H', ctx.canvas.height);
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
