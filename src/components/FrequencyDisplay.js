import Canvas from './Canvas';
import styles from './FrequencyDisplay.module.css';

function drawLine(x, lineHeight, height, ctx) {
  ctx.fillRect(x, height - lineHeight, 2, lineHeight);
}

export default function FrequencyDisplay({ analyser }) {
  const draw = (ctx) => {
    if (analyser) {
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
    }
  };

  return (
    <Canvas className={styles.display} draw={draw} />
  );
}
