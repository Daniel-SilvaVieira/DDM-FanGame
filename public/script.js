import * as THREE from './libs/three.js/build/three.module.js';
import { OrbitControls } from './libs/three.js/examples/jsm/controls/OrbitControls.js';
import { DragControls } from './libs/three.js/examples/jsm/controls/DragControls.js';
import { EffectComposer } from './libs/three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './libs/three.js/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './libs/three.js/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from './libs/three.js/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from './libs/three.js/examples/jsm/shaders/FXAAShader.js';
import {Vector2, Vector3} from "./libs/three.js/build/three.module.js";
//import { FBXLoader } from "./libs/three.js/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "./libs/three.js/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "./libs/three.js/examples/jsm/loaders/DRACOLoader.js";
import { Player } from "./Player.js";
import * as MONSTER from "./jsClass/MonsterModule.js";

/// VARIABLES ///
let camera, scene, renderer, orbitControls, mouse, raycaster;
let realeaseTimer = null;
let blueSummonedMonsters = new THREE.Group();
let redSummonedMonsters = new THREE.Group();
let allSceneMonsters = [];
let ground = new THREE.Group();
let lastIdTile = 0;
let bluePathTiles = new THREE.Group(),
redPathTiles = new THREE.Group(),
allTiles = [];
let movingPath = null;
let selectedMonster1 = null,
selectedMonster2 = null,
selectedMonsterIcon = null,
selectedMonsterIconID = null;

const player = new Player('Yugi Muto', true, 'Blue', 3, 0, 0, 0, 0, 0),
opponent = new Player('Duke Devlin', false, 'Red', 3, 0, 0, 0, 0, 0);

//let timeWizard = new Monster.TimeWizard(player);
player.monsters = [
	new MONSTER.TimeWizard(player), new MONSTER.TimeWizard(player), new MONSTER.TimeWizard(player),
	new MONSTER.RyuRan(player), new MONSTER.RyuRan(player), new MONSTER.DarkMagicianGirl(player),
	new MONSTER.CursedDragon(player), new MONSTER.CursedDragon(player), new MONSTER.SummonedSkull(player),
	new MONSTER.BlueEyesWhiteDragon(player)
];
opponent.monsters = [
	new MONSTER.TimeWizard(opponent), new MONSTER.TimeWizard(opponent), new MONSTER.TimeWizard(opponent),
	new MONSTER.RyuRan(opponent), new MONSTER.RyuRan(opponent), new MONSTER.DarkMagicianGirl(opponent),
	new MONSTER.CursedDragon(opponent), new MONSTER.CursedDragon(opponent), new MONSTER.SummonedSkull(opponent),
	new MONSTER.BlueEyesWhiteDragon(opponent)
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
	],
	[
		[new Vector3(0,0,0), new Vector3(0,0,-1), new Vector3(-1,0,-1), new Vector3(1,0,0), new Vector3(0,0,1), new Vector3(0,0,2)],
		[new Vector3(0,0,0), new Vector3(-1,0,0), new Vector3(-1,0,1), new Vector3(0,0,-1), new Vector3(1,0,0), new Vector3(2,0,0)],
		[new Vector3(0,0,0), new Vector3(0,0,1), new Vector3(1,0,1), new Vector3(-1,0,0), new Vector3(0,0,-1), new Vector3(0,0,-2)],
		[new Vector3(0,0,0), new Vector3(1,0,0), new Vector3(1,0,-1), new Vector3(0,0,1), new Vector3(-1,0,0), new Vector3(-2,0,0)]
	],
	[
		[new Vector3(0,0,0), new Vector3(-1,0,0), new Vector3(-1,0,-1), new Vector3(0,0,1), new Vector3(1,0,1), new Vector3(1,0,2)],
		[new Vector3(0,0,0), new Vector3(0,0,1), new Vector3(-1,0,1), new Vector3(1,0,0), new Vector3(1,0,-1), new Vector3(2,0,-1)],
		[new Vector3(0,0,0), new Vector3(1,0,0), new Vector3(1,0,1), new Vector3(0,0,-1), new Vector3(-1,0,-1), new Vector3(-1,0,-2)],
		[new Vector3(0,0,0), new Vector3(0,0,-1), new Vector3(1,0,-1), new Vector3(-1,0,0), new Vector3(-1,0,1), new Vector3(-2,0,1)]
	]
];
// Moving
let entireMovingPath = []; // path followed by the moving monster
// Dices
const DICE1 = ['lv1sum.png', 'lv1sum.png', 'lv1sum.png', 'lv1sum.png', 'lv1move.png', 'lv1shieldx2.png'];
const DICE2 = ['lv2sum.png', 'lv2sum.png', 'lv2sum.png', 'lv2movex2.png', 'lv2attackx2.png', 'lv2magicx2.png'];
const DICE3 = ['lv3sum.png', 'lv3sum.png', 'lv3move.png', 'lv3move.png', 'lv3attack.png', 'lv3trapx2.png'];
const DICE4 = ['lv4sum.png', 'lv4movex2.png', 'lv4attack.png', 'lv4shield.png', 'lv4magic.png', 'lv4trap.png'];
let blueLastDice = [1,1,1];
let redLastDice = [1,1,1];
// postprocessing
let composer, effectFXAA, outlinePass;
let selectedObjects = [];
// config

