import { useCanvas } from '../utilities/hooks';

export default function Canvas({ className, draw }) {
  const canvasRef = useCanvas(draw);
  console.log('useCanvas', typeof useCanvas);
  console.log('className', className);

  // <div className={className} onResize={handleResize}>
  return (
    <div>
      <canvas className={className} ref={canvasRef} width="200" height="100" />
    </div>
  );
}
