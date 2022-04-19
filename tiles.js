/* Functions */

/*Create tiles based on lesson*/
function makeTiles(tiles) {
  reset()
  if(lessonTilesProgress < lessonTilesProgressMax){
    nextButton.innerHTML = "Add "+lessonTiles[0].value
  } else{
    nextButton.innerHTML = ""
  }
  tiles.sort((a,b) => {
    let va = a.value.toLowerCase()
    vb = b.value.toLowerCase()
    if (va < vb){
      return -1
    }
    if (va > vb){
      return 1
    }
    return 0
  })
  tiles.sort((a,b) => {
    let va = a.sortkey
    vb = b.sortkey
    if (va < vb){
      return -1
    }
    if (va > vb){
      return 1
    }
    return 0
  })
  placementX = 5
  placementY = 5
  tiles.forEach((tile) => {
    tileCount = tile.quantity;
    tempcount = 0;
    while (tempcount < tileCount) {
      whiteboard = document.getElementById("tiles");
      newtile = document.createElement("p");
      newtile.setAttribute("class", "dragMe");
      newtile.setAttribute(
        "id",
        tile.value + "-" + tile.color + "-" + tempcount
      );
      newtile.setAttribute(
        "style",
        "background-color:" +
          tile.color +
          ";" +
          "border: 10px solid " +
          tile.color +
          ";"
      );
      newtile.innerHTML = tile.value.toLowerCase();
      whiteboard.appendChild(newtile);
      if (newtile.offsetWidth+5+placementX > screen.width){
        placementX = 5
        placementY = placementY+newtile.offsetHeight+5
      }
      newtile.style.left = placementX + "px";
      newtile.style.top = placementY + "px";
      tempcount = tempcount + 1;
    }
    placementX = placementX +newtile.offsetWidth+5
  });
  /*make iems with class "dragMe" moveable*/
  findMoveables("dragMe", "tiles");
}

/* Clears tiles off board*/
function reset(){
  document.getElementById('tiles').innerHTML = ''
}

/* makes element given as argument moveable*/
function makeMoveables(moveID, divID) {
  var dragItem = document.getElementById(moveID);
  var container = document.getElementById(divID);

  var active = false;
  var currentX;
  var currentY;
  var initialX;
  var initialY;
  var xOffset = 0;
  var yOffset = 0;

  container.addEventListener("touchstart", dragStart, false);
  container.addEventListener("touchend", dragEnd, false);
  container.addEventListener("touchmove", drag, false);

  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mouseup", dragEnd, false);
  container.addEventListener("mousemove", drag, false);

  function dragStart(e) {
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === dragItem) {
      active = true;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
  }

  function drag(e) {
    if (active) {
      e.preventDefault();

      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, dragItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
}

/* makes all elements with given class name movable if they have unique ids*/
function findMoveables(className, divID) {
  let moveIDcollection = document.getElementsByClassName(className);
  let moveIDarray = Array.from(moveIDcollection);
  moveIDarray.forEach((element) => {
    makeMoveables(element.id, divID);
  });
}

function updateTiles(){
  level = document.getElementById("levelSelect").value
  lesson = document.getElementById("lessonSelect").value
  levelTiles = tilesJSON[level]
  tiles = levelTiles[lesson]
  lessonTiles = tiles.filter(tile => tile.newtile)
  tiles = tiles.filter(tile => tile.newtile == false)
  lessonTilesProgress = 0
  lessonTilesProgressMax = parseInt(lessonTiles.length)
  makeTiles(tiles)
}

function updateLessonSelect(){
  level = document.getElementById("levelSelect").value
  lessonMenu = document.getElementById("lessonSelect")
  lessonMenu.innerHTML = ""
  lessons = tilesJSON[level]
  lessonKeys  = Object.keys(lessons)
  lessonKeys.forEach((lesson) => {
    option = document.createElement("option")
    option.setAttribute("value",lesson)
    option.innerHTML = "Lesson "+lesson
    lessonMenu.appendChild(option)
  })
}

function updateLevelSelect(){
  levelMenu = document.getElementById("levelSelect")
  levelMenu.innerHTML = ""
  levelKeys  = Object.keys(tilesJSON)
  levelKeys.forEach((level) => {
    option = document.createElement("option")
    option.setAttribute("value",level)
    option.innerHTML = "Level "+level
    levelMenu.appendChild(option)
  })
  updateLessonSelect()
}

function nextTile(){
  if(lessonTilesProgress < lessonTilesProgressMax){
    tiles.push(lessonTiles.shift())
    lessonTilesProgress += 1
    makeTiles(tiles)
    document.getElementById("next").innerHTML = "Add "+lessonTiles[0].value
  }
}

function fullscreen(){
  content = document.getElementById('content')
  if (document.fullscreenEnabled && full == false){
    content.requestFullscreen()
    document.getElementById("fullscreen").innerHTML = "Min"
    full = true
  } else{
    document.exitFullscreen()
    document.getElementById("fullscreen").innerHTML = "Max"
    full = false
  }
}

function wash(){
  makeTiles(tiles)
}

/* Main program */

level = 0
lesson = 0
lessonTilesProgress = 0
lessonTilesProgressMax = 0
lessonTiles = {}
tiles = {}
full = false
nextButton = document.getElementById("next")
fetch(
  "tiles_content.json"
)
  .then((tilesTMP) => {
    return tilesTMP.json();
  })
  .then((tiles) => {
    tilesJSON = tiles
    updateLevelSelect()
    updateTiles()
  });

document.getElementById('levelSelect').addEventListener('change',updateLessonSelect)
document.getElementById('levelSelect').addEventListener('change',updateTiles)
document.getElementById('lessonSelect').addEventListener('change',updateTiles)
window.addEventListener('resize',updateTiles)
document.getElementById("reset").addEventListener("click",updateTiles)
nextButton.addEventListener("click",nextTile)
document.getElementById("fullscreen").addEventListener('click',fullscreen)
document.getElementById("wash").addEventListener("click",wash)
