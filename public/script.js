import * as THREE from './libs/three.js/build/three.module.js';
import { OrbitControls } from './libs/three.js/examples/jsm/controls/OrbitControls.js';
import { DragControls } from './libs/three.js/examples/jsm/controls/DragControls.js';
import { EffectComposer } from './libs/three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './libs/three.js/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './libs/three.js/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './libs/three.js/examples/jsm/shaders/FXAAShader.js';
import {Vector2, Vector3} from "./libs/three.js/build/three.module.js";
import { FBXLoader } from "./libs/three.js/examples/jsm/loaders/FBXLoader.js";
import { Player } from "./Player.js";
import { Monster } from "./Monster.js";

/// VARIABLES ///
let camera, scene, renderer, orbitControls, mouse, raycaster;
let realeaseTimer = null;
let blueSummonedMonsters = new THREE.Group();
let redSummonedMonsters = new THREE.Group();
let ground = new THREE.Group();
let lastIdTile = 0;
let bluePathTiles = new THREE.Group();
let redPathTiles = new THREE.Group();
let movingPath = null;
let selectedMonster1 = null,
selectedMonster2 = null;
const MONSTER_LIST = {
	1: {
		name : 'Time wizard',
		modelFilename : 'timeMagician.fbx',
		scale: 0.0002,
		iconFilename : 'timeMagicianIcon.png',
		effectCost : 0,
		costType: '',
		effectDesc: 'When this monster is summoned, you can destroy the monster in the dungeon with the lowest Attack Power.<br/>'+
		'If there are 2 or more monsters with the same Attack Power points, you have to choose one as a target.',
		type : 'Dark',
		movement : null,
		level : 1,
		hp : 10,
		atk : 0,
		def : 10
	},
	2: {
		name : 'Dark Magician Girl',
		modelFilename : 'source/DarkMagicianGirl.fbx',
		scale: 0.02,
		iconFilename : 'ryuRanIcon.png',
		effectCost : 2,
		costType: '',
		effectDesc: 'Add one Magic Crest to your Crest Counter',
		type : 'Dark',
		movement : null,
		level : 2,
		hp : 20,
		atk : 20,
		def : 20
	},
	3: {
		name : 'Cursed dragon',
		modelFilename : 'cursedDragon.fbx',
		scale: 0.01,
		iconFilename : 'CursedDragonIcon.png',
		effectCost : null,
		costType: null,
		effectDesc: null,
		type : 'Dragon',
		movement : 'Flying',
		level : 3,
		hp : 20,
		atk : 20,
		def : 20
	},
	4: {
		name : 'Summoned Skull',
		modelFilename : 'summonedSkull.fbx',
		scale: 0.0006,
		iconFilename : 'SummonedSkulIconl.png',
		effectCost : null,
		costType: null,
		effectDesc: null,
		type : 'Dark',
		movement : null,
		level : 4,
		hp : 40,
		atk : 40,
		def : 20
	}
};

