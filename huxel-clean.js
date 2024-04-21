MODES.clean = {
	dirt: [],

	start({p, tracker, huxels, time, particles, debugOptions}) {
		this.dirt = []
		for (let i = 0; i < 128; i++) {
			this.dirt.push(new Vector2D(Math.random() * 640, Math.random() * 480))
		}
	},

	stop({p, tracker, huxels, time, particles, debugOptions}) {
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.hands.forEach(hand => {
			if (hand.isActive) {
				let position = hand.center
				for (let index = 0; index < this.dirt.length; index++) {
					if (Vector2D.distance(position, this.dirt[index]) < 64) {
						this.dirt.splice(index, 1)
						index--
					}
				}
			}
		})
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		this.dirt.forEach(spot => {
			p.image(tracker.faces[0].thumbnail, ...spot)
		});
	},
}
