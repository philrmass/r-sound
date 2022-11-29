export async function getMicrophone() {
  if (navigator.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true, video: false });
      return stream;
    } catch (err) {
      console.error(`getUserMedia error: [${err}]`);
      return null;
    }
  }
}