const player = new Player('Yugi Muto', true, 'Blue', 3, 0, 0, 0, 0, 0),
opponent = new Player('Duke Devlin', false, 'Red', 3, 0, 0, 0, 0, 0);
player.monsters = [
	new Monster(MONSTER_LIST[1].name, player , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, player , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, player , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[2].name, player , MONSTER_LIST[2].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[2].iconFilename, MONSTER_LIST[2].effectCost, MONSTER_LIST[2].costType,
		MONSTER_LIST[2].effectDesc,	MONSTER_LIST[2].type, MONSTER_LIST[2].movement, MONSTER_LIST[2].level, MONSTER_LIST[2].hp, MONSTER_LIST[2].atk, MONSTER_LIST[2].def),

	new Monster(MONSTER_LIST[2].name, player , MONSTER_LIST[2].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[2].iconFilename, MONSTER_LIST[2].effectCost, MONSTER_LIST[2].costType,
		MONSTER_LIST[2].effectDesc,	MONSTER_LIST[2].type, MONSTER_LIST[2].movement, MONSTER_LIST[2].level, MONSTER_LIST[2].hp, MONSTER_LIST[2].atk, MONSTER_LIST[2].def),

	new Monster(MONSTER_LIST[3].name, player , MONSTER_LIST[3].modelFilename, MONSTER_LIST[3].scale, MONSTER_LIST[3].iconFilename, MONSTER_LIST[3].effectCost, MONSTER_LIST[3].costType,
		MONSTER_LIST[3].effectDesc,	MONSTER_LIST[3].type, MONSTER_LIST[3].movement, MONSTER_LIST[3].level, MONSTER_LIST[3].hp, MONSTER_LIST[3].atk, MONSTER_LIST[3].def),

	new Monster(MONSTER_LIST[4].name, player , MONSTER_LIST[4].modelFilename, MONSTER_LIST[4].scale, MONSTER_LIST[4].iconFilename, MONSTER_LIST[4].effectCost, MONSTER_LIST[4].costType,
		MONSTER_LIST[4].effectDesc,	MONSTER_LIST[4].type, MONSTER_LIST[4].movement, MONSTER_LIST[4].level, MONSTER_LIST[4].hp, MONSTER_LIST[4].atk, MONSTER_LIST[4].def),

	new Monster(MONSTER_LIST[1].name, player , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, player , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, player , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),
];
opponent.monsters = [
	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[2].name, opponent , MONSTER_LIST[2].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[2].iconFilename, MONSTER_LIST[2].effectCost, MONSTER_LIST[2].costType,
		MONSTER_LIST[2].effectDesc,	MONSTER_LIST[2].type, MONSTER_LIST[2].movement, MONSTER_LIST[2].level, MONSTER_LIST[2].hp, MONSTER_LIST[2].atk, MONSTER_LIST[2].def),

	new Monster(MONSTER_LIST[2].name, opponent , MONSTER_LIST[2].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[2].iconFilename, MONSTER_LIST[2].effectCost, MONSTER_LIST[2].costType,
		MONSTER_LIST[2].effectDesc,	MONSTER_LIST[2].type, MONSTER_LIST[2].movement, MONSTER_LIST[2].level, MONSTER_LIST[2].hp, MONSTER_LIST[2].atk, MONSTER_LIST[2].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def),

	new Monster(MONSTER_LIST[1].name, opponent , MONSTER_LIST[1].modelFilename, MONSTER_LIST[1].scale, MONSTER_LIST[1].iconFilename, MONSTER_LIST[1].effectCost, MONSTER_LIST[1].costType,
		MONSTER_LIST[1].effectDesc,	MONSTER_LIST[1].type, MONSTER_LIST[1].movement, MONSTER_LIST[1].level, MONSTER_LIST[1].hp, MONSTER_LIST[1].atk, MONSTER_LIST[1].def)
];
let playerTurn = player, leftDiceThrows = 2, leftSummon = 1, isSummoning = 0;
let blueLinkedPositions = [new Vector3(5,0,18), new Vector3(7,0,18), new Vector3(6,0,17)];
let redLinkedPositions = [new Vector3(5,0,0), new Vector3(7,0,0), new Vector3(6,0,1)];
let lastPathPattern = 0;
let lastPathRotation = 0;
const pathpatterns = [
	[ // a path pattern
		[new Vector3(0,0,0), new Vector3(1,0,0), new Vector3(-1,0,0), new Vector3(0,0,-1), new Vector3(0,0,1), new Vector3(0,0,2)],	// up
		[new Vector3(0,0,0), new Vector3(0,0,1), new Vector3(0,0,-1), new Vector3(-1,0,0), new Vector3(1,0,0), new Vector3(2,0,0)], // left
		[new Vector3(0,0,0), new Vector3(-1,0,0), new Vector3(1,0,0), new Vector3(0,0,1), new Vector3(0,0,-1), new Vector3(0,0,-2)], // down
		[new Vector3(0,0,0), new Vector3(0,0,-1), new Vector3(0,0,1), new Vector3(1,0,0), new Vector3(-1,0,0), new Vector3(-2,0,0)] //right
	],
	[
		[new Vector3(0,0,0), new Vector3(0,0,-1), new Vector3(1,0,-1), new Vector3(-1,0,-1), new Vector3(0,0,1), new Vector3(0,0,2)],
		[new Vector3(0,0,0), new Vector3(-1,0,0), new Vector3(-1,0,1), new Vector3(-1,0,-1), new Vector3(1,0,0), new Vector3(2,0,0)],
		[new Vector3(0,0,0), new Vector3(0,0,1), new Vector3(-1,0,1), new Vector3(1,0,1), new Vector3(0,0,-1), new Vector3(0,0,-2)],
		[new Vector3(0,0,0), new Vector3(1,0,0), new Vector3(1,0,-1), new Vector3(1,0,1), new Vector3(-1,0,0), new Vector3(-2,0,0)]
	],
	[
		[new Vector3(0,0,0), new Vector3(0,0,-1), new Vector3(-1,0,-1), new Vector3(0,0,1), new Vector3(0,0,2), new Vector3(1,0,2)],
		[new Vector3(0,0,0), new Vector3(-1,0,0), new Vector3(-1,0,1), new Vector3(1,0,0), new Vector3(2,0,0), new Vector3(2,0,-1)],
		[new Vector3(0,0,0), new Vector3(0,0,1), new Vector3(1,0,1), new Vector3(0,0,-1), new Vector3(0,0,-2), new Vector3(-1,0,-2)],
		[new Vector3(0,0,0), new Vector3(1,0,0), new Vector3(1,0,-1), new Vector3(-1,0,0), new Vector3(-2,0,0), new Vector3(-2,0,1)]
	]
];
// Dices
const DICE1 = ['summon1-icon.png', 'summon1-icon.png', 'summon1-icon.png', 'summon1-icon.png', 'move-icon.png', 'shield2-icon.png'];
const DICE2 = ['summon2-icon.png', 'summon2-icon.png', 'summon2-icon.png', 'move2-icon.png', 'attack2-icon.png', 'magic2-icon.png'];
const DICE3 = ['summon3-icon.png', 'summon3-icon.png', 'move-icon.png', 'move-icon.png', 'attack-icon.png', 'trap2-icon.png'];
const DICE4 = ['summon4-icon.png', 'move2-icon.png', 'attack-icon.png', 'shield-icon.png', 'magic-icon.png', 'trap-icon.png'];
let blueLastDice = [1,1,1];
let redLastDice = [1,1,1];
// postprocessing
let composer, effectFXAA, outlinePass;
let selectedObjects = [];
let selectedMonsterIcon = null;
// config

