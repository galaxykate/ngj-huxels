MODES.bee = {
	bees: [],
	flowers: [],
	hives: [110, 1550],
	hiveRect: {y: 400, width: 270, height: 320},

	start({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.scale = 2
		let beeMax = []
		this.bees = []
		tracker.hands.forEach(hand => {
			this.bees.push(0)
			beeMax.push(500)
		})
		this.flowers = []
		tracker.faces.forEach(face => {
			this.flowers.push(Array.from(beeMax))
		})
		SOUND.beeAmbience.play()
		SOUND.beeAmbience.setVolume(0.5)
	},

	stop({p, tracker, huxels, time, particles, debugOptions}) {
		SOUND.beeAmbience.stop()
		SOUND.beeLoop.stop()
		SOUND.beePollinateLoop.stop()
		SOUND.beePollinateEnd.stop()
		SOUND.beeDropOff0.stop()
		SOUND.beeDropOff1.stop()
		SOUND.beeDropOff2.stop()
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		let beeActive = false
		let isPollinating = false
		tracker.hands.forEach((hand, index) => {
			if (hand.isActive) {
				beeActive = true
				let position = this.getScreenPosition(hand.center)
				let foundFlower = false
				for (let index2 = 0; index2 < tracker.faces.length; index2++) {
					let face = tracker.faces[index2]
					if (face.isActive && Vector2D.distance(position, this.getScreenPosition(face.nose)) < 160) {
						let nectar = Math.min(time.dt, 500 - this.bees[index], this.flowers[index2][index])
						this.bees[index] += nectar
						this.flowers[index2][index] -= nectar
						foundFlower = true
						if (nectar > 0) {
							isPollinating = true
							if (Math.min(500 - this.bees[index], this.flowers[index2][index]) <= 0) {
								SOUND.beePollinateEnd.play()
								SOUND.beePollinateEnd.setVolume(0.5)
							}
						}
						break
					}
				}
				if (!foundFlower && this.bees[index] > 0) {
					this.hives.forEach(hive => {
						if (position.x >= hive && position.x <= hive + this.hiveRect.width && position.y >= this.hiveRect.y && position.y <= this.hiveRect.y + this.hiveRect.height) {
							if (this.bees[index] >= time.dt) {
								app.score.value += time.dt
								this.bees[index] -= time.dt
							} else {
								app.score.value += this.bees[index]
								this.bees[index] = 0
							}
							if (this.bees[index] <= 0) {
								switch (Math.floor(Math.random() * 3)) {
									case 0:
										SOUND.beeDropOff0.play()
										SOUND.beeDropOff0.setVolume(0.5)
										break
									case 1:
										SOUND.beeDropOff1.play()
										SOUND.beeDropOff1.setVolume(0.5)
										break
									case 2:
										SOUND.beeDropOff2.play()
										SOUND.beeDropOff2.setVolume(0.5)
										break
									default:
										break
								}
							}
						}
					})
				}
			}
		})
		if (beeActive && !SOUND.beeLoop.isLooping()) {
			SOUND.beeLoop.loop()
		} else if (!beeActive) {
			SOUND.beeLoop.stop()
		}
		if (isPollinating && !SOUND.beePollinateLoop.isLooping()) {
			SOUND.beePollinateLoop.loop()
			SOUND.beePollinateLoop.setVolume(0.5)
		} else if (!isPollinating) {
			SOUND.beePollinateLoop.stop()
		}
		if (!SOUND.beeAmbience.isPlaying()) {
			debugOptions.mode = "tetris"
		}
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.image(IMAGE.beeClouds, 0, 0, p.width, p.height)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.imageMode(p.CENTER)
		p.image(IMAGE.beeSun, 480, 240)
		p.tint(48, 100, 50)
		p.image(tracker.faces[0].thumbnail, 480, 230, 240, 240)
		p.noTint()
		p.imageMode(p.CORNER)
		p.image(IMAGE.beeFront, 0, 0, p.width, p.height)
		p.imageMode(p.CENTER)
		tracker.faces.forEach((face, index) => {
			if (face.isActive) {
				let position = this.getScreenPosition(face.nose)
				p.fill(83.48, 42.59, 57.65)
				p.noStroke()
				p.triangle(...position, position.x - 32, p.height, position.x + 32, p.height)
				p.image(IMAGE.leaf, position.x - 50, position.y + (p.height - position.y) * 0.4, 100, 42)
				p.image(IMAGE.leaf, position.x + 50, position.y + (p.height - position.y) * 0.5, 100, 42)
				switch (index % 3) {
					case 0:
						p.image(IMAGE.beeFlowerBlue, ...position)
						break
					case 1:
						p.image(IMAGE.beeFlowerOrange, ...position)
						break
					case 2:
						p.image(IMAGE.beeFlowerRed, ...position)
						break
					default:
						break
				}
				p.image(face.thumbnail, ...position, 96, 96)
			}
		})
		tracker.hands.forEach((hand, index) => {
			if (hand.isActive) {
				let position = this.getScreenPosition(hand.center)
				p.image(IMAGE.bee, ...position)
			}
		})
		p.imageMode(p.CORNER)
	},

	getScreenPosition(position) {
		return new Vector2D(position.x * 3, position.y * 2.25)
	},
}
