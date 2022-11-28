import { useEffect, useState } from 'preact/hooks';
import { getMicrophone } from '../utilities/audio';
import styles from './Home.module.css';

export default function Home() {
  const [recorder, setRecorder] = useState(null);

  useEffect(() => {
    getMicrophone().then((stream) => {
      if (stream) {
        setRecorder(new MediaRecorder(stream));
      }
    });
  }, []);

  return (
    <div className={styles.home}>
      HOME
      <div>{typeof recorder}</div>
    </div>
  );
}
