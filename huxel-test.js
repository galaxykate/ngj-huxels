/**
 * 
 **/

MODES.test = {
	start({}) {

	},

	stop({}) {

	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		if (Math.random() > .9) {
			let x = randInt(0, 10)
			let y = randInt(0, 10)
			huxels.push(new Huxel(x, y))
		}

	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		// p.background(50, 100, 90)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.circle(0, 0, 500)
	},
	
}