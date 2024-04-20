MODES.bee = {
	pollen:0,

	start({}) {
	},

	stop({}) {
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.hands.forEach(hand => {
			if (hand.isActive) {
				let position = hand.center
				let foundFlower = false
				for (let face of tracker.faces) {
					if (face.isActive && Vector2D.distance(position, face.nose) < 64) {
						this.pollen += time.dt
						foundFlower = true
						break
					}
				}
				if (!foundFlower && position.x < 128 && position.y < 256) {
					this.pollen -= time.dt
					if (this.pollen < 0) {
						this.pollen = 0
					}
				}
			}
		})
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		// p.background(50, 100, 90)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.textSize(64)
		p.fill(64, 100, 50)
		p.rect(0, 0, 128, 256)
		tracker.faces.forEach(face => {
			if (face.isActive) {
				p.text("🌻", ...face.nose)
			}
		})
		tracker.hands.forEach(hand => {
			if (hand.isActive) {
				p.text("🐝", ...hand.center)
			}
		})
		p.fill(0, 0, 0)
		p.text(this.pollen, 0, 64)
	},
}
