import Canvas from './Canvas';
import styles from './FrequencyDisplay.module.css';

const bgColor = '#383838';
const padding = 32;
const valueMax = 256;

function drawRect(x, y, width, height, p, ctx) {
  const xf = x + padding;
  const yf = p.fullHeight - padding - height;

  ctx.fillRect(xf, yf, width, height);
}

function drawLine(index, value, p, ctx) {
  const x = index * p.lineWidth;
  const lineHeight = (value / valueMax) * p.height;

  drawRect(x, 0, p.lineWidth, lineHeight, p, ctx);
}

export default function FrequencyDisplay({ analyser }) {
  const draw = (ctx) => {
    if (analyser) {
      const length = analyser.frequencyBinCount;
      const buffer = new Uint8Array(length);
      analyser.getByteFrequencyData(buffer);

      const fullHeight = ctx.canvas.height;
      const fullWidth = ctx.canvas.width;
      const width = fullWidth - 2 * padding;
      const height = fullHeight - 2 * padding;

      const params = {
        fullHeight,
        fullWidth,
        height,
        lineWidth: Math.round(width / buffer.length, 5),
        width,
      };

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, fullWidth, fullHeight);

      ctx.fillStyle = '#6422';
      drawRect(0, 0, params.width, params.height, params, ctx);

      ctx.fillStyle = '#bdd';
      buffer.map((value, index) => {
        drawLine(index, value, params, ctx);
      });
    }
  };

  return (
    <Canvas className={styles.canvas} draw={draw} />
  );
}
