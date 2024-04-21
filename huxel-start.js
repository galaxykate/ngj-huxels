/**
 * 
 **/

MODES.start = {
	start({}) {
		console.log("START TEST")
	},

	stop({p, tracker, huxels, time, particles, debugOptions}) {
		console.log("STOP TEST")
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {

	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		// p.background(50, 100, 90)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.fill(300, 80, 50)
		// p.circle(0, 0, 500)
		p.text("TEST APP", 100, 100)


	},
	
}