// Loaders
const textureLoaderSky = new THREE.TextureLoader();
textureLoaderSky.setPath( 'public/skybox/' );
const textureLoaderOthers = new THREE.TextureLoader();
textureLoaderOthers.setPath( 'public/textures/' );
const model3DFBXLoader = new FBXLoader();
model3DFBXLoader.setPath( 'public/3DModels/' );
// JQuery
const btnAddDie1 = $('#addDie1'),
btnAddDie2 = $('#addDie2'),
btnAddDie3 = $('#addDie3'),
btnAddDie4 = $('#addDie4'),
btnThrowDice = $('#throwDice'),
resDice1 = $('#resDice1'),
resDice2 = $('#resDice2'),
resDice3 = $('#resDice3'),
turnIndicator = $('#turnIndicator'),
monstersSelectionField = $('#monstersField'),
monsterInfos1 = $('#monsterInfos1'),
monsterInfos2 = $('#monsterInfos2');

/// FONCTIONS DE BASE ///
// Lance le programme
init();
animate();

// Initialisation
function init(){
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 3000);
	camera.position.set(6, 3, 23);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x132644);
	renderer.id = 'viewCanvas';
	renderer.shadowMap.enabled = true;

	mouse = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	document.body.appendChild(renderer.domElement);

	// postprocessing
	composer = new EffectComposer( renderer );
	const renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );
	outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
	composer.addPass( outlinePass );
	effectFXAA = new ShaderPass( FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	composer.addPass( effectFXAA );

	// CONTROLES CAMERA
	orbitControls = new OrbitControls( camera, renderer.domElement );
	orbitControls.mouseButtons = {
		LEFT: THREE.MOUSE.ROTATE,
		MIDDLE: THREE.MOUSE.DOLLY,
		RIGHT: THREE.MOUSE.PAN
	}
	
	orbitControls.target.set(6, 0, 9);
	orbitControls.enablePan = true;
	orbitControls.enableDamping = true;
	orbitControls.maxPolarAngle = Math.PI / 2;
	orbitControls.minDistance = 6;
	orbitControls.maxDistance = 30;
	orbitControls.update();

	// ----------------------------------------------
	// Terrain
	buildTerrain();
	scene.add(bluePathTiles);
	scene.add(redPathTiles);
	scene.add(blueSummonedMonsters);
	scene.add(redSummonedMonsters);
	

	// Skybox
	const DayFront = textureLoaderSky.load('Day-front.png');
	const DayLeft = textureLoaderSky.load('Day-left.png');
	const DayRight = textureLoaderSky.load('Day-right.png');
	const DayBack = textureLoaderSky.load('Day-back.png');
	const DayTop = textureLoaderSky.load('Day-top.png');
	const DayBottom = textureLoaderSky.load('Day-bottom.png');
	const skyboxMaterial = [
		new THREE.MeshBasicMaterial({ map: DayRight, side: THREE.BackSide }),	// Right side
		new THREE.MeshBasicMaterial({ map: DayLeft, side: THREE.BackSide }),	// Left side
		new THREE.MeshBasicMaterial({ map: DayTop, side: THREE.BackSide }),	// Top side
		new THREE.MeshBasicMaterial({ map: DayBottom, side: THREE.BackSide }),	// Bottom side
		new THREE.MeshBasicMaterial({ map: DayFront, side: THREE.BackSide }),	// Front side
		new THREE.MeshBasicMaterial({ map: DayBack, side: THREE.BackSide })	// Back side
	];
	const skybox = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), skyboxMaterial);
	scene.add(skybox);

	// Lights
	const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
	scene.add(ambientLight);
	const pointLight = new THREE.PointLight(0xFFFFFF, 0.3, 1000);
	pointLight.position.set(6, 5, 9);
	pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;

	const d = 10;
	pointLight.shadow.camera.left = - d;
	pointLight.shadow.camera.right = d;
	pointLight.shadow.camera.top = d;
	pointLight.shadow.camera.bottom = - d;
	pointLight.shadow.camera.far = 1000;
	scene.add(pointLight);

	refreshMonsterList();
}

// Mises à jour de l'application
function update(){
	orbitControls.update();
}

// Boucle d'animation
function animate(){
	update();

	// Déclenche l'affichage
	//renderer.render(scene, camera);
	composer.render();

	requestAnimationFrame(animate);
}

function buildTerrain(){
	const groundGeometry = new THREE.BoxGeometry(1, 0.2, 1);
	const groundTexture = textureLoaderOthers.load('ground.png');
	//const groundMaterial = new THREE.MeshStandardMaterial({color : '#617085'});
	const groundMaterial = [
		new THREE.MeshBasicMaterial({ color : '#617085' }),	// Right side
		new THREE.MeshBasicMaterial({ color : '#617085' }),	// Left side
		new THREE.MeshBasicMaterial({ map: groundTexture }),	// Top side
		new THREE.MeshBasicMaterial({ color : '#617085' }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : '#617085' }),	// Front side
		new THREE.MeshBasicMaterial({ color : '#617085' })	// Back side
	];

	for(let i=0; i<13;i++){
		for(let j=0; j<19; j++){
			const tile = new THREE.Mesh(groundGeometry, groundMaterial);
			tile.position.x = i;
			tile.position.z = j;
			//tile.receiveShadow = true;
			ground.add(tile);
		}
	}
	scene.add(ground);
	
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
	const blueMaterial = new THREE.MeshStandardMaterial({color : '#3b7fdb'});
	const redMaterial = new THREE.MeshStandardMaterial({color : '#db3b3b'});
	
	const bluePlayerBox = new THREE.Mesh(cubeGeometry, blueMaterial);
	bluePlayerBox.position.set(6, 0.6, 18);
	/*bluePlayerBox.receiveShadow = true;
	bluePlayerBox.castShadow = true;*/
	scene.add(bluePlayerBox);
	const redPlayerBox = new THREE.Mesh(cubeGeometry, redMaterial);
	redPlayerBox.position.set(6, 0.6, 0);
	/*redPlayerBox.receiveShadow = true;
	redPlayerBox.castShadow = true;*/
	scene.add(redPlayerBox);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function refreshMonsterList(){
	monstersSelectionField.html('');
	playerTurn.monsters.forEach(function(monster){
		let newIcon;

		if(monster.available)
			newIcon = '<div class="monsterIcon" data-level="' +monster.level+ '" data-id="' +monster.id+ '"><img src="./public/icons/monsters/' +monster.iconFilename+ '" /></div>';
		else
			newIcon = '<div class="monsterIcon disabledMonsterIcon" data-level="' +monster.level+ '" data-id="' +monster.id+ '"><img src="./public/icons/monsters/' +monster.iconFilename+ '" /></div>';

		monstersSelectionField.html(monstersSelectionField.html() + newIcon);

		if(selectedMonsterIcon)
			$('.monsterIcon[data-id="'+selectedMonsterIcon+'"]').addClass('selectedMonsterIcon');
	});
}