// Loaders
const textureLoaderSky = new THREE.TextureLoader();
textureLoaderSky.setPath( 'public/skybox/' );
const textureLoaderOthers = new THREE.TextureLoader();
textureLoaderOthers.setPath( 'public/textures/' );
const model3DFBXLoader = new GLTFLoader();
model3DFBXLoader.setPath('public/3DModels/');
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './libs/three.js/examples/js/libs/draco/' );
model3DFBXLoader.setDRACOLoader( dracoLoader );
// JQuery
const btnAddDie1 = $('#addDie1'),
btnAddDie2 = $('#addDie2'),
btnAddDie3 = $('#addDie3'),
btnAddDie4 = $('#addDie4'),
btnThrowDice = $('#throwDice'),
resDice1 = $('#resDice1'),
resDice2 = $('#resDice2'),
resDice3 = $('#resDice3'),
btnEndTurn = $('#endTurn'),
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
	//renderer.shadowMap.enabled = true;

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
	//orbitControls.maxPolarAngle = Math.PI / 2;
	//orbitControls.minDistance = 6;
	//orbitControls.maxDistance = 30;
	orbitControls.update();

	// ----------------------------------------------
	// Terrain
	buildTerrain();
	scene.add(bluePathTiles);
	scene.add(redPathTiles);
	scene.add(blueSummonedMonsters);
	scene.add(redSummonedMonsters);
	


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
	
	const cubeGeometry = new THREE.BoxGeometry(1, 1.6, 1);
	const blueMaterial = new THREE.MeshStandardMaterial({color : '#3b7fdb'});
	const redMaterial = new THREE.MeshStandardMaterial({color : '#db3b3b'});
	
	const bluePlayerBox = new THREE.Mesh(cubeGeometry, blueMaterial);
	bluePlayerBox.position.set(6, 0.9, 18);
	/*bluePlayerBox.receiveShadow = true;
	bluePlayerBox.castShadow = true;*/
	scene.add(bluePlayerBox);
	const redPlayerBox = new THREE.Mesh(cubeGeometry, redMaterial);
	redPlayerBox.position.set(6, 0.9, 0);
	/*redPlayerBox.receiveShadow = true;
	redPlayerBox.castShadow = true;*/
	scene.add(redPlayerBox);

	
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
	/*pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;*/

	const d = 10;
	pointLight.shadow.camera.left = - d;
	pointLight.shadow.camera.right = d;
	pointLight.shadow.camera.top = d;
	pointLight.shadow.camera.bottom = - d;
	pointLight.shadow.camera.far = 1000;
	scene.add(pointLight);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function refreshMonsterList(){
	monstersSelectionField.html('');
	let allIcons = '';
	playerTurn.monsters.forEach(function(monster){
		let newIcon;

		if(monster.available)
			allIcons += '<div class="monsterIcon" data-level="' +monster.level+ '" data-id="' +monster.id+ '"><img src="./public/icons/monsters/' +monster.iconFilename+ '" /></div>';
		else
		allIcons += '<div class="monsterIcon disabledMonsterIcon" data-level="' +monster.level+ '" data-id="' +monster.id+ '"><img src="./public/icons/monsters/' +monster.iconFilename+ '" /></div>';
	});
	monstersSelectionField.html(allIcons);
	if(selectedMonsterIconID)
		$('.monsterIcon[data-id="'+selectedMonsterIconID+'"]').addClass('selectedMonsterIcon');
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
		selectedMonsterIconID = $(this).attr('data-id');
		selectedMonsterIcon = associatedMonster;
		refreshMonsterList();
		selectedMonster1 = null;
	
		// show monster infos
		showMonsterInfos(selectedMonsterIcon);
	}
});

