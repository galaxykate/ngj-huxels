MODES.bee = {
	bees: [],
	flowers: [],
	hives: [
		{
			x: 0,
			color: [0, 100, 50],
			pollen: 0
		},
		{
			x: 512,
			color: [180, 100, 50],
			pollen: 0
		}
	],
	hiveRect: {y: 0, width: 128, height: 256},

	start({p, tracker, huxels, time, particles, debugOptions}) {
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
		SOUND.beeAmbience.loop()
		SOUND.beeAmbience.setVolume(0.1)
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
				let position = hand.center
				let foundFlower = false
				for (let index2 = 0; index2 < tracker.faces.length; index2++) {
					let face = tracker.faces[index2]
					if (face.isActive && Vector2D.distance(position, face.nose) < 64) {
						let pollen = Math.min(time.dt, 500 - this.bees[index], this.flowers[index2][index])
						this.bees[index] += pollen
						this.flowers[index2][index] -= pollen
						foundFlower = true
						if (pollen > 0) {
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
						if (position.x >= hive.x && position.x <= hive.x + this.hiveRect.width && position.y >= this.hiveRect.y && position.y <= this.hiveRect.y + this.hiveRect.height) {
							if (this.bees[index] >= time.dt) {
								hive.pollen += time.dt
								this.bees[index] -= time.dt
							} else {
								hive.pollen += this.bees[index]
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
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.textSize(64)
		this.hives.forEach(hive => {
			p.fill(...hive.color)
			p.rect(hive.x, this.hiveRect.y, this.hiveRect.width, this.hiveRect.height)
		})
		p.fill(0, 0, 0)
		tracker.faces.forEach(face => {
			if (face.isActive) {
				p.text("🌻", ...face.nose)
			}
		})
		tracker.hands.forEach((hand, index) => {
			if (hand.isActive) {
				p.text("🐝", ...hand.center)
				p.text(this.bees[index], ...hand.center)
			}
		})
		this.hives.forEach(hive => {
			p.text(hive.pollen, hive.x, this.hiveRect.y + 64)
		})
	},
}