monstersSelectionField.on('click', '.monsterIcon', function(){
	const monsterId = $(this).attr('data-id');
	let associatedMonster;
	let found = false;

	player.monsters.forEach(function(monster){
		if(monster.id == monsterId && monster.available){
			associatedMonster = monster;
			found = true;
		}
	});
	if(!found){
		opponent.monsters.forEach(function(monster){
			if(monster.id == monsterId && monster.available){
				associatedMonster = monster;
				found = true;
			}
		});
	}

	if(found){
		selectedMonsterIcon = $(this).attr('data-id');
		selectedMonster1 = associatedMonster;
		refreshMonsterList();
	
		// show monster infos
		showMonsterInfos(selectedMonster1);
	}
});

function showMonsterInfos(selectedMonster){
	/*
	let found = false;
	// if the selected monster is owned by the playing player
	playerTurn.monsters.forEach(function(monster){
		if(monster.id == selectedMonsterID){
			monsterInfos1.css('display', 'flex');
			monsterInfos1.find('.monsterName').html(monster.name);
			monsterInfos1.find('.monsterlevel').html(monster.level);
			monsterInfos1.find('.monsterSpeMove').html(monster.movement);
			monsterInfos1.find('.effectCost').html(monster.effectCost);
			monsterInfos1.find('.effectDesc').html(monster.effectDesc);
			monsterInfos1.find('.monsterType').html(monster.type);
			monsterInfos1.find('.monsterStats').html(monster.hp+ ' / ' +monster.atk+ ' / ' +monster.def);
			found = true;
		}
	});
	// if the selected monster is owned by the opponent player
	if(!found){
		let aPlayer;
		if(playerTurn.color == 'Blue')
			aPlayer = player;
		else
			aPlayer = opponent;

		aPlayer.monsters.forEach(function(monster){
			if(monster.id == selectedMonsterID){
				monsterInfos2.css('display', 'flex');
				monsterInfos2.find('.monsterName').html(monster.name);
				monsterInfos2.find('.monsterlevel').html(monster.level);
				monsterInfos2.find('.monsterSpeMove').html(monster.movement);
				monsterInfos2.find('.effectCost').html(monster.effectCost);
				monsterInfos2.find('.effectDesc').html(monster.effectDesc);
				monsterInfos2.find('.monsterType').html(monster.type);
				monsterInfos2.find('.monsterStats').html(monster.hp+ ' / ' +monster.atk+ ' / ' +monster.def);
			}
		});
	}*/
	let selector;
	if(selectedMonster.owner.color === playerTurn.color)
		selector = monsterInfos1;
	else
		selector = monsterInfos2;

	selector.css('display', 'flex');
	selector.find('.monsterName').html(selectedMonster.name);
	selector.find('.monsterlevel').html(selectedMonster.level);
	selector.find('.monsterSpeMove').html(selectedMonster.movement);
	selector.find('.effectCost').html(selectedMonster.effectCost);
	selector.find('.effectDesc').html(selectedMonster.effectDesc);
	selector.find('.monsterType').html(selectedMonster.type);
	selector.find('.monsterStats').html(selectedMonster.leftHp+ ' / ' +selectedMonster.atk+ ' / ' +selectedMonster.def);
}

function switchTurn(){
	if(isSummoning === 0){
		leftDiceThrows = 2;
		leftSummon = 1;
		btnAddDie1.attr("disabled", false);
		btnAddDie2.attr("disabled", false);
		btnAddDie3.attr("disabled", false);
		btnAddDie4.attr("disabled", false);
		btnThrowDice.attr("disabled", false);
		monsterInfos1.css('display', 'none');
		monsterInfos2.css('display', 'none');

		if(playerTurn.isPlayer){
			playerTurn = opponent;
			monsterInfos1.css('background-color', 'rgb(179 146 146 / 80%)');
			monsterInfos2.css('background-color', 'rgb(149 146 179 / 80%)');
			resDice1.html('<img src="./public/icons/summon'+redLastDice[0]+'-icon.png">');
			resDice2.html('<img src="./public/icons/summon'+redLastDice[1]+'-icon.png">');
			resDice3.html('<img src="./public/icons/summon'+redLastDice[2]+'-icon.png">');
		}
		else{
			playerTurn = player;
			monsterInfos1.css('background-color', 'rgb(149 146 179 / 80%)');
			monsterInfos2.css('background-color', 'rgb(179 146 146 / 80%)');
			resDice1.html('<img src="./public/icons/summon'+blueLastDice[0]+'-icon.png">');
			resDice2.html('<img src="./public/icons/summon'+blueLastDice[1]+'-icon.png">');
			resDice3.html('<img src="./public/icons/summon'+blueLastDice[2]+'-icon.png">');
		}
		
		turnIndicator.html(playerTurn.color+ ' Turn');

		lastPathRotation += 2;
		if(lastPathRotation === 4)
			lastPathRotation = 0;
		if(lastPathRotation === 5)
			lastPathRotation = 1;

		selectedMonsterIcon = null;
		selectedMonster1 = null;
		selectedMonster2 = null;
		refreshMonsterList();
	}
}

