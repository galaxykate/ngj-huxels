/**
 * Starter code
 *
 */
/* globals Vue, p5, Tracker */
// GLOBAL VALUES, CHANGE IF YOU WANT

/**
 * Make the outer window as big as possible
 **/


let app = {
  hWidth: 100,
  hHeight: 100,
  p: undefined,
  tracker:new Tracker({
    mediapipePath:"/mediapipe/",
    // handLandmarkerPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/",
    // faceLandmarkerPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/",
    // poseLandmarkerPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker/float16/1/"
    handLandmarkerPath: "/mediapipe/",
    faceLandmarkerPath: "/mediapipe/",
    poseLandmarkerPath: "/mediapipe/",
    createLandmark() {
      return new Vector2D(0,0)
    }
  }),
  mouse: new DraggableMouse(),
  huxels: [],
  time:new HeartBeatTime({loopOver: 3}),
  debugOptions: {
    speed: 1,
    showTrackerLandmarks: false,
    showTrackerCamera: false,
    mode: "test",
  },
  debugOptionsOptions: {
    mode: ["ignore this"]
  }
}


let MODES = {}


document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  app.debugOptionsOptions.mode = Object.keys(MODES)

  new Vue({
    template: `<div id="app">

    <div id="main-drawing" ref="p5"></div>

    <div class="controls">
      <curve-editor :points="points"  v-if="false" />
      <motion-recorder :tracker="tracker" v-if="false" />
      <heartbeat-time :time="time"  v-if="false" />

      <flag-tracker :obj="debugOptions" id="debugOptions" :options="debugOptionsOptions"/>

      <div style="width:150px;height:100px;border:2px solid blue;overflow:scroll">
        <div v-for="hux in huxels">
          {{hux}}
        </div>
      </div>


    </div>



    </div>`,

    methods: {


    },

    computed: {
    
      mode() {
        return MODES[this.debugOptions.mode]
      }
    },

    watch: {

      mode() {
        this.lastMode?.stop(app)
        this.lastMode = this.mode
        console.log(`----- MODE CHANGED -> ${this.debugOptions.mode} -------`)
        this.mode.start(app)

      }
    },

    mounted() {

      initMidi({
        onKeyUp: (note,velocity) => {
        console.log("UP", note, velocity)
        },
        onKeyDown: (note,velocity) => {
           console.log("DOWN", note, velocity)
        },
        onFader: (id, val) => {
          console.log("FADER", id, val)
        }
      })

      // Create a p5 object for whatever
      new p5((p) => {

        app.p = p

        let clippingMask = p.createGraphics(200,200)

        this.mouse.addWindow({
          id:"main",
          p})

        // We have a new "p" object representing the sketch

        this.capture;
        p.setup = () => {
          p.createCanvas(this.$refs.p5.offsetWidth, this.$refs.p5.offsetHeight);
          p.colorMode(p.HSL);
          this.tracker.createCaptureAndInitTracking(p)

        };

        p.draw = () => {
          p.background(190, 100, 90)

          this.time.update()
          // Try to detect faces, hands, poses
          app.tracker.detect()



          /**
           * Custom mode behavior
           **/
          this.mode.update(app)
          this.mode.drawBackground(app)

           if (app.debugOptions.showTrackerCamera) {
            p.push()
            p.scale(app.tracker.scale,app.tracker.scale)
             app.tracker.drawCapture(p)
             p.pop()
           }

          if (app.debugOptions.showTrackerLandmarks)
            app.tracker.drawDebugData(p)


          // this.huxels.forEach(h => h.draw(app))
          this.mode.draw(app)

          // clippingMask.background(0)
          // clippingMask.circle(0,0, 300)
          // p.image(clippingMask, 0, 0)

         


        };
      }, this.$refs.p5);

       this.mode.start(app)
    },

    data() {
      return {
        lastMode: undefined,
        ...app
      };
    },
    el: "#app",
  });
});