function showMonsterInfos(selectedMonster){
	let selector;
	if(selectedMonster.owner.color === playerTurn.color)
		selector = monsterInfos1;
	else
		selector = monsterInfos2;

	selector.css('display', 'flex');
	selector.find('.monsterName').html(selectedMonster.name);
	selector.find('.monsterlevel').html('lv. '+selectedMonster.level);
	selector.find('.monsterSpeMove').html(selectedMonster.movement);
	selector.find('.effectCost').html('<button>' +selectedMonster.effectCost+ '</button>');
	selector.find('.effectDesc').html(selectedMonster.effectDesc);
	selector.find('.monsterType').html(selectedMonster.type);
	selector.find('.monsterStats').html('hp: ' +selectedMonster.leftHp+ ' / atk: ' +selectedMonster.atk+ ' / def : ' +selectedMonster.def);
}

function switchTurn(){
	if(isSummoning === 0 && leftDiceThrows === 0){
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
			resDice1.html('<img src="./public/icons/dice/lv'+redLastDice[0]+'sum.png">');
			resDice2.html('<img src="./public/icons/dice/lv'+redLastDice[1]+'sum.png">');
			resDice3.html('<img src="./public/icons/dice/lv'+redLastDice[2]+'sum.png">');
		}
		else{
			playerTurn = player;
			monsterInfos1.css('background-color', 'rgb(149 146 179 / 80%)');
			monsterInfos2.css('background-color', 'rgb(179 146 146 / 80%)');
			resDice1.html('<img src="./public/icons/dice/lv'+blueLastDice[0]+'sum.png">');
			resDice2.html('<img src="./public/icons/dice/lv'+blueLastDice[1]+'sum.png">');
			resDice3.html('<img src="./public/icons/dice/lv'+blueLastDice[2]+'sum.png">');
		}
		
		turnIndicator.html(playerTurn.color+ ' Turn');

		lastPathRotation += 2;
		if(lastPathRotation === 4)
			lastPathRotation = 0;
		if(lastPathRotation === 5)
			lastPathRotation = 1;

		selectedMonsterIcon = null;
		selectedMonsterIconID = null;
		selectedMonster1 = null;
		selectedMonster2 = null;
		refreshMonsterList();
	}else{
		if(movingPath){
			movingPath.parent.remove(movingPath);
			movingPath = null;
		}
		isSummoning = 0;
		btnEndTurn.html('End Turn');
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
			btnThrowDice.attr("disabled", true);

			const resImg = [resDice1, resDice2, resDice3];

			// rolling dice animation
			for(let i=0;i<3;i++){
				switch(blueLastDice[i]){
					case 1:
						resImg[i].html('<img src="./public/icons/dice/rollDice1anim.gif">');
						break;
					case 2:
						resImg[i].html('<img src="./public/icons/dice/rollDice2anim.gif">');
						break;
					case 3:
						resImg[i].html('<img src="./public/icons/dice/rollDice3anim.gif">');
						break;
					case 4:
						resImg[i].html('<img src="./public/icons/dice/rollDice4anim.gif">');
						break;
				}
			}
	
			let res = [0,0,0];
			setTimeout(function(){
				switch(blueLastDice[0]){
					case 1:
						res[0] = DICE1[getRandomInt(6)];
						break;
					case 2:
						res[0] = DICE2[getRandomInt(6)];
						break;
					case 3:
						res[0] = DICE3[getRandomInt(6)];
						break;
					case 4:
						res[0] = DICE4[getRandomInt(6)];
						break;
				}
				resDice1.html('<img src="./public/icons/dice/' +res[0]+ '">');
			}, 400);
			setTimeout(function(){
				switch(blueLastDice[1]){
					case 1:
						res[1] = DICE1[getRandomInt(6)];
						break;
					case 2:
						res[1] = DICE2[getRandomInt(6)];
						break;
					case 3:
						res[1] = DICE3[getRandomInt(6)];
						break;
					case 4:
						res[1] = DICE4[getRandomInt(6)];
						break;
				}
				resDice2.html('<img src="./public/icons/dice/' +res[1]+ '">');
			}, 800);
			setTimeout(function(){
				switch(blueLastDice[2]){
					case 1:
						res[2] = DICE1[getRandomInt(6)];
						break;
					case 2:
						res[2] = DICE2[getRandomInt(6)];
						break;
					case 3:
						res[2] = DICE3[getRandomInt(6)];
						break;
					case 4:
						res[2] = DICE4[getRandomInt(6)];
						break;
				}
				resDice3.html('<img src="./public/icons/dice/' +res[2]+ '">');
			}, 1200);


			setTimeout(function(){
				handleDicesResults(res[0], res[1], res[2]);
				
				if(leftDiceThrows > 0)
					btnThrowDice.attr("disabled", false);
			}, 1300);
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
	
			
				const resImg = [resDice1, resDice2, resDice3];

				// rolling dice animation
				for(let i=0;i<3;i++){
					switch(redLastDice[i]){
						case 1:
							resImg[i].html('<img src="./public/icons/dice/rollDice1anim.gif">');
							break;
						case 2:
							resImg[i].html('<img src="./public/icons/dice/rollDice2anim.gif">');
							break;
						case 3:
							resImg[i].html('<img src="./public/icons/dice/rollDice3anim.gif">');
							break;
						case 4:
							resImg[i].html('<img src="./public/icons/dice/rollDice4anim.gif">');
							break;
					}
				}
		
				let res = [0,0,0];
				setTimeout(function(){
					switch(redLastDice[0]){
						case 1:
							res[0] = DICE1[getRandomInt(6)];
							break;
						case 2:
							res[0] = DICE2[getRandomInt(6)];
							break;
						case 3:
							res[0] = DICE3[getRandomInt(6)];
							break;
						case 4:
							res[0] = DICE4[getRandomInt(6)];
							break;
					}
					resDice1.html('<img src="./public/icons/dice/' +res[0]+ '">');
				}, 400);
				setTimeout(function(){
					switch(redLastDice[1]){
						case 1:
							res[1] = DICE1[getRandomInt(6)];
							break;
						case 2:
							res[1] = DICE2[getRandomInt(6)];
							break;
						case 3:
							res[1] = DICE3[getRandomInt(6)];
							break;
						case 4:
							res[1] = DICE4[getRandomInt(6)];
							break;
					}
					resDice2.html('<img src="./public/icons/dice/' +res[1]+ '">');
				}, 800);
				setTimeout(function(){
					switch(redLastDice[2]){
						case 1:
							res[2] = DICE1[getRandomInt(6)];
							break;
						case 2:
							res[2] = DICE2[getRandomInt(6)];
							break;
						case 3:
							res[2] = DICE3[getRandomInt(6)];
							break;
						case 4:
							res[2] = DICE4[getRandomInt(6)];
							break;
					}
					resDice3.html('<img src="./public/icons/dice/' +res[2]+ '">');
				}, 1200);
	
	
				setTimeout(function(){
					handleDicesResults(res[0], res[1], res[2]);
				}, 1300);
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
			resDice1.html('<img src="./public/icons/dice/lv1sum.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/dice/lv1sum.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/dice/lv1sum.png">');
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
			resDice1.html('<img src="./public/icons/dice/lv2sum.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/dice/lv2sum.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/dice/lv2sum.png">');
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
			resDice1.html('<img src="./public/icons/dice/lv3sum.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/dice/lv3sum.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/dice/lv3sum.png">');
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
			resDice1.html('<img src="./public/icons/dice/lv4sum.png">');
			resDice2.html('');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 2:
			resDice2.html('<img src="./public/icons/dice/lv4sum.png">');
			resDice3.html('');
			btnThrowDice.attr("disabled", true);
			break;
		case 3:
			resDice3.html('<img src="./public/icons/dice/lv4sum.png">');
			btnThrowDice.attr("disabled", false);
			break;
	}
});

