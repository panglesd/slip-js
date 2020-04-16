export default class {
  constructor(engine) {
    // this.engine = engine; // For now this is useless given the usage of controller

    let speedMove = 1;

    let ev_keypress = ev => {
      switch (ev.key) {
        case "f":
          speedMove = ((speedMove + 4) % 30) + 1;
          break;
        case "r":
          engine.getCurrentSlip().refresh();
          break;
        case "#":
          document.querySelectorAll(".slip").forEach(slip => {
            slip.style.zIndex = "-1";
          });
          document.querySelectorAll(".background-canvas").forEach(canvas => {
            canvas.style.zIndex = "1";
          });
      }
    };

    let ev_keydown = ev => {
      let openWindowHeight = engine.getOpenWindowHeight();
      let openWindowWidth = engine.getOpenWindowWidth();
      switch (ev.key) {
        case "l": // Bas
          engine.moveWindowRelative(0, speedMove / openWindowHeight, 0, 0, 0.1);
          break;
        case "o": // Haut
          engine.moveWindowRelative(0, -speedMove / openWindowHeight, 0, 0, 0.1);
          break;
        case "k": // Gauche
          engine.moveWindowRelative(-speedMove / openWindowWidth, 0, 0, 0, 0.1);
          break;
        case "m": // Droite
          engine.moveWindowRelative(speedMove / openWindowWidth, 0, 0, 0, 0.1);
          break;
        case "i": // Rotate
          engine.moveWindowRelative(0, 0, 0, 1, 0.1);
          break;
        case "p": //Unrotate
          engine.moveWindowRelative(0, 0, 0, -1, 0.1);
          break;
        case "z": // Zoom
          engine.moveWindowRelative(0, 0, 0.01, 0, 0.1);
          break;
        case "Z": // Unzoom
          engine.moveWindowRelative(0, 0, -0.01, 0, 0.1);
          break;
        case "T":
          engine.showToC();
          break;
        case "t":
          // todo: hideToC ?
          document.querySelector(".toc-slip").style.display =
            document.querySelector(".toc-slip").style.display == "none" ? "block" : "none";
          break;
        case "ArrowRight":
          console.log(ev);
          if (ev.shiftKey) engine.nextSlip();
          else engine.next();
          break;
        case "ArrowLeft":
          if (ev.shiftKey) engine.previousSlip();
          else engine.previous();
          break;
        case "ArrowUp":
          engine.pop();
      }
    };

    document.addEventListener("keypress", ev_keypress);
    document.addEventListener("keydown", ev_keydown);
  }
}
