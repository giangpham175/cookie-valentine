//  BEGIN CANVAS HEARTS  --- Animated hearts forked from Gerard Ferrandez -  https://codepen.io/ge1doot/pen/OypQdy
//  I simply changed the background color and graphic to a heart.   Gerard is amazing.

var myPen = {};

(function () {
  "use strict";

  // main loop

  this.run = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.img,
      this.pointer.x - 100,
      this.pointer.y - 100,
      200,
      200
    );

    for (var i = 0; i < this.N; i++) {
      this.particles[i].run();
    }
  };

  // particles class

  var Particle = function (pen, size) {
    this.pX = pen.canvas.width * 0.5 + Math.random() * 200 - 100;
    this.pY = -size - Math.random() * 200;
    this.vX = 0;
    this.vY = Math.random();
    this.size = size;
    this.img = pen.img;
    this.pointer = pen.pointer;
    this.canvas = pen.canvas;
    this.ctx = pen.ctx;
  };

  Particle.prototype.run = function () {
    this.pY += this.vY;
    this.pX += this.vX;
    this.vY += 0.1;

    if (this.pY > this.canvas.height) {
      this.pY = -this.size;
      this.pX = this.canvas.width * 0.5 + Math.random() * 200 - 100;
      this.vY = 0;
      this.vX = 0;
    }

    var dx = this.pX - this.pointer.x,
      dy = this.pY - this.pointer.y,
      r = 100 + this.size * 0.5,
      d = dx * dx + dy * dy;

    if (d < r * r) {
      d = Math.sqrt(d);
      dx /= d;
      dy /= d;
      d = (r - d) * 1.1;
      dx *= d;
      dy *= d;

      this.pX += dx;
      this.pY += dy;

      this.vX = 0.5 * dx + (this.pX >= this.pointer.x ? 2 : -2);
      this.vY = 0.5 * dy;
    }

    this.ctx.drawImage(
      this.img,
      this.pX - this.size * 0.5,
      this.pY - this.size * 0.5,
      this.size,
      this.size
    );
  };

  // canvas

  this.canvas = {
    elem: document.createElement("canvas"),

    resize: function () {
      this.width = this.elem.width = this.elem.offsetWidth;
      this.height = this.elem.height = this.elem.offsetHeight;
    },

    init: function () {
      var ctx = this.elem.getContext("2d");
      document.body.appendChild(this.elem);
      window.addEventListener("resize", this.resize.bind(this), false);
      this.resize();
      return ctx;
    },
  };

  this.ctx = this.canvas.init();

  // pointer

  this.pointer = (function (canvas) {
    var pointer = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      pointer: function (e) {
        var touchMode = e.targetTouches,
          pointer;
        if (touchMode) {
          e.preventDefault();
          pointer = touchMode[0];
        } else pointer = e;
        this.x = pointer.clientX;
        this.y = pointer.clientY;
      },
    };

    window.addEventListener(
      "mousemove",
      function (e) {
        this.pointer(e);
      }.bind(pointer),
      false
    );
    canvas.elem.addEventListener(
      "touchmove",
      function (e) {
        this.pointer(e);
      }.bind(pointer),
      false
    );
    return pointer;
  })(this.canvas);

  // init

  this.particles = [];
  this.N = 800;
  this.img = new Image();
  this.img.src =
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/191814/heart_codepen.png";

  for (var i = 0; i < this.N; i++) {
    this.particles[i] = new Particle(this, 35);
  }

  // request animation loop
  var myPen = this;
  (function run() {
    requestAnimationFrame(run);
    myPen.run();
  })();
}).apply(myPen);

// END CANVAS HEARTS

// BEGIN AUDIOO PLAYER