btnThrowDice.on('click', function(){
	if(playerTurn.color == "Blue"){
		if(leftDiceThrows > 0 && blueLastDice.length === 3 && isSummoning === 0){
			leftDiceThrows--;
			btnAddDie1.attr("disabled", true);
			btnAddDie2.attr("disabled", true);
			btnAddDie3.attr("disabled", true);
			btnAddDie4.attr("disabled", true);
			if(leftDiceThrows === 0)
				btnThrowDice.attr("disabled", true);
	
			let res = [0,0,0];
			for(let i=0;i<3;i++){
				switch(blueLastDice[i]){
					case 1:
						res[i] = DICE1[getRandomInt(6)];
						break;
					case 2:
						res[i] = DICE2[getRandomInt(6)];
						break;
					case 3:
						res[i] = DICE3[getRandomInt(6)];
						break;
					case 4:
						res[i] = DICE4[getRandomInt(6)];
						break;
				}
			}
		
			handleDicesResults(res[0], res[1], res[2]);
		}
	}else{
		if(leftDiceThrows > 0 && redLastDice.length === 3 && isSummoning === 0){
			leftDiceThrows--;
			btnAddDie1.attr("disabled", true);
			btnAddDie2.attr("disabled", true);
			btnAddDie3.attr("disabled", true);
			btnAddDie4.attr("disabled", true);
			if(leftDiceThrows === 0)
				btnThrowDice.attr("disabled", true);
	
			let res = [0,0,0];
			for(let i=0;i<3;i++){
				switch(redLastDice[i]){
					case 1:
						res[i] = DICE1[getRandomInt(6)];
						break;
					case 2:
						res[i] = DICE2[getRandomInt(6)];
						break;
					case 3:
						res[i] = DICE3[getRandomInt(6)];
						break;
					case 4:
						res[i] = DICE4[getRandomInt(6)];
						break;
				}
			}
		
			handleDicesResults(res[0], res[1], res[2]);
		}
	}
});

btnAddDie1.on('click', function(){
	let aArray;
	if(playerTurn.color == "Blue"){
		if(blueLastDice.length < 3)
			blueLastDice.push(1);
		else
			blueLastDice = [1];
		aArray = blueLastDice;
	}else{
		if(redLastDice.length < 3)
			redLastDice.push(1);
		else
			redLastDice = [1];
		aArray = redLastDice;
	}

	switch(aArray.length){
		case 1:
			resDice1.html('<img src="./public/icons/summon1-icon.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/summon1-icon.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/summon1-icon.png">');
			btnThrowDice.attr("disabled", false);
			break;
	}
});
btnAddDie2.on('click', function(){
	let aArray;
	if(playerTurn.color == "Blue"){
		if(blueLastDice.length < 3)
			blueLastDice.push(2);
		else
			blueLastDice = [2];
		aArray = blueLastDice;
	}else{
		if(redLastDice.length < 3)
			redLastDice.push(2);
		else
			redLastDice = [2];
		aArray = redLastDice;
	}

	switch(aArray.length){
		case 1:
			resDice1.html('<img src="./public/icons/summon2-icon.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/summon2-icon.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/summon2-icon.png">');
			btnThrowDice.attr("disabled", false);
			break;
	}
});
btnAddDie3.on('click', function(){
	let aArray;
	if(playerTurn.color == "Blue"){
		if(blueLastDice.length < 3)
			blueLastDice.push(3);
		else
			blueLastDice = [3];
		aArray = blueLastDice;
	}else{
		if(redLastDice.length < 3)
			redLastDice.push(3);
		else
			redLastDice = [3];
		aArray = redLastDice;
	}

	switch(aArray.length){
		case 1:
			resDice1.html('<img src="./public/icons/summon3-icon.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/summon3-icon.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/summon3-icon.png">');
			btnThrowDice.attr("disabled", false);
			break;
	}
});
btnAddDie4.on('click', function(){
	let aArray;
	if(playerTurn.color == "Blue"){
		if(blueLastDice.length < 3)
			blueLastDice.push(4);
		else
			blueLastDice = [4];
		aArray = blueLastDice;
	}else{
		if(redLastDice.length < 3)
			redLastDice.push(4);
		else
			redLastDice = [4];
		aArray = redLastDice;
	}

	switch(aArray.length){
		case 1:
			resDice1.html('<img src="./public/icons/summon4-icon.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/summon4-icon.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/summon4-icon.png">');
			btnThrowDice.attr("disabled", false);
			break;
	}
});

function handleDicesResults(res1, res2, res3){
	resDice1.html('<img src="./public/icons/' +res1+ '">');
	resDice2.html('<img src="./public/icons/' +res2+ '">');
	resDice3.html('<img src="./public/icons/' +res3+ '">');

	let countSummon = 0;
	let typeSummon = 0;
	let temp;
	if(temp = checkDiceResult(res1)){
		if(temp > 0)
			typeSummon = temp;
		countSummon++;
	}
	if(temp = checkDiceResult(res2)){
		if(temp > 0)
			typeSummon = temp;
		countSummon++;
	}
	if(temp = checkDiceResult(res3)){
		if(temp > 0)
			typeSummon = temp;
		countSummon++;
	}
	

	if(leftSummon > 0){
		if(countSummon === 2){
			isSummoning = typeSummon;
			summonMonster();
		}
		
		if(countSummon === 3){
			isSummoning = typeSummon + 0.5;
			summonMonster();
		}
	}
}

