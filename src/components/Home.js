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
      const asr = source.context.createAnalyser();
      source.connect(asr);
      setAnalyser(asr);
    }
  };

  return (
    <div className={styles.home} onClick={handleClick}>
      <FrequencyDisplay analyser={analyser} />
    </div>
  );
}