$(function () {
  var audio = $("audio")[0];
  $("#opening_screen").on("click", function () {
    $("#opening_screen").addClass("roEdgeUpOut");

    $(".player_container").toggleClass("hidden roEdgeUpIn");
    //Play/pause the track
    if (audio.paused == false) {
      audio.pause();
      $("#btn-play-pause").children("i").removeClass("fa-pause");
      $("#btn-play-pause").children("i").addClass("fa-play");
    } else {
      audio.play();
      $("#btn-play-pause").children("i").removeClass("fa-play");
      $("#btn-play-pause").children("i").addClass("fa-pause");
    }
  });
  $("#btn-play-pause").on("click", function () {
    //Play/pause the track
    if (audio.paused == false) {
      audio.pause();
      $(this).children("i").removeClass("fa-pause");
      $(this).children("i").addClass("fa-play");
    } else {
      audio.play();
      $(this).children("i").removeClass("fa-play");
      $(this).children("i").addClass("fa-pause");
    }
  });

  $("#btn-stop").on("click", function () {
    //Stop the track
    audio.pause();
    audio.currentTime = 0;
    $("#btn-play-pause").children("i").removeClass("fa-pause");
    $("#btn-play-pause").children("i").addClass("fa-play");
  });

  $("#btn-mute").on("click", function () {
    //Mutes/unmutes the sound
    if (audio.volume != 0) {
      audio.volume = 0;
      $(this).children("i").removeClass("fa-volume-off");
      $(this).children("i").addClass("fa-volume-up");
    } else {
      audio.volume = 1;
      $(this).children("i").removeClass("fa-volume-up");
      $(this).children("i").addClass("fa-volume-off");
    }
  });

  function updateProgress() {
    //Updates the progress bar
    var progress = document.getElementById("progress");
    var value = 0;
    if (audio.currentTime > 0) {
      value = Math.floor((100 / audio.duration) * audio.currentTime);
    }
    progress.style.width = value + "%";
  }

  //Progress Bar event listener
  audio.addEventListener("timeupdate", updateProgress, false);
});
// END AUDIOO PLAYER

// BEGIN AUDIO SYNCHING
// Using jQuery to add event listener to the audio element and toggle classes based on the curren time.

