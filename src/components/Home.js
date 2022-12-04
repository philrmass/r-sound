import { useState } from 'preact/hooks';
import { getMicrophone } from '../utilities/audio';
import FrequencyDisplay from './FrequencyDisplay';
import styles from './Home.module.css';

export default function Home() {
  const [analyser, setAnalyser] = useState(null);

  const handleClick = async () => {
    if (!analyser) {
      const stream = await getMicrophone();
      const ac = new window.AudioContext();
      const source = ac.createMediaStreamSource(stream);
      const ana = source.context.createAnalyser();
      ana.fftSize = 256;
      source.connect(ana);
      setAnalyser(ana);
    }
  };

  const handleSize = (inc) => {
    const last = analyser.fftSize;
    const scaled = inc ? (last * 2) : (last / 2);
    const size = Math.min(Math.max(32, scaled), 32768);

    analyser.fftSize = size;
  };

  return (
    <div className={styles.home}>
      <div className={styles.display} onClick={handleClick}>
        <FrequencyDisplay analyser={analyser} />
        { !analyser && (
          <div className={styles.message}>Click to Start</div>
        )}
      </div>
      <div className={styles.controls}>
        <div className={styles.control}>
          fftSize
          <button onClick={() => handleSize(false)}>-</button>
          <button onClick={() => handleSize(true)}>+</button>
        </div>
      </div>
    </div>
  );
}
