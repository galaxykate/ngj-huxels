/**
 *
 **/

class Timer {
	constructor(time, callback, loop = false, running = true) {
		this.time = 0;
		this.endTime = time;
		this.loop = loop;
		this.running = running;
		this.callback = callback;
	}

	start() {
		this.running = true;
	}

	stop() {
		this.running = false;
	}

	reset() {
		this.time = 0;
		this.start();
	}

	update(deltaTime) {
		if (this.running) {
			this.time += deltaTime;
			if (this.time >= this.endTime) {
				if (this.loop) {
					this.reset();
				} else {
					this.stop();
				}
				this.callback(this);
			}
		}
	}
}



MODES.tetris = {
	state: {
		rows: 20,
		cols: 10,
		board: [],
		updateTimer: new Timer(500, (timer) => {
			this.updateActive()
		}, true),
		active: {
			x: 0,
			y: 0,
			shape: [],
			translate(x, y) {
				this.x += x;
				this.y += y;
			},
			isDown: () => this.shape.some((row, i) => {
				row.some((cell, j) => cell && MODES.tetris.state.board[this.y + i - 1][this.x + j])
			})
		}
	},

	setupBoard() {
		let {rows, cols} = this.state
		this.state.board = [...new Array(rows).keys()].map(() => [...new Array(cols).keys()].map(() => false))
	},

	start({}) {
		if (this.state.board.length === 0) {
			this.setupBoard()
		}
	},

	stop({}) {

	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		if (Math.random() > .9) {
			let x = randInt(0, this.state.cols - 1)
			let y = randInt(0, this.state.rows - 1)
			huxels.push(new Huxel(x, y))
			this.state.board[y][x] = true;
		}
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(50, 100, 90)
	},

	draw(app) {
		let {p, tracker, huxels, time, particles, debugOptions} = app;
		// p.fill(300, 80, 50)
		p.circle(0, 0, 500)

		tracker.drawCapture(p, 0, 0, 1.5);
		this.drawGameArea(app, {x: 500, y: 0, w: 350, h: 700})
	},

	drawGameArea({p, tracker, huxels, time, particles, debugOptions}, {x, y, w, h}) {
		p.push();
		p.translate(x, y);
		p.fill(0, 0, 0);
		p.rect(0, 0, w, h);
		huxelSize = [w / this.state.cols, h / this.state.rows];

		this.state.board.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell) {
					p.fill(0, 0, 100)
					p.rect(j * huxelSize[0], i * huxelSize[1], ...huxelSize);
				}
			})
		})
		p.pop()
	}
}