function summonMonster(){
	// camera zoom out
	// orbitControls.enableZoom = false;
	const newDiePath = new THREE.Group();
	let texture, baseColor;
	if(playerTurn.color === 'Blue'){
		texture = textureLoaderOthers.load('bluePath1.png');
		baseColor = '#4257a6';
	}else{
		texture = textureLoaderOthers.load('redPath1.png');
		baseColor = '#b12e40';
	}
	const tileGeometry = new THREE.BoxGeometry(1,0.1,1);
	const tileMaterial = [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	];
	newDiePath.userData.pattern = 1;

	// creating tiles
	let tiles = [];
	tiles.push(new THREE.Mesh(tileGeometry, tileMaterial));
	tiles.push(new THREE.Mesh(tileGeometry, tileMaterial));
	tiles.push(new THREE.Mesh(tileGeometry, tileMaterial));
	tiles.push(new THREE.Mesh(tileGeometry, tileMaterial));
	tiles.push(new THREE.Mesh(tileGeometry, tileMaterial));
	tiles.push(new THREE.Mesh(tileGeometry, tileMaterial));
	let i = 0;
	tiles.forEach(function(tile){
		newDiePath.add(tile);
		tile.userData.idTile = lastIdTile;
		lastIdTile++;
		tile.position.x = pathpatterns[lastPathPattern][lastPathRotation][i].x;
		tile.position.y = pathpatterns[lastPathPattern][lastPathRotation][i].y;
		tile.position.z = pathpatterns[lastPathPattern][lastPathRotation][i].z;
		i++;
	});
	// making path
	newDiePath.position.y += 0.15;

	if(playerTurn.color === 'Blue'){
		bluePathTiles.add(newDiePath);
	}else{
		redPathTiles.add(newDiePath);
	}
	movingPath = newDiePath;
}

function checkDiceResult(diceResult){

	switch(diceResult){
		case 'summon1-icon.png':
			return 1;
		case 'summon2-icon.png':
			return 2;
		case 'summon3-icon.png':
			return 3;
		case 'summon4-icon.png':
			return 4;
		case 'move-icon.png':
				increasePlayerMoves(1, playerTurn);
			break;
		case 'move2-icon.png':
				increasePlayerMoves(2, playerTurn);
			break;
		case 'attack-icon.png':
				increasePlayerAttacks(1, playerTurn);
			break;
		case 'attack2-icon.png':
				increasePlayerAttacks(2, playerTurn);
			break;
		case 'shield-icon.png':
				increasePlayerShields(1, playerTurn);
			break;
		case 'shield2-icon.png':
			increasePlayerShields(2, playerTurn);
			break;
		case 'magic-icon.png':
			increasePlayerMagics(1, playerTurn);
			break;
		case 'magic2-icon.png':
			increasePlayerMagics(2, playerTurn);
			break;
		case 'trap-icon.png':
			increasePlayerTraps(1, playerTurn);
			break;
		case 'trap2-icon.png':
			increasePlayerTraps(2, playerTurn);
			break;
	}
	return false;
}

// Increase 
function increasePlayerMoves(amount, aPlayer){
	aPlayer.moves += amount;
	if(aPlayer.moves > 10){
		aPlayer.moves = 10;
	}
	if(aPlayer.isPlayer === true)
		$('#pMovesCount').html(aPlayer.moves);
	else
		$('#oMovesCount').html(aPlayer.moves);
}
function increasePlayerAttacks(amount, aPlayer){
	aPlayer.attacks += amount;
	if(aPlayer.attacks > 10){
		aPlayer.attacks = 10;
	}
	if(aPlayer.isPlayer === true)
		$('#pAttacksCount').html(aPlayer.attacks);
	else
		$('#oAttacksCount').html(aPlayer.attacks);
}
function increasePlayerShields(amount, aPlayer){
	aPlayer.shields += amount;
	if(aPlayer.shields > 10){
		aPlayer.shields = 10;
	}
	if(aPlayer.isPlayer === true)
		$('#pShieldsCount').html(aPlayer.shields);
	else
		$('#oShieldsCount').html(aPlayer.shields);
}
function increasePlayerMagics(amount, aPlayer){
	aPlayer.magics += amount;
	if(aPlayer.magics > 10){
		aPlayer.magics = 10;
	}
	if(aPlayer.isPlayer === true)
		$('#pSpellsCount').html(aPlayer.magics);
	else
		$('#oSpellsCount').html(aPlayer.magics);
}
function increasePlayerTraps(amount, aPlayer){
	aPlayer.traps += amount;
	if(aPlayer.traps > 10){
		aPlayer.traps = 10;
	}
	if(aPlayer.isPlayer === true)
		$('#pTrapsCount').html(aPlayer.traps);
	else
		$('#oTrapsCount').html(aPlayer.traps);
}

// Met à jour la taille de la vue si la fenêtre est redimentionée
window.addEventListener('resize', function(){
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize( window.innerWidth, window.innerHeight );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
});

window.addEventListener( 'mousemove', onMouseMove, false );;
document.addEventListener( 'pointerdown', onMouseDown);
document.addEventListener( 'pointerup', onMouseUp);
window.addEventListener( 'wheel', onWheel);
window.addEventListener( 'keydown', onKeyDown );

