MODES.clean = {
	dirt: [],
	stars: [],
	countdown: 0,

	start({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.scale = 6
		this.dirt = []
		this.stars = []
		for (let index = 0; index < 256; index++) {
			this.dirt.push(new Vector2D(Math.random() * (p.width - 256) + 128, Math.random() * (p.height - 256) + 128))
		}
		this.countdown = 30000
	},

	stop({p, tracker, huxels, time, particles, debugOptions}) {
		SOUND.windowWipe.stop()
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.hands.forEach(hand => {
			if (hand.isActive) {
				let position = hand.center
				for (let index = 0; index < this.dirt.length; index++) {
					if (Vector2D.distance(position, this.dirt[index]) < 64) {
						if (Math.random() < 0.1) {
							this.stars.push(this.dirt[index])
							app.score.value += 50
						} else {
							app.score.value += 10
						}
						this.dirt.splice(index, 1)
						index--
						if (!SOUND.windowWipe.isPlaying()) {
							SOUND.windowWipe.play()
						}
					}
				}
			}
		})
		this.countdown -= time.dt
		if (this.countdown <= 0) {
			debugOptions.mode = "tetris"
		}
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.image(IMAGE.cleanMirror, 0, 0, p.width, p.height)
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
