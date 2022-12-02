import { useState } from 'preact/hooks';
import { getMicrophone } from '../utilities/audio';
import Canvas from './Canvas';
import FrequencyDisplay from './FrequencyDisplay';
import styles from './Home.module.css';

export default function Home() {
  const [analyser, setAnalyser] = useState(null);

  const handleClick = async () => {
    if (!analyser) {
      const stream = await getMicrophone();
      const ac = new window.AudioContext();
      const source = ac.createMediaStreamSource(stream);
      const asr = source.context.createAnalyser();
      source.connect(asr);
      setAnalyser(asr);
    }
  };

  const draw = (ctx, count) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const rem = Math.floor(count / width);
    const x = count - (rem * width);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#bbccdd';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#400000';
    ctx.fillRect(x, height / 2, 10, 10);
  };

  return (
    <>
      <div className={styles.home} onClick={handleClick}>
        <FrequencyDisplay analyser={analyser} />
        <Canvas className={styles.display} draw={draw} />
      </div>
    </>
  );
}
