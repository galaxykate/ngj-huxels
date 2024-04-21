/**
 * 
 **/

let previousKeypoints = [];

let isLooking = false;
let isMoving = false;
let danceMusicPlaying = false;

let lookTimer = 0;
const lookDuration = 3000;
let lastDanceTime = 0; // Timestamp of when the last dance happened
const danceCooldown = 1000; // Cooldown period in milliseconds
let score = 0;

MODES.stickfigure = {
	start({ p }) {
		
	},

	stop({ }) {
		SOUND.stick_dance.stop();
	},

	update({ p, tracker, huxels, time, particles, debugOptions }) {
		if (Math.random() > .9) {
			let x = randInt(0, 10)
			let y = randInt(0, 10)
			huxels.push(new Huxel(x, y))
		}

	},

	drawBackground({ p, tracker, huxels, time, particles, debugOptions }) {
		p.image(IMAGE.jungle_bg, 0, 0, p.width, p.height);
	},

	draw({ p, tracker, huxels, time, particles, debugOptions }) {
		// Game master logic
		checkGameMasterState(time);

		// Draw game elements
		drawGameMaster(p);
		drawPlayer(p, tracker);
	  
		// Game logic
		if (isLooking) {
		  if (isMoving) {
			// Player loses or gets penalized
			p.fill(0, 100, 50);
			p.ellipse(100, 100, 100, 100)
		  }
		} else {
		  if (isMoving) {
			// Player gains points
			p.fill(320, 100, 50);
			p.ellipse(100, 100, 300, 300)
		  }
		}
	},
}

