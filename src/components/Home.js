import { useEffect, useRef, useState } from 'preact/hooks';
import { getMicrophone } from '../utilities/audio';
import styles from './Home.module.css';

function makeDraw(analyser, ctx) {

  const draw = () => {
    requestAnimationFrame(draw);
    const bufferLength = analyser.frequencyBinCount;
    const buf = new Uint8Array(bufferLength);
    //analyser.getByteTimeDomainData(buf);
    analyser.getByteFrequencyData(buf);
    const last = buf.findIndex((val) => val === 0);
    const max = buf.reduce((max, val) => val > max ? val : max, 0);
    console.log(`draw [${last}] (${max})`, buf[1], buf[11], buf[21], buf[31], buf[41], buf[51], buf[61], buf[1000]);
  };

  return draw;
}

export default function Home() {
  const canvas = useState(null);
  const [ctx, setCtx] = useState(null);
  const [ac, setAc] = useState(null);
  const [mic, setMic] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [data, setData] = useState(null);
  console.log('analyser', analyser);

  const draw = (time) => {
    /*
    if (analyser) {
      const buf = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(buf);
      console.log('data', buf[0], buf[1]);
    }
    */
    const bufferLength = analyser?.frequencyBinCount ?? 0;
    //analyzer.getByteTimeDomainData(data);
    //console.log('draw', time, analyser);
    requestAnimationFrame(draw);
  };

  const handleClick = () => {
    getMicrophone().then((stream) => setMic(stream));
    setAc(new window.AudioContext());
  };
  /*
  useEffect(() => {
    getMicrophone().then((stream) => setMic(stream));
    setAc(new window.AudioContext());
  }, []);
  */

  useEffect(() => {
    if (ac && mic) {
      const asr = ac.createAnalyser();
      // ??? AnalyserNode.fftSize 2048
      // ??? AnalyserNode.minDecibels
      // ??? AnalyserNode.maxDecibels
      // ??? AnalyserNode.smoothingTimeConstant
      const source = ac.createMediaStreamSource(mic);
      //asr.connect(source);
      source.connect(asr);
      //asr.connect(ac.destination);

      asr.fftSize = 2048;
      const bufferLength = asr.frequencyBinCount;
      setData(new Uint8Array(bufferLength));

      console.log('ASR', asr, ctx, source, mic);
      console.log('ASR', source.channelInterpretation);
      console.log('SR', ac.sampleRate / (2 * 1024));
      setAnalyser(asr);
      const d = makeDraw(asr, ctx);
      requestAnimationFrame(d);
      //requestAnimationFrame(draw);

      //const bufferLength = analyser.frequencyBinCount;
      const buf = new Uint8Array(bufferLength);
      asr.getByteTimeDomainData(buf);
      console.log('DRAW', buf.length, buf[5], buf[1000]);
    }
  }, [ac, mic]);

  useEffect(() => {
    if (canvas.current) {
      const c = canvas.current.getContext("2d");
      c.fillStyle = '#444';
      c.fillRect(0, 0, canvas.current.width, canvas.current.height);
      setCtx(c);
    }
  }, [canvas.current]);

  return (
    <div className={styles.home} onClick={handleClick}>
      <canvas ref={canvas} class="visualizer" width="600" height="100" />
      <div>{mic?.active ? 'true' : 'false'}</div>
      <div>{ac?.state}</div>
      <div>{analyser?.fftSize}</div>
    </div>
  );
}

/*
  const canvas = document.querySelector(".visualizer");
  const canvasCtx = canvas.getContext("2d");
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

 analyser.fftSize = 256;
      const bufferLengthAlt = analyser.frequencyBinCount;
      console.log(bufferLengthAlt);

      // See comment above for Float32Array()
      const dataArrayAlt = new Uint8Array(bufferLengthAlt);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      const drawAlt = function () {
        drawVisual = requestAnimationFrame(drawAlt);

        analyser.getByteFrequencyData(dataArrayAlt);

        canvasCtx.fillStyle = "rgb(0, 0, 0)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          canvasCtx.fillRect(
            x,
            HEIGHT - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      };

      drawAlt();
      */
