class Board {
  constructor() {
    this.hover = true;
    this.shipsPlaced = false;
    this.shipSelected = "1-2";
    this.rotated = false;
    this.init();
  }
  init = () => {
    $("#gameBoard").append(
      `<h2>Opponent Board</h2>
      <table cellspacing="1px" class='column opponent-board'></table>`
    );

    for (let i = 0; i < 10; i++) {
      $(".opponent-board").append(`<tr class="row-${i}"></tr>`);
      for (let j = 0; j < 10; j++) {
        $(`.row-${i}`).append(`<td name="tile" id=cell-${i}${j}></td>`);
        $(`#cell-${i}${j}`).append("<div class='piece'></div>");

        if (this.hover) {
          $(`#cell-${i}${j}`).mouseenter(() => {
            $(`#cell-${i}${j}`).addClass("hover");
          });
          $(`#cell-${i}${j}`).mouseleave(() => {
            $(`#cell-${i}${j}`).removeClass("hover");
          });
        }
      }
    }
    $("#gameBoard").append(
      `<h2>Your Board</h2>
      <table cellspacing="1px" class='column player-board'></table>`
    );

    for (let i = 0; i < 10; i++) {
      $(".player-board").append(`<tr class="prow-${i}"></tr>`);
      for (let j = 0; j < 10; j++) {
        $(`.prow-${i}`).append(
          `<td name="tile" class="player-cell" id=pcell-${i}${j}></td>`
        );
        $(`#pcell-${i}${j}`).append("<div class='piece'></div>");

        if (this.hover && !this.shipsPlaced) {
          $(`#pcell-${i}${j}`).mouseenter(() => {
            $(".player-cell").removeClass("hover");
            for (let k = 0; k < this.shipSelected[2]; k++) {
              if (this.rotated) {
                $(`#pcell-${i + k}${j}`).addClass("hover");
              } else {
                $(`#pcell-${i}${j + k}`).addClass("hover");
              }
            }
          });
        }
      }
    }
    $("#gameBoard").append(
      `<h2>Ships</h2>
      <h4>Selected Ship</h4>
      <h4 id="selected-ship">2</h4>
      <button id="rotate">Rotate</button><br>
      <div class="shipbtns">
        <button class='shipbtn' id='1-2'>2</button>
        <button class='shipbtn' id='2-3'>3</button>
        <button class='shipbtn' id='3-3'>3</button>
        <button class='shipbtn' id='4-4'>4</button>
        <button class='shipbtn' id='5-5'>5</button>
    </div>`
    );

    $("td").css({
      height: `30px`,
      width: `30px`,
    });
    $("#rotate").click(() => {
      this.rotated = !this.rotated;
    });

    $(".shipbtn").click((e) => {
      $("#selected-ship").text(e.target.id[2]);
      this.shipSelected = e.target.id;
    });
  };
}