function handleDicesResults(res1, res2, res3){
	/*resDice1.html('<img src="./public/icons/dice/' +res1+ '">');
	resDice2.html('<img src="./public/icons/dice/' +res2+ '">');
	resDice3.html('<img src="./public/icons/dice/' +res3+ '">');*/

	let countSummon = [0,0,0,0];
	let temp;
	if(temp = checkDiceResult(res1)){
		if(temp > 0)
			countSummon[temp-1] ++;
	}
	if(temp = checkDiceResult(res2)){
		if(temp > 0)
			countSummon[temp-1] ++;
	}
	if(temp = checkDiceResult(res3)){
		if(temp > 0)
			countSummon[temp-1] ++;
	}
	
	if(leftSummon > 0){
		let i = 0;
		while(i < 4){
			if(countSummon[i] === 3){
				isSummoning = i + 1.5;	// 3 same summon icons
				summonMonster();
				i=4;
			}
			else if(countSummon[i] === 2){
				isSummoning = i + 1;	// 2 same summon icons
				summonMonster();
				i=4;
			}
			i++;
		}
	}
}

function summonMonster(){
	// TODO
	// camera zoom out
	// orbitControls.enableZoom = false;

	btnEndTurn.html('Skip summon');

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
	tiles.push(new THREE.Mesh(tileGeometry, [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	]));
	tiles.push(new THREE.Mesh(tileGeometry, [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	]));
	tiles.push(new THREE.Mesh(tileGeometry, [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	]));
	tiles.push(new THREE.Mesh(tileGeometry, [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	]));
	tiles.push(new THREE.Mesh(tileGeometry, [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	]));
	tiles.push(new THREE.Mesh(tileGeometry, [
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Right side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Left side
		new THREE.MeshBasicMaterial({ map: texture }),	// Top side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Bottom side
		new THREE.MeshBasicMaterial({ color : baseColor }),	// Front side
		new THREE.MeshBasicMaterial({ color : baseColor })	// Back side
	]));
	let i = 0;
	tiles.forEach(function(tile){
		newDiePath.add(tile);
		tile.userData.idTile = lastIdTile;
		lastIdTile++;
		tile.position.x = pathpatterns[lastPathPattern][lastPathRotation][i].x;
		tile.position.y = pathpatterns[lastPathPattern][lastPathRotation][i].y;
		tile.position.z = pathpatterns[lastPathPattern][lastPathRotation][i].z;
		tile.userData.pointsToIt = null;
		tile.userData.movementsNeeded = null;

		if(tile.position.equals(new Vector3(0,0,0))){
			tile.userData.occupied = true;
		}else{
			tile.userData.occupied = false;
		}
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
		case 'lv1sum.png':
			return 1;
		case 'lv2sum.png':
			return 2;
		case 'lv3sum.png':
			return 3;
		case 'lv4sum.png':
			return 4;
		case 'lv1move.png':
			increasePlayerMoves(1, playerTurn);
			break;
		case 'lv3move.png':
			increasePlayerMoves(1, playerTurn);
			break;
		case 'lv2movex2.png':
			increasePlayerMoves(2, playerTurn);
			break;
		case 'lv4movex2.png':
			increasePlayerMoves(2, playerTurn);
			break;
		case 'lv3attack.png':
			increasePlayerAttacks(1, playerTurn);
			break;
		case 'lv4attack.png':
			increasePlayerAttacks(1, playerTurn);
			break;
		case 'lv2attackx2.png':
			increasePlayerAttacks(2, playerTurn);
			break;
		case 'lv4shield.png':
			increasePlayerShields(1, playerTurn);
			break;
		case 'lv1shieldx2.png':
			increasePlayerShields(2, playerTurn);
			break;
		case 'lv4magic.png':
			increasePlayerMagics(1, playerTurn);
			break;
		case 'lv2magicx2.png':
			increasePlayerMagics(2, playerTurn);
			break;
		case 'lv4trap.png':
			increasePlayerTraps(1, playerTurn);
			break;
		case 'lv3trapx2.png':
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

btnEndTurn.on('click', function(){
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
		
				if(intersects.length >= 1 && selectedMonsterIcon){
					if(selectedMonsterIcon.available === true && selectedMonsterIcon.level >= Math.floor(isSummoning) && selectedMonsterIcon.level <= Math.ceil(isSummoning)){

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
							}
							//check collision with player base
							if((movingTilePos.x === 6 && movingTilePos.z === 0) || (movingTilePos.x === 6 && movingTilePos.z === 18)){
								overflow = true;
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
											}
										}
									});
								});
							}
							// check link to valid cell
							validCellsArray.forEach(function(cell){
								if(cell.equals(movingTilePos)){
									isLinked = true;
								}
							});
						});
						
						if(isLinked && !overflow){
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
										tilePos = new Vector3(tilePos.x, 0, tilePos.z);
	
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
							model3DFBXLoader.load( selectedMonsterIcon.modelFilename, function ( object ) {

								/*gltf.scene.traverse(function (child) {
									if ((<THREE.Mesh>child).isMesh) {
										let m = <THREE.Mesh>child
										m.receiveShadow = true
										m.castShadow = true;
										//(<THREE.MeshStandardMaterial>m.material).flatShading = true
										//sceneMeshes.push(m)
									}
									if ((<THREE.Light>child).isLight) {
										let l = <THREE.Light>child
										l.castShadow = true
										l.shadow.bias = -.003
										l.shadow.mapSize.width = 2048
										l.shadow.mapSize.height = 2048
									}
								})*/
	
								object.scene.position.x = movingPath.position.x;
								object.scene.position.y = movingPath.position.y;
								object.scene.position.z = movingPath.position.z;

								// Monster stats
								object.scene.userData.class = selectedMonsterIcon;
	
								if(playerTurn.color == 'Blue'){
									blueSummonedMonsters.add(object.scene);
									object.scene.rotation.y += THREE.Math.degToRad(180);
								}
								else{
									redSummonedMonsters.add(object.scene);
								}
								selectedMonsterIcon.available = false;
								playerTurn.summonedMonsters.push(selectedMonsterIcon);
								allSceneMonsters.push(object.scene);
								selectedMonsterIcon = null;
								selectedMonsterIconID = null;
								refreshMonsterList();
								movingPath.children.forEach(function(tile){
									allTiles.push(tile);
								});
								movingPath = null;
	
							}, undefined, function ( error ) {
								console.error( error );
							} );
	
							monsterInfos1.css('display', 'none');
							btnEndTurn.html('End Turn');
							isSummoning = 0;
							leftSummon --;
							orbitControls.enableZoom = true;
							refreshMonsterList();
						}
					}
				}
			}else{ // select monster
				raycaster.setFromCamera(mouse, camera);
				const intersectsMonsters = raycaster.intersectObjects(allSceneMonsters, true);

				raycaster.setFromCamera(mouse, camera);
				const intersectsTile = raycaster.intersectObjects(allTiles, true);
		
				if(intersectsMonsters.length >= 1){
					// show monster infos
					let aMonster;
					if(intersectsMonsters[0].object.parent.userData.class){
						aMonster = intersectsMonsters[0].object.parent;
					}else{
						aMonster = intersectsMonsters[0].object.parent.parent;
					}
					
					if(aMonster.userData.class.owner.color === playerTurn.color){
						selectedMonster1 = aMonster;
						
						// PATH FINDING HERE
						let startPosition = selectedMonster1.position;
						let isFlying = false;
						if(selectedMonster1.movement === 'Flying')
							isFlying = true;
						if((!isFlying && playerTurn.moves >= 1) || (isFlying && playerTurn.moves >= 2)){
							console.log('start seeking around');
							seekAroundTo(startPosition, startPosition, [startPosition], isFlying);
						}
					}
					else
						selectedMonster2 = aMonster;
					showMonsterInfos(aMonster.userData.class);


				}else if(intersectsTile.length >= 1){
					if(selectedMonster1){
						if(!selectedMonster1.available && !selectedMonster1.dead && leftDiceThrows === 0){	 //move selected monster
							// MOVING
							let startPosition = selectedMonster1.position;
							let endPosition = new Vector3();
							intersectsTile[0].object.getWorldPosition(endPosition);

							if(selectedMonster1){

							}
							
							/*selectedMonster1.position.x = endPosition.x;
							selectedMonster1.position.y = endPosition.y;
							selectedMonster1.position.z = endPosition.z;*/

						}
					}
				}
				
			}
		}
	}
}


