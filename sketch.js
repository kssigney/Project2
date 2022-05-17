/***********************************************************************************
  Hiraya
  by Kiana Star Signey

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

//--- TEMPLATE STUFF: Don't change

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;


// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

//---

//-- MODIFY THIS for different speeds
var speed = 5;

//--- Your globals would go here


// Allocate Adventure Manager with states table and interaction tables
function preload() {
  //--- TEMPLATE STUFF: Don't change
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  //---
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  //--- TEMPLATE STUFF: Don't change
  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();
  //---

  // MODIFY THIS: change to initial position
  playerAvatar = new Avatar("Player", 640, 360);
   
  // MODIFY THIS: to make your avatar go faster or slower
  playerAvatar.setMaxSpeed(5);

  // MODIFY THIS: add your filenames here, right now our moving animation and standing animation are the same
  playerAvatar.addMovingAnimation( 'assets/walking01.png', 'assets/walking06.png');
  playerAvatar.addStandingAnimation('assets/standing01.png', 'assets/standing02.png');

  //--- TEMPLATE STUFF: Don't change
  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerAvatar.sprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
  //--
  //adventureManager.changeState("scene3");
}

// Adventure manager handles it all!
function draw() {
  //--- TEMPLATE STUFF: Don't change
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
  //---

  //--- MODIFY THESE CONDITONALS
  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Hiraya" && 
      adventureManager.getStateName() !== "Instructions" ) {
      
    //--- TEMPLATE STUFF: Don't change    
    // responds to keydowns
    checkMovement();

    // this is a function of p5.play, not of this sketch
    if( adventureManager.getStateName() !== "scene2" ) { 
      drawSprite(playerAvatar.sprite);
    }
    
    //--
  } 

  playerAvatar.update();
}

//--- TEMPLATE STUFF: Don't change 
// respond to W-A-S-D or the arrow keys
function checkMovement() {
  var xSpeed = 0;
  var ySpeed = 0;

  // Check x movement
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    xSpeed = speed;
  }
  else if(keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    xSpeed = -speed;
  }
  
  // Check y movement
  if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    ySpeed = speed;
  }
  else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    ySpeed = -speed;
  }

  playerAvatar.setSpeed(xSpeed,ySpeed);
}
//--
//-- MODIFY THIS: this is an example of how I structured my code. You may
// want to do it differently
//function mouseReleased() {
  //if( adventureManager.getStateName() === "Hiraya") {
    //adventureManager.changeState("Instructions");
  //}
//}

function keyPressed() {
  adventureManager.keyPressed();
}

// global function
function mousePressed() {
  if( adventureManager.getStateName() === "scene4" ) {
    vegMouseX.push(mouseX);
    vegMouseY.push(mouseY); 
  }
}
//-------------- CLICKABLE CODE  ---------------//

//--- TEMPLATE STUFF: Don't change 
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}
//--

//-- MODIFY THIS:
// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#c9212a";
  this.noTint = false;
  this.tint = "#fedb1f";
}

//-- MODIFY THIS:
// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#fedb1f";
}

//--- TEMPLATE STUFF: Don't change 
clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}
//

// signature function
function touchMoved() {
 
  if( adventureManager.getStateName() === "scene8") {
    adventureManager.getCurrentStateRoom().sign();
  }

  // line(mouseX, mouseY, pmouseX, pmouseY);
  // return false;
}

/*function checkSelectAvatar() {
  // code to switch avatar animations
  if( key === '1') {
    playerAvatar.addMovingAnimation( 'assets/walking01.png', 'assets/walking06.png');
    playerAvatar.addStandingAnimation('assets/standing01.png', 'assets/standing02.png');
  }
    if( key === '2') {
   playerAvatar.addMovingAnimation( 'assets/walkingb01.png', 'assets/walkingb06.png');
   playerAvatar.addStandingAnimation('assets/standingb01.png', 'assets/standingb02.png');
  }
}*/

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

//-- MODIFY THIS:
// Change for your own instructions screen

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are exploring through the lens of a college student as you take on actions in becoming a social justice activist. By deciding to help the Save Our Schools Network, a network of child focused non-governmental organizations, church-based groups, and other stakeholders advocating for children's right to reducation. There is no goal to this game, but just a chance to explore various actions on might take on when volunteering. Use the ARROW keys to navigate your avatar around.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}
//-- MODIFY THIS: for your own classes
// NEW: NPCClass
var input, button, information;

