import { useEffect, useRef, useState } from 'preact/hooks';

function drawLine(x, lineHeight, height, ctx) {
  ctx.fillRect(x, height - lineHeight, 2, lineHeight);
}

function getDraw(analyser, ctx) {
  const draw = () => {
    requestAnimationFrame(draw);

    const length = analyser.frequencyBinCount;
    const buffer = new Uint8Array(length);
    analyser.getByteFrequencyData(buffer);

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#bdd';

    buffer.slice(0, 300).map((value, index) => {
      const ratio = value / 256;
      const lineHeight = ratio * height;
      drawLine(index * 2, lineHeight, height, ctx);
    });
  };
  draw();
}

export default function FrequencyDisplay({ analyser }) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      const width = context.canvas.width;
      const height = context.canvas.height;

      context.fillStyle = '#444';
      context.fillRect(0, 0, width, height);
      setCtx(context);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (ctx && analyser) {
      getDraw(analyser, ctx);
    }
  }, [ctx, analyser]);

  return (
    <div>
      <canvas ref={canvasRef} width="600" height="100" />
    </div>
  );
}