$('#endTurn').on('click', function(){
	switchTurn();
});

function onKeyDown( event ) {
	
	if(event.keyCode === 32){	// SpaceBar -> endTurn
		switchTurn();
	}
}


function onWheel(event){
	//event.preventDefault();
	if(isSummoning){	  
		if(event.deltaY > 0)
			lastPathPattern ++;
		else
			lastPathPattern --;
	
		if(lastPathPattern < 0)
			lastPathPattern = pathpatterns.length - 1;
		else if(lastPathPattern >= pathpatterns.length)
			lastPathPattern = 0;

		let i=0;
		movingPath.children.forEach(function(movingTile){
			movingTile.position.x = pathpatterns[lastPathPattern][lastPathRotation][i].x;
			movingTile.position.y = pathpatterns[lastPathPattern][lastPathRotation][i].y;
			movingTile.position.z = pathpatterns[lastPathPattern][lastPathRotation][i].z;
			i++;
		});
	}
}

// calculate mouse position in normalized device coordinates
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	if(isSummoning && movingPath){
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(ground.children, false);

		if(intersects.length >= 1){
			const tilePos = intersects[0].object.position;
			
			movingPath.position.set(tilePos.x, 0.15 ,tilePos.z);
		}
	}
}

function onMouseDown(event){
	realeaseTimer = Date.now();
}

