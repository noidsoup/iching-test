<template>
  <div>
    <canvas id="canvas" width="500" height="660"></canvas>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let x1;
    let y1;
    let z1;
    const n = 20000;
    const scale = 15;
    const cx = 250;
    const cy = 330;
    const c = 28;
    const h = 0.015;
    const t = -6;
    let i = 0;
    let x0 = 0;
    let y0 = 1;
    let z0 = 10;
    const interval = setInterval(() => {
      let k;
      if (i < n) {
        for (k = 0; k < 20; k += 1) {
          x1 = x0 + (h * t * (x0 - y0));
          y1 = y0 + (h * (-x0 * z0 + c * x0 - y0));
          z1 = z0 + (h * (x0 * y0 - z0));

          context.strokeStyle = 'hsl(0, 100%, 50%)';
          context.beginPath();
          context.moveTo(cx + x0 * scale, cy + y0 * scale);
          context.lineTo(cx + x1 * scale, cy + y1 * scale);
          context.stroke();

          x0 = x1;
          y0 = y1;
          z0 = z1;

          i += 1;
        }
      } else {
        clearInterval(interval);
      }
    }, 60);
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
