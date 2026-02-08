let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector(".resetbtn");
let newbtn = document.querySelector("#newbtn");
let msgcontainar = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true;

const winpattern = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// ================= RESET GAME =================
const resetGame = () => {
  turnO = true;

  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });

  msgcontainar.classList.add("hide");

  // STOP CELEBRATION
  document.body.classList.remove("celebrate");
};

// ================= BOX CLICK =================
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return;

    if (turnO) {
      box.innerText = "O";
      turnO = false;
    } else {
      box.innerText = "X";
      turnO = true;
    }

    box.disabled = true;

    checkwinner();
  });
});

// ================= DISABLE =================
const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

// ================= SHOW WINNER =================
const showwinner = (winner) => {
  msg.innerText = `🎉 Winner is ${winner}`;
  msgcontainar.classList.remove("hide");

  // START CELEBRATION
  document.body.classList.add("celebrate");

  disableBoxes();
};

// ================= CHECK WINNER =================
const checkwinner = () => {
  for (let pattern of winpattern) {
    let pos1 = boxes[pattern[0]].innerText;
    let pos2 = boxes[pattern[1]].innerText;
    let pos3 = boxes[pattern[2]].innerText;

    if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
      if (pos1 === pos2 && pos2 === pos3) {
        showwinner(pos1);
        return;
      }
    }
  }
};

// ================= BUTTON EVENTS =================
newbtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = (Math.random() * canvas.height) / 2;

    this.speed = 5;
    this.particles = [];
    this.exploded = false;
  }

  update() {
    if (!this.exploded) {
      this.y -= this.speed;

      if (this.y <= this.targetY) {
        this.explode();
        this.exploded = true;
      }
    }

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0) this.particles.splice(i, 1);
    });
  }

  explode() {
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        life: 60,
      });
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, 2, 10);
    }

    this.particles.forEach((p) => {
      ctx.fillStyle = `hsl(${Math.random() * 360},100%,50%)`;
      ctx.fillRect(p.x, p.y, 3, 3);
    });
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();

    if (fw.exploded && fw.particles.length === 0) {
      fireworks.splice(i, 1);
    }
  });

  requestAnimationFrame(animateFireworks);
}

animateFireworks();

// ===== START SKY CELEBRATION =====
function startFireworks() {
  setInterval(() => {
    fireworks.push(new Firework());
  }, 500);
}
