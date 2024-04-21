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
  faceThumbnailSize: 80,
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
  time:new HeartBeatTime({}),
  debugOptions: {
    speed: 1,
    showTrackerLandmarks: false,
    showTrackerCamera: false,
    mode: "test",
  },
  debugOptionsOptions: {
    mode: ["ignore this"]
  },
  score: {
    value: 0
  }
}


let MODES = {}


document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  app.debugOptionsOptions.mode = Object.keys(MODES)

  new Vue({
    template: `<div id="app" @click="enterTetris">

    <div id="main-drawing" ref="p5"></div>
    <div id="score">Score: {{score.value}}</div>

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
      enterTetris() {
        if (this.debugOptions.mode === "start") {
          console.log("CLICKED TO ENTER TETRIS")
          this.debugOptions.mode = "tetris"

        }
      }

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


        // Make graphics for each face
        this.tracker.faces.forEach(f => {
          let img = p.createGraphics(app.faceThumbnailSize,app.faceThumbnailSize)
          f.thumbnail = img

          img.pixelDensity(1);
        })

        this.mouse.addWindow({
          id:"main",
          p})

        p.preload = () => {
          // Load all images
          loadImageAssets(p)
          loadSoundAssets(p)
        }


        // We have a new "p" object representing the sketch
        p.setup = () => {
          p.createCanvas(this.$refs.p5.offsetWidth, this.$refs.p5.offsetHeight);
          p.colorMode(p.HSL);
          this.tracker.createCaptureAndInitTracking(p)

          this.mode.start(app)

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



          let src = this.tracker.capture

          // transparentSlice(clippingMask, this.tracker.capture, x,y, 1)
          p.stroke(320, 100, 50)
          p.noFill()
          // p.rect(x, y, w, h)

          // Update all the thumbnails
          this.tracker.faces.forEach((f,index) => {
            if (f.isActive) {

              // Bit of a border
              let x = f.x - 40
              let y = f.y - 20
              let h = f.h*1.2

              let thumbH = app.faceThumbnailSize
              let img = f.thumbnail
              img.push()

              let scale0 = thumbH/h
              let scale1 = this.tracker.scale*thumbH/h
              // console.log(scale0, scale1)

              img.scale(scale1, scale1)
              img.translate(-x/this.tracker.scale, -y/this.tracker.scale)

              // Draw flipped source
              img.translate(src.width, 0)
              img.scale(-1, 1)
              img.image(src, 0, 0)
              img.pop()

              makePixelsOutsideCircleTransparent(img, thumbH/2, thumbH/2, thumbH/2)
            }
          })

        };
      }, this.$refs.p5);


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