class StartRoom extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Bahay", 400, 500, 'assets/bahay.png');
    this.npc1.addSingleInteraction("Mabuhay!");
    this.npc1.addSingleInteraction("Isn't it a beautiful day!");
    this.npc1.addSingleInteraction("I want some mango");

    // setup flag, seto false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-100);
      
      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }

}

class scene8Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Bahay", 400, 500, 'assets/bahay.png');
    this.npc1.addSingleInteraction("Mabuhay!");
    this.npc1.addSingleInteraction("Isn't it a beautiful day!");
    this.npc1.addSingleInteraction("I want some mango");

    this.pMouseX = [];
    this.pMouseY = [];
    this.mouseX = [];
    this.mouseY = [];
    
    fill(255);
    textAlign(CENTER);
    textSize(12);
    
    // setup flag, set it to false
    this.hasSetup = false;

    //customize your volunteer sheet
    input = createInput();
    input.position(1000, 495);
    input.hide();

    button = createButton("submit");
    button.position(input.x + input.width, 495);
    button.mousePressed(info);
    button.hide();

    information = createElement("h2", "Name");
    information.position(750, 480);
    information.hide();
  }

  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-100);

      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);

    // draw the signature
    strokeWeight(1);
    stroke(0);
    for( let i = 1; i < this.mouseX.length; i++ ) {
      line(this.pMouseX[i], this.pMouseY[i], this.mouseX[i], this.mouseY[i]);
    } 
  }

  // custom code here to do stuff upon exiting room
  unload() {
    console.log("unloading NPC Room")
    // reset NPC interaction to beginning when entering room

    input.hide();
    button.hide();
    information.hide();
    
    this.npc1.resetInteraction();
  }


  // custom code here to do stuff upon entering room
  load() {
    // pass to PNGRoom to load image
    super.load();

    input.show();
    button.show();
    information.show();

    console.log("loading NPC Room")
    
    // Add custom code here for unloading
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }

  sign() {
    // constrain to a specific region 
    if( mouseX > 740 && mouseX < 1200 && mouseY > 620 && mouseY < 715 ) {
   
      this.pMouseX.push(pmouseX);
      this.pMouseY.push(pmouseY);
      this.mouseX.push(mouseX);
      this.mouseY.push(mouseY);
    }
  }
}
//customized name is shown
function info() {
  const name = input.value();
  information.html(name);
  input.value("");
}

class scene9Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Bahay", 800, 400, 'assets/bahay.png');
    this.npc1.addSingleInteraction("Mabuhay!");
    this.npc1.addSingleInteraction("Isn't it a beautiful day!");
    this.npc1.addSingleInteraction("I want some mango");

    // setup flag, seto false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-100);
      
      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }

}

// globals because we are using them in  mouse pressed
var veggie = [];
var vegMouseX = [];
var vegMouseY = [];

class scene4Room extends PNGRoom {
  preload() {
    veggie[0] = loadImage("assets/veggie1.png");
    veggie[1] = loadImage("assets/veggie2.png");
    veggie[2] = loadImage("assets/veggie3.png");
    veggie[3] = loadImage("assets/veggie4.png");
  }

  draw() {
    push();
    // this calls PNGRoom.draw()
    
    /*if( this.hasSetup === false ) {
      let button = createButton("REPLANT");
     button.mousePressed(resetSketch);
      button.position(200, 200);
    }

    function resetSketch() {
      // if you click you will see that
      // reset() resets the translate back to the initial state
      // of the Graphics object
      veggie.reset();
    }*/

    super.draw();
      
    // Draw all the vegetables
    // for( let i = 0; i < veggie.length; i++ ) {
    //   image(veggie[i], vegMouseX[i], vegMouseY[i], 80,80);
    // }  

    imageMode(CENTER);
    for( let i = 0; i < vegMouseX.length; i++ ) {
      image(veggie[i%4], vegMouseX[i], vegMouseY[i], 80,80);
    }  
  
    pop();
  }
}

class scene1Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Bahay", 650, 200, 'assets/bahay.png');
    this.npc1.addSingleInteraction("Mabuhay!");
    this.npc1.addSingleInteraction("Isn't it a beautiful day!");
    this.npc1.addSingleInteraction("I want some mango");

    // setup flag, set to false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-100);
      
      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }

}

// control variables for grabbables
var grabbables = [];
var overlapCount = 0;
var preventPickup = false;        // for when you drop one
var preventRepickup = false;      // two objects

// Two things:
// (1) position in front of the avatar
// (2) if you have 1, it will swap
class scene2Room extends PNGRoom {
  preload() {
    grabbables.push(new StaticSprite("sign1", 800, 500, 'assets/sign1.png'));
    grabbables.push(new StaticSprite("sign2", 500, 500, 'assets/sign2.png'));
  
    this.isSetup = false;
  }

