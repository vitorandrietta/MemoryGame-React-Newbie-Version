import React, { Component } from 'react';
import bolvar from './BolvarFrodragon.jpg';
import deathWing from './DeathWing.jpg';
import ragnaros from './Ragnaros.png'
import nozdormu from './Nozdormu.jpg'
import sindragosa from './Sindragosa.jpg'
import lichKing from './TheLichKing.jpg'
import tirion from './TirionFordring.jpg'
import yoog from  './YoogSaron.jpg'
import cardBack from './CardBack.png'

const GameConstants = {
  gameImgs :
    [ bolvar
    , deathWing
    , nozdormu
    , ragnaros
    , sindragosa
    , lichKing
    , tirion
    , yoog
  ],

    cardBackImg : cardBack
}



function BoardCell(props){
    return (
      <div className="col col-lg-3 cr">
        <img src={props.imgPath} onClick={props.onClick}></img>
      </div>
    );
}



class Board extends React.Component {
  renderCell(i) {
    var imPath;

    if(this.props.cards[i].flipped) {
        imPath = this.props.cards[i].imgPath;
    }

    else{
      imPath = GameConstants.cardBackImg;
    }

    return(
      <BoardCell
      imgPath={imPath}
      onClick={() => this.props.onClick(i)}
      flipped = {this.props.cards[i].flipped}
      key={i}
      />
    );
  }

  render() {
        var rows = [];

        for (let i = 0; i< 4; i++){
          var cells = []
          for (let j = 0; j< 4; j++){
              cells.push(this.renderCell(i*4+j))
          }
          rows.push (<div className="row" key={"r"+i}>{cells}</div>)
        }

        return (
          <div className="board">
            {rows}
          </div>
        );
  }

}

class Game extends React.Component{
  constructor (props) {
    super(props);
    this.resetGame(false);
    this.checkGameOver = this.checkGameOver.bind(this);
    this.flipWrongPair = this.flipWrongPair.bind(this);
  }


  handleClick(i){
    const cards  = this.state.boardCards.slice();
    const firstPick = this.state.firstPick;
    const secondPick = this.state.secondPick;
    const isBoardLocked = this.state.boardLocked;

    if(cards[i].flipped || isBoardLocked){
      return;
    }

    cards[i].flipped = !cards[i].flipped

    if(firstPick == null){
      this.setState({
        boardCards : cards,
        firstPick  : cards[i],
        secondPick : secondPick,
        boardLocked : false
      })
    }

    else{

      this.setState({
        boardCards : cards,
        firstPick  : firstPick,
        secondPick : cards[i],
        boardLocked : true
      })

      if(firstPick.imgPath != cards[i].imgPath){
        setTimeout(this.flipWrongPair,1000);
      }

      else{
        this.setState({
          boardCards: cards,
          firstPick : null,
          secondPick: null,
          boardLocked: false
        })
      }

    }

  }


  flipWrongPair(){
    const cards  = this.state.boardCards.slice();
    const firstPick = this.state.firstPick;
    const secondPick = this.state.secondPick;
    var firstPickIndex = cards.indexOf(cards.filter(card => card.id == firstPick.id)[0]);
    var secondPickIndex = cards.indexOf(cards.filter(card => card.id == secondPick.id)[0]);

    cards[firstPickIndex].flipped = false;
    cards[secondPickIndex].flipped = false;

    this.setState({
      boardCards: cards,
      firstPick: null,
      secondPick: null,
      boardLocked: false
    })


  }




   imgPathToCard(imgPath){
     return {flipped: false, imgPath: imgPath}
  }


  shuffle (array) {
    var i = 0
      , j = 0
      , temp = null

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array;
  }

  generateBoard(imgsPath){
    var boardCards = GameConstants.gameImgs.map(this.imgPathToCard)
    boardCards = boardCards.concat(GameConstants.gameImgs.map(this.imgPathToCard))
    for(let i=0;i<16;++i){
      boardCards[i].id = i;
    }
    return this.shuffle(boardCards)
  }

  checkGameOver(){
    return this.state.boardCards.every(x => x.flipped)
  }

  resetGame(renderAgain){
    if(!renderAgain){
      this.state = ({
        boardCards : this.generateBoard(GameConstants.gameImgs),
        firstPick : null,
        secondPick : null,
        boardLocked: false
      })
    }
    else{
      this.setState ({
        boardCards : this.generateBoard(GameConstants.gameImgs),
        firstPick : null,
        secondPick : null,
        boardLocked: false
      });
    }
  }

  render(){
    const gameOver = this.checkGameOver();
    const boardCards = this.state.boardCards.slice();
    let status;

    if(gameOver){
      status = "Fim de Jogo";
    }

    else{
      status = "";
    }

    return(
      <div>
      <center><div><h2>{status}</h2></div></center>
        <div>
          <button className="btn btn primary"
          onClick={() => this.resetGame(true)}>
          Reset
        </button>
        </div>
        <div>
        <Board
          cards = {boardCards}
          onClick = {(i) => this.handleClick(i)}
        />
        </div>
      </div>
    );


  }

}
export default Game;