function checkGameMasterState(time) {
	// Logic to randomly determine if the game master is looking
    lookTimer += time.dt;
    if (lookTimer > lookDuration) {
      // Toggle isLooking state and reset timer
      isLooking = !isLooking;
      lookTimer = 0;
	}
  }

  function drawGameMaster(p) {
	let bird_loc_x = 80
	let bird_loc_y = 20

	// Draw the game master on the canvas
	// TODO: SCALE the head!!
	if (isLooking){	
		p.image(IMAGE.bird_head, p.width - 2 * bird_loc_x - IMAGE.bird_head.width, bird_loc_y);
	} else {
		p.push();
		p.scale(-1, 1);
		p.image(IMAGE.bird_head, -p.width + bird_loc_x, bird_loc_y);
		p.pop();
	}
  }
  
  function drawPlayer(p, tracker) {
	// Use pose data to draw the player on the canvas
	tracker.poses.forEach((pose) => {
		if (pose.isActive) {
			p.fill(41, 42, 50);
			p.noStroke()

			let nose = pose.landmarks[0]

			let shoulder_left = pose.landmarks[11]
			let shoulder_right = pose.landmarks[12]
			let shoulder_center = new Vector2D((shoulder_left.x + shoulder_right.x) / 2, (shoulder_left.y + shoulder_right.y) / 2);

			let elbow_left = pose.landmarks[13]
			let elbow_right = pose.landmarks[14]

			let hip_left = pose.landmarks[23]
			let hip_right = pose.landmarks[24]
			let hip_center = new Vector2D((hip_left.x + hip_right.x) / 2, (hip_left.y + hip_right.y) / 2);

			//console.log(hip_center)

			let knee_left = pose.landmarks[25]
			let knee_right = pose.landmarks[26]

			let hand_left = pose.landmarks[19]
			let hand_right = pose.landmarks[20]

			let foot_left = pose.landmarks[29]
			let foot_right = pose.landmarks[30]

			// Drawing arms
			drawTrapezoid(p, shoulder_center, elbow_left, 30, 20);
			drawTrapezoid(p, elbow_left, hand_left, 20, 30);
			drawTrapezoid(p, shoulder_center, elbow_right, 30, 20);
			drawTrapezoid(p, elbow_right, hand_right, 20, 30);

			// Drawing legs
			drawTrapezoid(p, hip_center, knee_left, 30, 20);
			drawTrapezoid(p, knee_left, foot_left, 20, 30);
			drawTrapezoid(p, hip_center, knee_right, 30, 20);
			drawTrapezoid(p, knee_right, foot_right, 20, 30);

			// Drawing torso
			drawTrapezoid(p, shoulder_center, hip_center, 40, 30);

			let head_top = new Vector2D(2 * nose.x - shoulder_center.x, 2 * nose.y - shoulder_center.y)

			// Drawing face
			drawTrapezoid(p, shoulder_center, head_top, 40, 60);

			let PI = 3.14159
			let leaves = 3; // Number of leaves to draw
			let angleBetweenLeaves = PI / leaves; // Angle between each leaf
			
			for (let i = 0; i < leaves; i++) {
				p.push(); // Save the current drawing state
				p.translate(head_top.x, head_top.y); // Move the origin to head_top
				p.rotate(PI + angleBetweenLeaves * i); // Rotate by the angle between leaves times the iterator
				p.image(IMAGE.leaf, 10.5, -10.5, 100, 42); // Draw the leaf image offset from the head_top
				p.pop(); // Restore the original drawing state
			}

			p.strokeWeight(5)
			p.stroke(0, 0, 100);

			leaves = 2; // Number of leaves to draw
			angleBetweenLeaves = PI / leaves; // Angle between each leaf

			for (let i = 0; i < leaves; i++) {
				p.push(); // Save the current drawing state
				p.translate(hand_left.x, hand_left.y); // Move the origin to head_top
				p.rotate(PI + angleBetweenLeaves * i); // Rotate by the angle between leaves times the iterator
				p.image(IMAGE.leaf, 10.5, -10.5, 100, 42); // Draw the leaf image offset from the head_top
				p.pop(); // Restore the original drawing state
			}

			for (let i = 0; i < leaves; i++) {
				p.push(); // Save the current drawing state
				p.translate(hand_right.x, hand_right.y); // Move the origin to head_top
				p.rotate(PI * 1.5 + angleBetweenLeaves * i); // Rotate by the angle between leaves times the iterator
				p.image(IMAGE.leaf, 10.5, -10.5, 100, 42); // Draw the leaf image offset from the head_top
				p.pop(); // Restore the original drawing state
			}

			hand_left.draw(p, 50)
			hand_right.draw(p, 50)



			foot_left.draw(p, 50)
			foot_right.draw(p, 50)

			let currentKeypoints = pose.landmarks;

			if (previousKeypoints.length > 0) {
				let movementLevel = calculateMovement(p, previousKeypoints, currentKeypoints);
				console.log(movementLevel)

				// Check the cooldown before playing the music
				let timeNow = p.millis();
				if (movementLevel > 200 && !danceMusicPlaying && timeNow - lastDanceTime > danceCooldown) {
				  SOUND.stick_dance.play();
				  danceMusicPlaying = true;
				} else if (movementLevel <= 200 && danceMusicPlaying) {
				  SOUND.stick_dance.pause();
				  danceMusicPlaying = false;
				  lastDanceTime = timeNow; // Update the timestamp of the last dance
				}

				if (movementLevel > 200 && movementLevel < 600 && !isLooking) {
					// REWARD!!
					isMoving = true;
					drawMusicalNotes(p, 3);
				} else if (movementLevel > 600 && isLooking) {
					// PUNISHMENT!!
					isMoving = true;
					drawMusicalNotes(p, 9);
				} else {
					isMoving = false;
				}
			}

			previousKeypoints = currentKeypoints.map(kp => {
				return { ...kp };
			});
		}
	});
  }

  function drawMusicalNotes(p, num) {
	// Decide how many notes to draw
	let numberOfNotes = num; // For example, draw 10 notes

	for (let i = 0; i < numberOfNotes; i++) {
	  // Randomly select one of the two images
	  let noteImage = [IMAGE.musical_note1, IMAGE.musical_note2];

	  // Define a "center zone" range around the middle of the canvas
	  let centerX = p.width / 2;
	  let centerY = p.height / 2;
	  let rangeX = p.width * 0.3; // 20% of the canvas width
	  let rangeY = p.height * 0.3; // 20% of the canvas height
  
	  // Random x and y positions within the "center zone"
	  let x = centerX + p.random(-rangeX, rangeX);
	  let y = centerY + p.random(-rangeY, rangeY);

	  let randomNum = getRandomInt(2);
	  
	  // Draw the note image at the calculated position
	  p.image(noteImage[randomNum], x, y, 24, 36);
	}
  }

  function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }

function drawTrapezoid(p, topCenter, bottomCenter, topWidth, bottomWidth) {
	// Calculate the corners of the trapezoid
	let topLeft = new Vector2D(topCenter.x - topWidth / 2, topCenter.y);
	let topRight = new Vector2D(topCenter.x + topWidth / 2, topCenter.y);
	let bottomLeft = new Vector2D(bottomCenter.x - bottomWidth / 2, bottomCenter.y);
	let bottomRight = new Vector2D(bottomCenter.x + bottomWidth / 2, bottomCenter.y);

	// Begin a new shape
	p.beginShape();
	p.vertex(topLeft, topLeft.y);
	p.vertex(topRight.x, topRight.y);
	p.vertex(bottomRight.x, bottomRight.y);
	p.vertex(bottomLeft.x, bottomLeft.y);
	p.vertex(topLeft.x, topLeft.y);
	p.endShape(p.CLOSE);

	p.ellipse(topCenter.x, topCenter.y, topWidth, topWidth)
	p.ellipse(bottomCenter.x, bottomCenter.y, bottomWidth, bottomWidth)
}

function calculateMovement(p, previousKeypoints, currentKeypoints) {
	let movement = 0;
	for (let i = 0; i < currentKeypoints.length; i++) {
		let prevKeypoint = previousKeypoints[i];
		let currentKeypoint = currentKeypoints[i];

		let distance = p.dist(prevKeypoint.x, prevKeypoint.y, currentKeypoint.x, currentKeypoint.y);
		movement += distance;
	}
	return movement;
}