function onMouseUp(event) {
	const delay = Date.now() - realeaseTimer;

	// show monster details
	if(delay < 200){
			
		if(event.button == 2){ // right click
			if(isSummoning){
				//movingPath.rotation.y += THREE.Math.degToRad(90);
				lastPathRotation++;
				if(lastPathRotation > 3)
					lastPathRotation = 0;
				let i=0;
				movingPath.children.forEach(function(movingTile){
					movingTile.position.x = pathpatterns[lastPathPattern][lastPathRotation][i].x;
					movingTile.position.y = pathpatterns[lastPathPattern][lastPathRotation][i].y;
					movingTile.position.z = pathpatterns[lastPathPattern][lastPathRotation][i].z;
					i++;
				});

			}
		}
		if(event.button == 0){ // left click
			// if monsters
			if(isSummoning){
				raycaster.setFromCamera(mouse, camera);
				const intersects = raycaster.intersectObjects(ground.children, false);
		
				if(intersects.length >= 1 && selectedMonster1){
					if(selectedMonster1.available === true){

						let isLinked = false;
						let overflow = false;	// detection of collisions or grid overflow
						let validCellsArray;
						let freeLinkTilePosition = [];
						let lockedTilePosition = [];
	
						movingPath.children.forEach(function(movingTile){
							let movingTileGlobalPos = new Vector3();
							movingTile.getWorldPosition(movingTileGlobalPos);
						});
	
						if(playerTurn.color === 'Blue'){
							validCellsArray = blueLinkedPositions;
						}else{
							validCellsArray = redLinkedPositions;
						}
	
						movingPath.children.forEach(function(movingTile){
							// check path overflows
							let movingTilePos = new Vector3();
							movingTile.getWorldPosition(movingTilePos);
							movingTilePos = new Vector3(movingTilePos.x, 0, movingTilePos.z);
	
	
							if(movingTilePos.x < 0 || movingTilePos.x > 12 || movingTilePos.z < 0 || movingTilePos.z > 18){
								overflow = true;
								console.log('Path go out of the grid...');
							}
							//check collision with player base
							if((movingTilePos.x === 6 && movingTilePos.z === 0) || (movingTilePos.x === 6 && movingTilePos.z === 18)){
								overflow = true;
								console.log('Hit player base ...');
							}
							//check collision with other paths
							if(!overflow){
								bluePathTiles.children.forEach(function(path){
									path.children.forEach(function(tile){
										if(tile.userData.idTile != movingTile.userData.idTile){
											let tilePos = new Vector3();
											tile.getWorldPosition(tilePos);
											tilePos = new Vector3(tilePos.x, 0, tilePos.z);
											
											if(tilePos.equals(movingTilePos)){
												overflow = true;
												console.log('Hit blue path...');
											}
										}
									});
								});
								redPathTiles.children.forEach(function(path){
									path.children.forEach(function(tile){
										if(tile.userData.idTile != movingTile.userData.idTile){
											let tilePos = new Vector3();
											tile.getWorldPosition(tilePos);
											tilePos = new Vector3(tilePos.x, 0, tilePos.z);
											
											if(tilePos.equals(movingTilePos)){
												overflow = true;
												console.log('Hit red path...');
											}
										}
									});
								});
							}
							// check link to valid cell
							validCellsArray.forEach(function(cell){
								if(cell.equals(movingTilePos)){
									isLinked = true;
									console.log('Is in a linked position !');
								}
							});
						});
						
						if(isLinked && !overflow){
							console.log('summoned !');
							if(playerTurn.color === 'Blue'){
								// update blueLinkedPositions
								freeLinkTilePosition.push(new Vector3(5,0,18));
								freeLinkTilePosition.push(new Vector3(7,0,18));
								freeLinkTilePosition.push(new Vector3(6,0,17));
	
								bluePathTiles.children.forEach(function(path){
									path.children.forEach(function(tile){
										let tilePos = new Vector3();
										tile.getWorldPosition(tilePos);
										//tilePos = new Vector3(tilePos.x, 0, tilePos.z);
										tilePos = new Vector3(Math.round(tilePos.x), 0, Math.round(tilePos.z));
	
										// add its position to lockedTilePosition array
										lockedTilePosition.push(tilePos);
										// if cells around are not in freeLinkTilePosition yet and not in lockedTilePosition add them
										let nearPosition1 = new Vector3(tilePos.x+1, 0, tilePos.z), found1 = false;
										let nearPosition2 = new Vector3(tilePos.x-1, 0, tilePos.z), found2 = false;
										let nearPosition3 = new Vector3(tilePos.x, 0, tilePos.z+1), found3 = false;
										let nearPosition4 = new Vector3(tilePos.x, 0, tilePos.z-1), found4 = false;
	
										freeLinkTilePosition.forEach(function(freeTile){
											if(freeTile.equals(nearPosition1)) found1 = true;
											if(freeTile.equals(nearPosition2)) found2 = true;
											if(freeTile.equals(nearPosition3)) found3 = true;
											if(freeTile.equals(nearPosition4)) found4 = true;
										});
										if(!found1) freeLinkTilePosition.push(nearPosition1);
										if(!found2) freeLinkTilePosition.push(nearPosition2);
										if(!found3) freeLinkTilePosition.push(nearPosition3);
										if(!found4) freeLinkTilePosition.push(nearPosition4);
									});
								});
								
								lockedTilePosition.forEach(function(lockedTile){
	
									freeLinkTilePosition.forEach(function(freeTile){
										if(freeTile.equals(lockedTile)){
											freeLinkTilePosition = arrayRemove(freeLinkTilePosition, lockedTile);
										}
									});
								});
								blueLinkedPositions = freeLinkTilePosition;
							}else{
								// update redLinkedPositions
								freeLinkTilePosition.push(new Vector3(5,0,0));
								freeLinkTilePosition.push(new Vector3(7,0,0));
								freeLinkTilePosition.push(new Vector3(6,0,1));
	
								redPathTiles.children.forEach(function(path){
									path.children.forEach(function(tile){
										let tilePos = new Vector3();
										tile.getWorldPosition(tilePos);
										tilePos = new Vector3(Math.round(tilePos.x), 0, Math.round(tilePos.z));
	
										// add its position to lockedTilePosition array
										lockedTilePosition.push(tilePos);
										// if cells around are not in freeLinkTilePosition yet add them
										let nearPosition1 = new Vector3(tilePos.x+1, 0, tilePos.z), found1 = false;
										let nearPosition2 = new Vector3(tilePos.x-1, 0, tilePos.z), found2 = false;
										let nearPosition3 = new Vector3(tilePos.x, 0, tilePos.z+1), found3 = false;
										let nearPosition4 = new Vector3(tilePos.x, 0, tilePos.z-1), found4 = false;
	
										freeLinkTilePosition.forEach(function(freeTile){
											if(freeTile.equals(nearPosition1)) found1 = true;
											if(freeTile.equals(nearPosition2)) found2 = true;
											if(freeTile.equals(nearPosition3)) found3 = true;
											if(freeTile.equals(nearPosition4)) found4 = true;
										});
										if(!found1) freeLinkTilePosition.push(nearPosition1);
										if(!found2) freeLinkTilePosition.push(nearPosition2);
										if(!found3) freeLinkTilePosition.push(nearPosition3);
										if(!found4) freeLinkTilePosition.push(nearPosition4);
									});
								});
								lockedTilePosition.forEach(function(lockedTile){
	
									freeLinkTilePosition.forEach(function(freeTile){
										if(freeTile.equals(lockedTile)){
											freeLinkTilePosition = arrayRemove(freeLinkTilePosition, lockedTile);
										}
									});
								});
								redLinkedPositions = freeLinkTilePosition;
							}
	
							// Load monster model
							model3DFBXLoader.load( selectedMonster1.modelFilename, function ( object ) {
	
								object.traverse( function ( child ) {
									if ( child.isMesh ) {
										child.castShadow = true;
										child.receiveShadow = true;
									}
								} );
	
								object.position.x = movingPath.position.x;
								object.position.y = movingPath.position.y;
								object.position.z = movingPath.position.z;
								object.scale.x = selectedMonster1.scale;
								object.scale.y = selectedMonster1.scale;
								object.scale.z = selectedMonster1.scale;

								// Monster stats
								object.userData.class = selectedMonster1;
	
								if(playerTurn.color == 'Blue'){
									blueSummonedMonsters.add(object);
									object.rotation.y += THREE.Math.degToRad(180);
								}
								else{
									redSummonedMonsters.add(object);
								}
	
							}, undefined, function ( error ) {
								console.error( error );
							} );
	
							selectedMonster1.available = false;
							playerTurn.summonedMonsters.push(selectedMonster1);
							selectedMonsterIcon = null;
							monsterInfos1.css('display', 'none');
							isSummoning = 0;
							leftSummon --;
							orbitControls.enableZoom = true;
							refreshMonsterList();
						}
					}
				}
			}else{
				const sceneMonsters = blueSummonedMonsters.children.concat(redSummonedMonsters.children);
				raycaster.setFromCamera(mouse, camera);
				const intersects = raycaster.intersectObjects(sceneMonsters, true);
		
				if(intersects.length >= 1){
					// show monster infos
					showMonsterInfos(intersects[0].object.parent.userData.class);
				}
			}
		}
	}
}

function arrayRemove(arr, value) { 
    
	for( var i = 0; i < arr.length; i++){
        if ( arr[i].equals(value)) { 
            arr.splice(i, 1);
        }
    }
	return arr;
}

// Affichage framerate (debug)
(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()