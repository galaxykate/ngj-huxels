/**
 * Assets go here
 *
 **/

let COLOR = {

	monsterCyan: [200, 100, 60]
}

let IMAGE_ASSET_FILES = {
	"deer": "clipart2598461.png",
	"tetrisBackground": "BG_tetris.png",
    //
    "bird_head": "bird_head.png",
    "bird_body": "bird_body.png",
    "leaf": "leaf.png",
    "jungle_bg": "jungle_background.png",
    "laser": "02_laser_impact.png",
    "musical_note1": "musical_note1.png",
    "musical_note2": "musical_note2.png"
}

let SOUND_ASSET_FILES = {
	// Tetris sounds
	"tetris1": "MUS_Tetris_Level1.wav",
	"tetris2": "MUS_Tetris_Level2.wav",
	"tetris3": "MUS_Tetris_Level3.wav",
	"tetris4": "MUS_Tetris_Level4.wav",
	"tetris5": "MUS_Tetris_Level5.wav",
	"tetris6": "MUS_Tetris_Level6.wav",
	"tetris7": "MUS_Tetris_Level7.wav",
	"tetris8": "MUS_Tetris_Level8.wav",
	"tetris9": "MUS_Tetris_Level9.wav",
	"tetrisLineCleared0": "S_Tetris_LineCleared0.wav",
	"tetrisLineCleared1": "S_Tetris_LineCleared1.wav",
	"tetrisLineCleared2": "S_Tetris_LineCleared2.wav",
	"tetrisBlockCreated0": "S_Tetris_BlockCreated0.wav",
	"tetrisBlockCreated1": "S_Tetris_BlockCreated1.wav",
	"tetrisBlockCreated2": "S_Tetris_BlockCreated2.wav",
	"tetrisBlockPlaced0": "S_Tetris_BlockPlaced0.wav",
	"tetrisBlockPlaced1": "S_Tetris_BlockPlaced1.wav",
	"tetrisBlockPlaced2": "S_Tetris_BlockPlaced2.wav",

	// Stick and Bird sounds
	"birdLaser0": "S_LaserBird_Laser0.wav",
	"birdLaser1": "S_LaserBird_Laser1.wav",
	"birdLaser2": "S_LaserBird_Laser2.wav",
    "stick_dance": "S_Stick_DanceLoop.wav",

	// Bee sounds
    "beeAmbience": "S_Bee_Ambience.wav",
	"beeLoop": "S_Bee_BeeLoop.wav",
	"beePollinateLoop": "S_Bee_PolinateLoop.wav",
	"beePollinateEnd": "S_Bee_PolinateFinished.wav",
	"beeDropOff0": "S_Bee_DropOff0.wav",
	"beeDropOff1": "S_Bee_DropOff1.wav",
	"beeDropOff2": "S_Bee_DropOff2.wav",

	// Monster Sounds
	"monsterAmbience": "S_Monster_Ambience.wav",
	"monsterGrab0": "S_Monster_Grab0.wav",
	"monsterGrab1": "S_Monster_Grab1.wav",
	"monsterGrab2": "S_Monster_Grab2.wav",
	"monsterGrab3": "S_Monster_Grab3.wav",
	"monsterGulp0": "S_Monster_Gulp0.wav",
	"monsterGulp1": "S_Monster_Gulp1.wav",
	"monsterGulp2": "S_Monster_Gulp2.wav",
	"monsterGulp3": "S_Monster_Gulp3.wav",
	"monsterGulp4": "S_Monster_Gulp4.wav",
	"monsterGulp5": "S_Monster_Gulp5.wav",


}

let IMAGE = {}
let SOUND = {}

function loadImageAssets(p) {
	Object.keys(IMAGE_ASSET_FILES).forEach(key => {
		IMAGE[key] = p.loadImage("ImageAssets/" + IMAGE_ASSET_FILES[key])
	})
}

function loadSoundAssets(p) {
	Object.keys(SOUND_ASSET_FILES).forEach(key => {
		SOUND[key] = p.loadSound("SoundAssets/" + SOUND_ASSET_FILES[key])
	})
}