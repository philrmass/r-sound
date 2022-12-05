import Canvas from './Canvas';
import styles from './FrequencyDisplay.module.css';

const bgColor = '#383838';
const gridColor = '#e0a830';
const valueMax = 256;

function drawRect(x, y, width, height, p, ctx) {
  const xf = x + p.padding;
  const yf = p.fullHeight - p.padding - height;

  ctx.fillRect(xf, yf, width, height);
}

function drawBar(index, value, p, ctx) {
  const x = index * p.lineWidth;
  const lineHeight = (value / valueMax) * p.height;

  drawRect(x, 0, p.lineWidth, lineHeight, p, ctx);
}

function drawLabel(value, x, y, ctx) {
  let pow = Math.ceil(Math.log10(value));
  let isK = false;
  let text = '';

  if (pow >= 3) {
    value /= 1000;
    pow -= 3;
    isK = true;
  }

  if (pow >= 0) {
    text = value.toFixed(3 - pow);
  } else {
    text = value.toFixed(0);
  }

  text = `${text}${isK ? 'k' : ''}`;
  const offsetX = 0.5 * ctx.measureText(text).width;

  ctx.fillText(text, x - offsetX, y);
}

function drawGrid(p, ctx) {
  const X0 = 0;
  const X1 = 0.25 * p.width;
  const X2 = 0.5 * p.width;
  const X3 = 0.75 * p.width;
  const X4 = p.width;
  const x0 = p.padding + X0;
  const x1 = p.padding + X1;
  const x2 = p.padding + X2;
  const x3 = p.padding + X3;
  const x4 = p.padding + X4;
  const y0 = p.padding;
  const y1 = p.padding + p.height;
  const fontSize = 14;
  const gap = 4;
  const yText = p.padding + p.height + gap + fontSize;

  ctx.strokeStyle = gridColor;
  ctx.fillStyle = gridColor;
  ctx.font = `${fontSize}px sans-serif`;

  ctx.beginPath();
  ctx.moveTo(x1, y0);
  ctx.lineTo(x1, y1);
  ctx.moveTo(x2, y0);
  ctx.lineTo(x2, y1);
  ctx.moveTo(x3, y0);
  ctx.lineTo(x3, y1);
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y1);
  ctx.lineTo(x4, y1);
  ctx.lineTo(x4, y0);
  ctx.lineTo(x0, y0);
  ctx.stroke();

  const f0 = (X0 / p.lineWidth) * p.frequencyStep;
  const f1 = (X1 / p.lineWidth) * p.frequencyStep;
  const f2 = (X2 / p.lineWidth) * p.frequencyStep;
  const f3 = (X3 / p.lineWidth) * p.frequencyStep;
  const f4 = (X4 / p.lineWidth) * p.frequencyStep;

  drawLabel(f0, x0, yText, ctx);
  drawLabel(f1, x1, yText, ctx);
  drawLabel(f2, x2, yText, ctx);
  drawLabel(f3, x3, yText, ctx);
  drawLabel(f4, x4, yText, ctx);
}

export default function FrequencyDisplay({ analyser }) {
  const draw = (ctx) => {
    if (analyser) {
      const length = analyser.frequencyBinCount;
      const buffer = new Uint8Array(length);
      analyser.getByteFrequencyData(buffer);

      const padding = 32;
      const fullHeight = ctx.canvas.height;
      const fullWidth = ctx.canvas.width;
      const height = fullHeight - 2 * padding;
      const width = fullWidth - 2 * padding;
      const offset = 0;

      const maxFrequency = analyser.context.sampleRate / 2;
      const frequencyStep = maxFrequency / length;

      const params = {
        frequencyStep,
        fullHeight,
        fullWidth,
        height,
        length,
        lineWidth: Math.round((width / length)) || 1,
        offset,
        padding,
        width,
      };

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, fullWidth, fullHeight);

      drawGrid(params, ctx);

      ctx.fillStyle = '#e0e0e0';
      buffer.map((value, index) => {
        drawBar(index, value, params, ctx);
      });
    }
  };

  return (
    <Canvas className={styles.canvas} draw={draw} />
  );
}
