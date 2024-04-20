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

const BLOCK = {
	blueFill: [203, 49, 92],
	blueBorder: [200, 49, 66],
	weight: 6,
	rounding: 5,

	draw(p, x, y, w, h) {
		p.push();
		p.fill(...this.blueFill);
		p.stroke(...this.blueBorder);
		p.strokeWeight(this.weight);
		halfWeight = this.weight / 2;
		p.rect(x + halfWeight, y + halfWeight, w - this.weight, h - this.weight, this.rounding);
		p.pop();
	}
}

MODES.tetris = {
	state: {
		rows: 20,
		cols: 10,
		board: [],
		updateTimer: new Timer(500, (timer) => {
			MODES.tetris.state.active.update();
		}, true),
		active: null
	},

	newActive() {
		const that = this;
		this.state.active = {
			x: 0,
			y: that.state.rows,
			shape: that.getShape(),
			rows() {
				// Just because of rendering (Only used there)
				return this.shape.length - 1;
			},
			translate(x, y) {
				this.x += x;
				this.y += y;
			},
			isDown() {
				return this.shape.some((row, i) => {
					y = this.y + i;
					return y < 1 || row.some((cell, j) => cell && y < that.state.rows && that.state.board[y - 1][this.x + j]);
				});
			},
			update() {
				this.translate(0, -1);
				if (this.isDown()) {
					this.shape.forEach((row, i) => {
						row.forEach((cell, j) => {
							if (cell) {
								// This is where it crashes on loss.. So fix this later
								that.state.board[this.y + i][this.x + j] = true;
							}
						})
					});
					that.newActive();
				}
			}
		}
	},

	getShape() {
		const shape = [];
		const cols = this.state.cols;
		const rows = 4;
		const trueCount = 4;

		for (let i = 0; i < rows; i++) {
			const row = Array(cols).fill(false);
			shape.push(row);
		}

		let count = 0;
		while (count < trueCount) {
			const randomRow = Math.floor(Math.random() * rows);
			const randomCol = Math.floor(Math.random() * cols);

			if (!shape[randomRow][randomCol]) {
				shape[randomRow][randomCol] = true;
				count++;
			}
		}

		while (!shape[0].some((cell) => cell)) {
			shape.push(shape.shift());
		}

		return shape;
	},

	setupBoard() {
		let {rows, cols} = this.state
		this.state.board = [...new Array(rows).keys()].map(() => [...new Array(cols).keys()].map(() => false))
	},

	start({p}) {
		if (this.state.board.length === 0) {
			this.setupBoard();
		}
		if (!this.state.active) {
			this.newActive();
		}
	},

	stop({}) {

	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		this.state.updateTimer.update(time.dt);

		// if (Math.random() > .9) {
		// 	let x = randInt(0, this.state.cols - 1)
		// 	let y = randInt(0, this.state.rows - 1)
		// 	huxels.push(new Huxel(x, y))
		// 	this.state.board[y][x] = true;
		// }
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(50, 100, 90)
	},

	draw(app) {
		let {p, tracker, huxels, time, particles, debugOptions} = app;
		// p.fill(300, 80, 50)
		p.circle(0, 0, 500)

		tracker.drawCapture(p, 0, 0, tracker.scale);
		this.drawGameArea(app, {x: 700, y: 0, w: 350, h: 700})
	},

	drawGameArea({p, tracker, huxels, time, particles, debugOptions}, {x, y, w, h}) {
		p.push();
		p.translate(x, y);
		p.fill(0, 0, 0);
		p.rect(0, 0, w, h);
		const huxelSize = [w / this.state.cols, h / this.state.rows];
		const rows = this.state.rows - 1;
		//const cols = this.state.cols;

		p.push();
		this.state.board.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell) {
					BLOCK.draw(p, j * huxelSize[0], (rows - i) * huxelSize[1], ...huxelSize);
					// p.fill(0, 0, 100)
					// p.rect(j * huxelSize[0], (rows - i) * huxelSize[1], ...huxelSize);
				}
			})
		})
		p.pop();
		const active = this.state.active;
		p.push();
		p.translate(active.x * huxelSize[0], (rows - active.rows() - active.y) * huxelSize[1]);
		active.shape.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell && i + active.y >= 0 && j + active.x >= 0 && i + active.y < this.state.rows && j + active.x < this.state.cols) {
					BLOCK.draw(p, j * huxelSize[0], (active.rows() - i) * huxelSize[1], ...huxelSize);
					// p.fill(139, 100, 100)
					// p.rect(j * huxelSize[0], (active.rows() - i) * huxelSize[1], ...huxelSize);
				}
			})
		})
		p.pop();
		p.pop();
	}
}