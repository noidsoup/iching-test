<template>
  <div>
    <canvas id="canvas" width="500" height="660"></canvas>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    let forwardTimes = []
    let withBoxes = true
    function onChangeHideBoundingBoxes(e) {
      withBoxes = !$(e.target).prop('checked')
    }
    function updateTimeStats(timeInMs) {
      forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
      const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
      $('#time').val(`${Math.round(avgTimeInMs)} ms`)
      $('#fps').val(`${faceapi.round(1000 / avgTimeInMs)}`)
    }
    async function onPlay() {
      const videoEl = $('#inputVideo').get(0)
      if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
        return setTimeout(() => onPlay())
      const options = getFaceDetectorOptions()
      const ts = Date.now()
      const result = await faceapi.detectSingleFace(videoEl, options).withFaceExpressions()
      updateTimeStats(Date.now() - ts)
      if (result) {
        drawExpressions(videoEl, $('#overlay').get(0), [result], withBoxes)
      }
      setTimeout(() => onPlay())
    }
    async function run() {
      // load face detection and face expression recognition models
      await changeFaceDetector(TINY_FACE_DETECTOR)
      await faceapi.loadFaceExpressionModel('/')
      changeInputSize(224)
      // try to access users webcam and stream the images
      // to the video element
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
      const videoEl = $('#inputVideo').get(0)
      videoEl.srcObject = stream
    }
    function updateResults() {}
    $(document).ready(function() {
      renderNavBar('#navbar', 'webcam_face_expression_recognition')
      initFaceDetectionControls()
      run()
    })
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background: #18181d;
  text-align: center;
}

canvas {
  display: inline-block;
  max-width: 100%;
  max-height: 100%;
}
body {
  background: black;
}
</style>
