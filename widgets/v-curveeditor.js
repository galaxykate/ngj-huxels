Vue.component("curve-editor", {
	// Define the points on a curve
	// For an envelope, 
	//  we will also specify the distance from start or end

	template: `<div class="widget widget-curveeditor">
		<header>curve-editor</header>
		<div class="p5" ref="p5" />
	</div>`,


	computed: {
		positions() {
			return this.points.map(pt => {
	          	let x = pt.fromStartPct*this.p.width
	          	let y = pt.val*this.p.height
	          	// console.log(x,y)
	          	return {x,y,pt}
          })
		}
	},

	mounted() {
		let count = 10
		for (var i = 0; i < count; i++) {
			let pct = i/(count - 1)
			this.points.push({
				fromStartPct: pct,
				val: Math.random(),

			})
		}


		new p5((p) => {
			app.mouse.addWindow({
				id:  "curve-editor",
				p,
				getTouchables: () => {
					return this.positions
				},
				drop: () => {

				},

			})
			
			this.p = p
        // We have a new "p" object representing the sketch
     
      
        this.capture;
        p.setup = () => {
          p.createCanvas(300, 100);
          p.colorMode(p.HSL);

          this.positions.forEach(({x,y}) => p.circle(x, y, 20))

        };

        p.draw = () => {
         


        };
      }, this.$refs.p5);
	},
	data() {
		return {
			p:{}
		}
	},
	props: ["points"]
})