function seekAroundTo(currentPosition, startPosition, pathPointsArray = [], isFlying, nbMoves = 0){
	nbMoves ++;
	if(isFlying)
		nbMoves ++;
	let xMoves = currentPosition.x - startPosition.x;
	let zMoves = currentPosition.z - startPosition.z;
	let ray;
	/*let newPosition = new Vector3();
	intersectsTile[0].object.getWorldPosition(newPosition);*/
	pathPointsArray.push(currentPosition);

	let positionsToTest = [];

	if(xMoves === 0 && zMoves === 0){
		positionsToTest.push(new Vector3(currentPosition.x +1, 0.3, currentPosition.z));
		positionsToTest.push(new Vector3(currentPosition.x -1, 0.3, currentPosition.z));
		positionsToTest.push(new Vector3(currentPosition.x, 0.3, currentPosition.z +1));
		positionsToTest.push(new Vector3(currentPosition.x, 0.3, currentPosition.z -1));
	}/*else if(xMoves > 0){
		positionsToTest.push(new Vector3(currentPosition.x + 1, 0.3, currentPosition.z));
		positionsToTest.push(new Vector3(currentPosition.x - Math.sign(xMoves), 0.3, currentPosition.z));
	}else if(zMoves < xMoves){
		positionsToTest.push(new Vector3(currentPosition.x, 0.3, currentPosition.z + Math.sign(xMoves)));
	}else{

	}*/

	positionsToTest.forEach(function(newPosition){
		ray = new THREE.Raycaster(
			newPosition,
			new Vector3(0,-1,0)
		);
		//console.log(newPosition);
	
		const intersects = ray.intersectObjects( allTiles, true );
		if(intersects.length > 0){
			const aTile = intersects[0].object;
			console.log(aTile);
			if(!aTile.userData.occupied && (aTile.userData.movementsNeeded > nbMoves || aTile.userData.movementsNeeded == null)){
				aTile.material.forEach(function(face){
					face.transparent = true;
					face.opacity = 0.5;
				});
				aTile.userData.movementsNeeded = nbMoves;
				aTile.userData.pointsToIt = pathPointsArray;
	
				if((!isFlying && playerTurn.moves >= nbMoves+1) || (isFlying && playerTurn.moves >= nbMoves+2))
					seekAroundTo(newPosition, startPosition, pathPointsArray, isFlying, nbMoves);
			}
		}
	});
}

