/**
 *
 **/

let timer;

MODES.start = {
	start({}) {
		console.log("START TEST")
		timer = new Timer(3000, () => { app.debugOptions.mode = "tetris" })
	},

	stop({p, tracker, huxels, time, particles, debugOptions}) {
		console.log("STOP TEST")
	},

	update({ p, tracker, huxels, time, particles, debugOptions }) {
		timer.update(time.dt)
		if (Math.random() > .9) {
			let x = randInt(0, 10)
			let y = randInt(0, 10)
			huxels.push(new Huxel(x, y))
		}

	},

	drawBackground({ p, tracker, huxels, time, particles, debugOptions }) {
		if (IMAGE.loading) {
			p.image(IMAGE.loading, 0, 0, p.width, p.height);
		}
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {


	},

}