var audioElement = document.getElementById("player");
var lastTime = 0;
audioElement.addEventListener("timeupdate", function (e) {
  var nowTime = this.currentTime;

  //Check if just passed the 1.4 second time mark.
  // if (nowTime > 1 && lastTime < 5) {

  // 	$("#peace h2").siblings().addClass('hidden').removeClass('pushSoftOut');
  // 	$("#heart").addClass('hidden').removeClass('pushSoftIn');

  // }

  // spent24hour
  if (nowTime > 0.5 && lastTime < 0.5) {
    $("#spent24hour").toggleClass("pushSoftIn hidden");
  }

  // spenttheweekend

  if (nowTime > 7.5 && lastTime < 7.5) {
    $("#spenttheweekend").toggleClass("pushSoftIn hidden");
    $("#spent24hour").toggleClass("pushSoftIn pushSoftOut");
  }

  // spentthelatenights
  if (nowTime > 15.3 && lastTime < 15.3) {
    $("#spentthelatenights").toggleClass("pushSoftIn hidden");
    $("#spenttheweekend").toggleClass("pushSoftIn pushSoftOut");
  }

  // allgoodbabe
  if (nowTime > 23 && lastTime < 23) {
    $("#allgoodbabe").toggleClass("pushSoftIn hidden");
    $("#spentthelatenights").toggleClass("pushSoftIn pushSoftOut");
  }

  // causegirlslike
  if (nowTime > 31 && lastTime < 31) {
    $("#causegirlslike").toggleClass("pushSoftIn hidden");
    $("#allgoodbabe").toggleClass("pushSoftIn pushSoftOut");
  }

  // tilsundown
  if (nowTime > 35 && lastTime < 35) {
    $("#tilsundown").toggleClass("pushSoftIn hidden");
    $("#causegirlslike").toggleClass("pushSoftIn pushSoftOut");
  }

  // lovefunand
  if (nowTime > 39 && lastTime < 39) {
    $("#lovefunand").toggleClass("pushSoftIn hidden");
    $("#tilsundown").toggleClass("pushSoftIn pushSoftOut");
  }

  // whatiwant
  if (nowTime > 42 && lastTime < 42) {
    $("#whatiwant").toggleClass("pushSoftIn hidden");
    $("#lovefunand").toggleClass("pushSoftIn pushSoftOut");
  }

  //  ineedagirllikeyou
  if (nowTime > 52 && lastTime < 52) {
    $("#ineedagirllikeyou").toggleClass("pushSoftIn hidden");
    $("#whatiwant").toggleClass("pushSoftIn pushSoftOut");
  }

  // spentlastnight
  if (nowTime > 62 && lastTime < 62) {
    $("#spentlastnight").toggleClass("pushSoftIn hidden");
    $("#ineedagirllikeyou").toggleClass("pushSoftIn pushSoftOut");
  }

  // dayup
  if (nowTime > 69 && lastTime < 69) {
    $("#dayup").toggleClass("pushSoftIn hidden");
    $("#spentlastnight").toggleClass("pushSoftIn pushSoftOut");
  }

  // spentthelatenights1
  if (nowTime > 77 && lastTime < 77) {
    $("#spentthelatenights1").toggleClass("pushSoftIn hidden");
    $("#dayup").toggleClass("pushSoftIn pushSoftOut");
  }

  // allgoodbabe1
  if (nowTime > 84 && lastTime < 84) {
    $("#allgoodbabe1").toggleClass("pushSoftIn hidden");
    $("#spentthelatenights1").toggleClass("pushSoftIn pushSoftOut");
  }

  // causegirlslike1
  if (nowTime > 91.5 && lastTime < 91.5) {
    $("#causegirlslike1").toggleClass("pushSoftIn hidden");
    $("#allgoodbabe1").toggleClass("pushSoftIn pushSoftOut");
  }

  // tilsundown1
  if (nowTime > 96 && lastTime < 96) {
    $("#tilsundown1").toggleClass("pushSoftIn hidden");
    $("#causegirlslike1").toggleClass("pushSoftIn pushSoftOut");
  }

  // lovefunand1
  if (nowTime > 101 && lastTime < 101) {
    $("#lovefunand1").toggleClass("pushSoftIn hidden");
    $("#tilsundown1").toggleClass("pushSoftIn pushSoftOut");
  }

  // whatiwant1
  if (nowTime > 104 && lastTime < 104) {
    $("#whatiwant1").toggleClass("pushSoftIn hidden");
    $("#lovefunand1").toggleClass("pushSoftIn pushSoftOut");
  }

  // ineedagirllikeyou1
  if (nowTime > 113 && lastTime < 113) {
    $("#ineedagirllikeyou1").toggleClass("pushSoftIn hidden");
    $("#whatiwant1").toggleClass("pushSoftIn pushSoftOut");
  }

  // maybe
  if (nowTime > 124 && lastTime < 124) {
    $("#maybe").toggleClass("pushSoftIn hidden");
    $("#ineedagirllikeyou1").toggleClass("pushSoftIn pushSoftOut");
  }

  // maybe1
  if (nowTime > 128 && lastTime < 128) {
    $("#maybe1").toggleClass("pushSoftIn hidden");
    $("#maybe").toggleClass("pushSoftIn pushSoftOut");
  }

  // maybe2
  if (nowTime > 132 && lastTime < 132) {
    $("#maybe2").toggleClass("pushSoftIn hidden");
    $("#maybe1").toggleClass("pushSoftIn pushSoftOut");
  }

  // maybe3
  if (nowTime > 136 && lastTime < 136) {
    $("#maybe3").toggleClass("pushSoftIn hidden");
    $("#maybe2").toggleClass("pushSoftIn pushSoftOut");
  }

  // causegirlslike2
  if (nowTime > 141 && lastTime < 141) {
    $("#causegirlslike2").toggleClass("pushSoftIn hidden");
    $("#maybe3").toggleClass("pushSoftIn pushSoftOut");
  }

  // tilsundown2
  if (nowTime > 144 && lastTime < 144) {
    $("#tilsundown2").toggleClass("pushSoftIn hidden");
    $("#causegirlslike2").toggleClass("pushSoftIn pushSoftOut");
  }

  // lovefunand2
  if (nowTime > 148 && lastTime < 148) {
    $("#lovefunand2").toggleClass("pushSoftIn hidden");
    $("#tilsundown2").toggleClass("pushSoftIn pushSoftOut");
  }

  // whatiwant2
  if (nowTime > 151 && lastTime < 151) {
    $("#whatiwant2").toggleClass("pushSoftIn hidden");
    $("#lovefunand2").toggleClass("pushSoftIn pushSoftOut");
  }

  // you
  if (nowTime > 156 && lastTime < 156) {
    $("#you").toggleClass("pushSoftIn hidden");
    $("#whatiwant2").toggleClass("pushSoftIn pushSoftOut");
  }

  // you
  if (nowTime > 160 && lastTime < 160) {
    $("#you").toggleClass("pushSoftIn pushSoftOut");
  }
  if (nowTime > 162 && lastTime < 162) {
    $("#bemine").toggleClass("roEdgeUpIn hidden");
  }

  lastTime = nowTime;
});
