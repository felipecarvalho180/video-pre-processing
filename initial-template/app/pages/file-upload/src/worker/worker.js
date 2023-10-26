import CanvasRenderer from "./canvasRenderes.js";
import Mp4Demuxer from "./mp4Demuxer.js";
import VideoProcessor from "./videoProcessor.js";

const qvgaContraints = {
  width: 320,
  height: 240,
};
const vgaContraints = {
  width: 640,
  height: 480,
};
const hdContraints = {
  width: 1280,
  height: 920,
};

const enconderConfig = {
  ...qvgaContraints,
  bitrate: 10e6,
  // WEBM
  codec: "vp09.00.10.08",
  pt: 4,
  hardwareAcceleration: "prefer-software",
  //MP4
  // codec: "avc1.42002A",
  // pt: 1,
  // hardwareAcceleration: "prefer-hardware",
  // avc: {
  //   format: "annexb"
  // }
};

const mp4Demuxer = new Mp4Demuxer();
const videoProcessor = new VideoProcessor(mp4Demuxer);

onmessage = async ({ data }) => {
  const renderFrame = CanvasRenderer.getRenderer(data.canvas);

  await videoProcessor.start({
    file: data.file,
    renderFrame,
    encoderConfig: enconderConfig,
    sendMessage(message) {
      self.postMessage(message);
    },
  });

  setTimeout(() => {
    self.postMessage({
      status: "done",
    });
  }, 2000);
};