/*function seekAroundTo(currentPosition, endPosition, pathPointsArray = [], nbMoves = 0){
	nbMoves ++;
	let xMoves = currentPosition.x - endPosition.x;
	let zMoves = currentPosition.z - endPosition.z;
	let ray;
	let newPosition

	if(Math.abs(xMoves) > Math.abs(zMoves)){
		// go on x axis first
		newPosition = new Vector3(currentPosition.x - Math.sign(xMoves), 0.3, currentPosition.z);
	}else{
		// go on z axis first
		newPosition = new Vector3(currentPosition.x, 0.3, currentPosition.z - Math.sign(zMoves));
	}

	ray = new THREE.Raycaster(
		newPosition,
		new Vector3(0,-1,0)
	);
	//console.log(newPosition);

	const intersects = ray.intersectObjects( allTiles, true );
	if(intersects.length > 0){
		// if endPosition is found
		if(newPosition.x === endPosition.x && newPosition.z === endPosition.z){
			pathPointsArray.push(newPosition);
			console.log(pathPointsArray);
			return pathPointsArray;
		}else{
			//if tile is occuped

		}
		//let returnedPath = seekAroundTo(newPosition, endPosition);
		//if()
	}else{
		// check sides
		// if !intersect
			//check back
				// if !intersect
					//return false
	}
}*/

function arrayRemove(arr, value) { 
    
	for( var i = 0; i < arr.length; i++){
        if ( arr[i].equals(value)) { 
            arr.splice(i, 1);
        }
    }
	return arr;
}

// Affichage framerate (debug)
//(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()