/**
 * Starter code
 *
 */
/* globals Vue, p5, Tracker */
// GLOBAL VALUES, CHANGE IF YOU WANT




let app = {
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
  points: [],
  envelopes: [],
  time:new HeartBeatTime({loopOver: 3}),
  debugOptions: {
    speed: 1,
    showTrackerDebug: false,
    mode: "test"
  },
  debugOptionsOptions: {
    mode: ["test", "foo", "bar"]
  }
}



document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: `<div id="app">

    <div id="main-drawing" ref="p5"></div>

    <div class="controls">
      <curve-editor :points="points"  v-if="false" />
      <motion-recorder :tracker="tracker" v-if="false" />
      <heartbeat-time :time="time"  v-if="false" />

      <flag-tracker :obj="debugOptions" id="debugOptions" :options="debugOptionsOptions"/>
    </div>
    
    

    </div>`,

    methods: {

    },

    computed: {
      activeEnvelopes() {
        return this.envelopes.filter(e => e.isActive)
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
      new p5((pNew) => {
        p = pNew

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
          p.background(190, 100, 90)

          this.time.update()


          // Try to detect faces
          app.tracker.detect()

          if (app.debugOptions.showTrackerDebug)
            app.tracker.drawDebugData(p)
          

          p.fill(210, 100, 40)
          // p.circle(0, 0, 500)

          // THIS IS ALL THE STUFF WE ARE TRACKING
          // console.log(app.tracker)
          // p.beginShape()
          // app.tracker.hands.forEach(hand => {
          //   // console.log("Ima hand", hand.isActive)

          //   let pt = hand.fingers[1].tip

          //   // console.log(pt)
          //   // pt.draw(p, 40)
          //   p.curveVertex(...pt)
          // })

          // p.endShape()

          app.tracker.faces.forEach(face => {
            console.log(face)
            
            // // Draw nose
            // p.fill(0, 100, 50)
            // face.nose.draw(p, 20)

            // // Draw emoji
            // p.textSize(40)
            // p.text("💖", ...face.nose)

            // Draw glasses
            face.side.forEach(side => {
              // do something on this side

              // get a list of points around the eye
              let ringPts = side.eyeRings[0]
              let innerPts = side.eyeRings[4]
              p.fill(320, 100, 0)
              p.beginShape()
              ringPts.forEach(pt => {
                p.vertex(...pt)
              })
              p.endShape()

              p.fill(320, 100, 100)
              p.beginShape()
              innerPts.forEach(pt => {
                p.vertex(...pt)
              })
              p.endShape()
            })

          })

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
