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

const RED = 1;
const BLUE = 2;
const BLOCK = {
	blueFill: [203, 49, 92],
	blueBorder: [200, 49, 66],
	redFill: [17, 46, 85],
	redBorder: [5, 47, 73],
	weight: 6,
	rounding: 5,

	draw(p, x, y, w, h, color) {
		p.push();
		if (color === RED) {
			p.fill(...this.redFill);
			p.stroke(...this.redBorder);
		} else {
			p.fill(...this.blueFill);
			p.stroke(...this.blueBorder);
		}
		p.strokeWeight(this.weight);
		halfWeight = this.weight / 2;
		p.rect(x + halfWeight, y + halfWeight, w - this.weight, h - this.weight, this.rounding);
		p.pop();
	}
}

MODES.tetris = {
	options: {
		rows: 20,
		cols: 5,
		inputRows: 4,
		inputCols: 5
	},
	state: {
		board: [],
		updateTimer: new Timer(150, (timer) => {
			MODES.tetris.state.active.update();
		}, true),
		active: null,
		playerInput: null,
		score: 0
	},

	newActive() {
		const that = this;
		this.state.active = {
			x: 0,
			y: that.options.rows,
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
					return y < 1 || row.some((cell, j) => cell && y < that.options.rows && that.state.board[y - 1][this.x + j]);
				}) || !this.shape.some((row, i) => row.some((cell, j) => cell));
			},
			update() {
				this.translate(0, -1);
				if (this.isDown()) {
					this.shape.forEach((row, i) => {
						row.forEach((cell, j) => {
							if (cell) {
								// This is where it crashes on loss.. So fix this later
								that.state.board[this.y + i][this.x + j] = cell;
							}
						})
					});
					const rowsToDelete = that.state.board.map((row, i) => row.every((cell) => cell) ? i : false).filter((i) => i !== false);
					that.state.score += rowsToDelete.length;
					rowsToDelete.forEach((i) => {
						that.state.board.splice(i, 1);
						that.state.board.push(Array(that.options.cols).fill(false));
					});
					that.newActive();
				}
			}
		}
	},

	generatePlayerShape() {
		const shape = [];
		const cols = this.options.inputCols;
		const rows = this.options.inputRows;

		for (let i = 0; i < rows; i++) {
			const row = Array(cols).fill(false);
			shape.push(row);
		}

		return shape;
	},

	getShape() {
		//const shape = this.generatePlayerShape();
		//const cols = this.options.inputCols;
		//const rows = this.options.inputRows;
		//const trueCount = 4;

		// let count = 0;
		// while (count < trueCount) {
		// 	const randomRow = Math.floor(Math.random() * rows);
		// 	const randomCol = Math.floor(Math.random() * cols);

		// 	if (!shape[randomRow][randomCol]) {
		// 		shape[randomRow][randomCol] = true;
		// 		count++;
		// 	}
		// }

		const shape = JSON.parse(JSON.stringify(this.state.playerInput));

		let count = 0;
		while (!shape[0].some((cell) => cell) && count < 4) {
			shape.push(shape.shift());
			count++;
		}

		return shape;
	},

	setupBoard() {
		let {rows, cols} = this.options
		this.state.board = [...new Array(rows).keys()].map(() => [...new Array(cols).keys()].map(() => false))
	},

	setupPlayerInput() {
		this.state.playerInput = this.generatePlayerShape();
	},

	start({p}) {
		if (this.state.board.length === 0) {
			this.setupBoard();
		}
		if (!this.state.playerInput) {
			this.setupPlayerInput();
		}
		if (!this.state.active) {
			this.newActive();
		}
	},

	stop({}) {

	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		this.state.updateTimer.update(time.dt);
		this.updatePlayerInput({p, tracker, huxels, time, particles, debugOptions});
	},

	updatePlayerInput({p, tracker, huxels, time, particles, debugOptions}) {
		const cols = this.options.inputCols;
		const rows = this.options.inputRows;
		const huxelSize = [(tracker.captureDim[0] * tracker.scale) / cols, (tracker.captureDim[1] * tracker.scale) / rows];

		this.state.playerInput = this.generatePlayerShape();

		tracker.hands.forEach((hand) => {
			if (!hand.isActive) return;
			const x = Math.floor(hand.center.x / huxelSize[0]);
			const y = rows - 1 - Math.floor(hand.center.y / huxelSize[1]);
			// console.log(x, y);

			if (x >= 0 && x < cols && y >= 0 && y < rows) {
				//console.log("Matched:", x, y);
				this.state.playerInput[y][x] = hand.tetrisColor;
			}
		})

		//console.log(this.state.playerInput);
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(50, 100, 90)
	},

	draw(app) {
		let {p, tracker, huxels, time, particles, debugOptions} = app;
		// p.fill(300, 80, 50)
		p.circle(0, 0, 500)

		this.drawControlGrid(app, {x: 0, y: 0, w: 700, h: 700})
		this.drawGameArea(app, {x: 700, y: 0, w: 350, h: 700})
		this.drawDebug(app);
	},

	drawDebug({p, tracker, huxels, time, particles, debugOptions}) {
		p.push();
		p.translate(0, 0);
		// p.scale(tracker.scale, tracker.scale);
		tracker.hands.forEach((hand) => {
			if (!hand.isActive) return;
			if (!hand.tetrisColor) {
				hand.tetrisColor = Math.random() > 0.5 ? RED : BLUE;
			}
			p.push();
			p.fill(139, 100, 100);
			p.circle(hand.center.x, hand.center.y, 10);
			p.pop();
		});
		p.pop();
	},

	drawControlGrid({p, tracker, huxels, time, particles, debugOptions}, {x, y}) {
		p.push();
		p.translate(x, y);
		p.scale(tracker.scale, tracker.scale);
		tracker.drawCapture(p);
		const huxelSize = [tracker.captureDim[0] / this.options.inputCols, tracker.captureDim[1] / this.options.inputRows];

		const rows = this.options.inputRows - 1;
		p.push();
		p.stroke(0, 0, 0);
		this.state.playerInput.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell === RED) {
					p.fill(...BLOCK.redBorder, 0.8);
				} else if (cell === BLUE) {
					p.fill(...BLOCK.blueBorder, 0.8);
				} else {
					p.fill(0, 0, 100, 0.1);
				}
				p.rect(j * huxelSize[0], (rows - i)* huxelSize[1], ...huxelSize);
			})
		})
		p.pop();

		p.pop();
	},

	drawGameArea({p, tracker, huxels, time, particles, debugOptions}, {x, y, w, h}) {
		p.push();
		p.translate(x, y);
		p.fill(0, 0, 0);
		p.rect(0, 0, w, h);
		const huxelSize = [w / this.options.cols, h / this.options.rows];
		const rows = this.options.rows - 1;
		//const cols = this.state.cols;

		p.push();
		this.state.board.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell) {
					BLOCK.draw(p, j * huxelSize[0], (rows - i) * huxelSize[1], ...huxelSize, cell);
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
				if (cell && i + active.y >= 0 && j + active.x >= 0 && i + active.y < this.options.rows && j + active.x < this.options.cols) {
					BLOCK.draw(p, j * huxelSize[0], (active.rows() - i) * huxelSize[1], ...huxelSize, cell);
					// p.fill(139, 100, 100)
					// p.rect(j * huxelSize[0], (active.rows() - i) * huxelSize[1], ...huxelSize);
				}
			})
		})
		p.pop();
		p.pop();
	}
}