  draw() {
    // setup once
    if( this.isSetup === false ) {
      for( let i = 0; i < grabbables.length; i++ ) {
        grabbables[i].setup();
      }
      this.isSetup = true;
    }
    super.draw();

    drawSprite(playerAvatar.sprite);

    for( let i = 0; i < grabbables.length; i++ ) {
      drawSprite(grabbables[i].sprite);
    }

    // go through grabbables and attach 1 to avatar
    for( let i = 0; i < grabbables.length; i++ ) {
      if( playerAvatar.sprite.overlap(grabbables[i].sprite) ) {
         playerAvatar.setGrabbable(grabbables[i]);
      }
    }
  }

  keyPressed() {
    if( key === ' ') {
      if( playerAvatar.grabbable !== undefined ) {
        preventPickup = true;
        playerAvatar.clearGrabbable();
      }
    }
  }
}

class scene3Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Bahay", 800, 500, 'assets/bahay.png');
    this.npc1.addSingleInteraction("Mabuhay!");
    this.npc1.addSingleInteraction("Isn't it a beautiful day!");
    this.npc1.addSingleInteraction("I want some mango");

    // setup flag, set to false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-100);
      
      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }

}

class scene7Room extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.npc1 = new NPC("Bahay", 300, 200, 'assets/bahay.png');
    this.npc1.addSingleInteraction("Mabuhay!");
    this.npc1.addSingleInteraction("Isn't it a beautiful day!");
    this.npc1.addSingleInteraction("I want some mango");

    // setup flag, set to false
    this.hasSetup = false;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // Idea is to call the npc1.setup() function ONE time, so we use this kind of flag
    if( this.hasSetup === false ) {
      // setup NPC 1
      this.npc1.setup();
      this.npc1.setPromptLocation(0,-100);
      
      this.hasSetup = true; 
    }

    // this calls PNGRoom.draw()
    super.draw();

    // draw our NPCs
    drawSprite(this.npc1.sprite);

    // When you have multiple NPCs, you can add them to an array and have a function 
    // iterate through it to call this function for each more concisely.
    this.npc1.displayInteractPrompt(playerAvatar);
  }

  keyPressed() {
    if(key === ' ') {
      if(this.npc1.isInteracting(playerAvatar)) {
        this.npc1.continueInteraction();
      }
    }
  }
}

class scene6Room extends PNGRoom {
  preload() {
    this.trash = [];
    this.trash.push(new StaticSprite("trash1", 450, 100, 'assets/trash01.png'));
    this.trash.push(new StaticSprite("trash2", 450, 350, 'assets/trash02.png'));
    this.trash.push(new StaticSprite("trash3", 450, 700, 'assets/trash03.png'));
    this.trash.push(new StaticSprite("trash4", 500, 225, 'assets/trash04.png'));
    this.trash.push(new StaticSprite("trash5", 500, 575, 'assets/trash05.png'));
    this.trash.push(new StaticSprite("trash6", 600, 700, 'assets/trash06.png'));

    this.trashCollected = [];
    this.trashCollected.push(false);
    this.trashCollected.push(false);
    this.trashCollected.push(false);
    this.trashCollected.push(false);
    this.trashCollected.push(false);
    this.trashCollected.push(false);

    
    this.trashLoaded = false;
  }

  draw() {
    super.draw();

    // setup trash if tras not loaded in preload()
    if(this.trashLoaded === false) {
      for(let i = 0; i < this.trash.length; i++ ) {
        this.trash[i].setup();
      }
      this.trashLoaded = true;
    }

    // draws sprites that have not been collided yet
    for(let i = 0; i < this.trash.length; i++ ) {
      if(this.trashCollected[i] === false){
        drawSprite(this.trash[i].sprite);
      }
    }
    this.trashLoaded = true;

    // set collided trash to true
    for( let i = 0; i < this.trash.length; i++ ) {
      if( playerAvatar.sprite.overlap(this.trash[i].sprite) ) {
        this.trashCollected[i] = true;
      }
    }
  }
}

// ORIGINAL TEMPLATE FOR PNG ROOMS
//-- MODIFY THIS: for your own classes
// (1) copy this code block below
// (2) paste after //-- done copy
// (3) Change name of TemplateScreen to something more descriptive, e.g. "PuzzleRoom"
// (4) Add that name to the adventureStates.csv file for the classname for that appropriate room
class TemplateScreen extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
  }
}
//-- done copy