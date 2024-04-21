MODES.clean = {
	dirt: [],
	stars: [],

	start({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.scale = 6
		this.dirt = []
		this.stars = []
		for (let i = 0; i < 256; i++) {
			this.dirt.push(new Vector2D(Math.random() * 1664 + 128, Math.random() * 854 + 128))
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
						if (Math.random() < 0.3) {
							this.stars.push(this.dirt[index])
						}
						this.dirt.splice(index, 1)
						index--
					}
				}
			}
		})
		if (this.dirt.length <= 0) {
			debugOptions.mode = "tetris"
		}
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.image(IMAGE.cleanMirror, 0, 0, 1920, 1080)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.imageMode(p.CENTER)
		this.stars.forEach(star => {
			p.image(IMAGE.cleanStar, ...star)
		})
		this.dirt.forEach(spot => {
			p.image(tracker.faces[0].thumbnail, ...spot)
		})
		tracker.hands.forEach(hand => {
			if (hand.isActive) {
				p.image(IMAGE.cleanSponge, ...hand.center, 128, 64)
			}
		})
		p.imageMode(p.CORNER)
	},
}
