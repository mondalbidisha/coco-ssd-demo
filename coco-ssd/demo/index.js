import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as cpu from '@tensorflow/tfjs-backend-cpu'
import * as webgl from '@tensorflow/tfjs-backend-webgl'

let modelPromise;
let baseModel = 'lite_mobilenet_v2';
const video = document.getElementById("videoContainer");
const select = document.getElementById('base_model');

window.onload = () => {
  modelPromise = cocoSsd.load({
    base: baseModel
  })
  startVideo();
};

select.onchange = async (event) => {
  modelPromise = cocoSsd.load({
    base: event.srcElement.options[event.srcElement.selectedIndex].value
  });
  debugger
  drawPredictions();
};

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}

const drawPredictions = async() => {
  debugger
  const model = await modelPromise;
  console.log('model loaded');
  setInterval(async () => {
  const result = await model.detect(video);
  console.timeEnd('predict1');

  const c = document.getElementById('canvas');
  const context = c.getContext('2d');
  context.drawImage(video, 0, 0);
  context.font = '10px Arial';
  
  console.log('number of detections: ', result.length);
  for (let i = 0; i < result.length; i++) {
    console.log(result[i].class)
    context.beginPath();
    context.rect(...result[i].bbox);
    context.lineWidth = 1;
    context.strokeStyle = 'green';
    context.fillStyle = 'green';
    context.stroke();
    context.fillText(
      result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
      result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
    }
  }, 100);
}

video.addEventListener("playing", async () => {
  drawPredictions();  
});
