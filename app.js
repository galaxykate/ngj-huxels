/**
 * Starter code
 *
 */
/* globals Vue, p5, Tracker */
// GLOBAL VALUES, CHANGE IF YOU WANT




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
      gameLoop() {
        if (Math.random() > .9) {

        }
      },  
    },

    computed: {
      activeEnvelopes() {
        return this.envelopes.filter(e => e.isActive)
      },

      mode() {
        return MODES[this.debugOptions.mode]
      }
    },

    watch: {

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

        this.mouse.addWindow({
          id:"main",
          p})

        // We have a new "p" object representing the sketch

        this.capture;
        p.setup = () => {
          p.createCanvas(600, 500);
          p.colorMode(p.HSL);
          this.tracker.createCaptureAndInitTracking(p)

        };

        p.draw = () => {
          p.background(100, 100, 100)
          
          this.time.update()
          // Try to detect faces, hands, poses
          app.tracker.detect()

          

          /**
           * Custom mode behavior
           **/
          this.mode.update(app)
          this.mode.drawBackground(app)

           if (app.debugOptions.showTrackerCamera)
            app.tracker.drawCapture(p)
          if (app.debugOptions.showTrackerLandmarks)
            app.tracker.drawDebugData(p)
         

          // this.huxels.forEach(h => h.draw(app))
          this.mode.draw(app)


        };
      }, this.$refs.p5);
    },

    data() {
      return {

        ...app
      };
    },
    el: "#app",
  });
});
