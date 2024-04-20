MODES.fish = {
	start({}) {
		console.log("START FISH")
	},

	stop({}) {
		console.log("STOP FISH")
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		if (Math.random() > .9) {
			let x = randInt(0, 10)
			let y = randInt(0, 10)
			huxels.push(new Huxel(x, y))
		}

	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(50, 100, 90)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		// Tracker is where all the hands, faces, and poses live

		tracker.hands.forEach(hand => {
			if (hand.isActive) {
				
				hand.fingers.forEach(finger => {
					// p is the processing instance
					p.fill(320, 100, 50)
					// draw Vector2d(processing instance, radius)
					finger.tip.draw(p, 10)

					p.text("💖", finger.tip.x, finger.tip.y)
					// p.text("💖", ...finger.tip)
				})
			}
		})


		tracker.faces.forEach(face => {
			if (face.isActive) {
				// console.log(face)

				face.side.forEach(side  => {
					let eyePos = side.irisCenter
					p.fill(320, 100, 0)
					eyePos.draw(p, 10)

				})
				
			}
		})

	},
	
}