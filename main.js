const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      suits = ['♠', '♥', '♣', '♦'];

const cardModel = document.createElement('div');
cardModel.classList.add('card');

const dealer = document.getElementById("dealer"),
  player = document.getElementById("player"),
  hitButton = document.getElementById("hit-button"),
  passButton = document.getElementById("pass-button"),
  buttonContainer = document.getElementById("button-container"),
  notice = document.getElementById("notice"),
  nextHandButton = document.getElementById("next-hand-button");
      

let deck = [],
    allDecks = [],
    dealerHand = [],
    playerHand = [];
    
const createDeck = () => {
  suits.forEach((suit) => {
    values.forEach((value) => {
      const card = suit + value;
      deck.push(card);
    })
  })
  return deck ;
}

const addDeks = (num) => {
  for (let i = 0; i < num; i++) {
    const newDeck = createDeck();
    allDecks = [...newDeck];
  }
} 
addDeks(8);


const selectRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * allDecks.length),
        card = allDecks[Math.floor(Math.random() * allDecks.length)];
  allDecks.splice(randomIndex, 1);
  return card;
}

const dealHands = () => {
  dealerHand = [selectRandomCard(), selectRandomCard()];
  dealerHand.forEach((card, index) => {
    const newCard = cardModel.cloneNode(true);
    index === 0 ? newCard.classList.add('back') : newCard.innerHTML = card;
    (card[0] === '♥' || card[0] === '♦') && newCard.setAttribute('data-red', true);
    dealer.append(newCard);
  });
  playerHand = [selectRandomCard(), selectRandomCard()];
  playerHand.forEach((card) => {
    const newCard = cardModel.cloneNode(true);
    newCard.innerHTML = card;
    (card[0] === '♥' || card[0] === '♦') && newCard.setAttribute('data-red', true);
    player.append(newCard);
  });
}
dealHands();

const calcValue = (hand) => {
  let value = 0,
      hasAce = 0;

  hand.forEach((card) => {
    if (card.length === 2) {
      if (card[1] === 'A') {
        hasAce += 1
      } else {
        (card[1] === 'K' || card[1] === 'Q' || card[1] === 'J')
          ? value += 10 : value += Number(card[1]);
      }
    } else {
      value += 10;
    }
  })
  if (hasAce > 0) {
    value + 11 > 21 ? value += 1 : value += 11;
    value += (hasAce - 1) * 1;
  }
  return value;
}

const hitPlayer = () => {
  const newCard = selectRandomCard();
  playerHand.push(newCard);
  const newCardNode = cardModel.cloneNode(true);
  newCardNode.innerHTML = newCard;
  player.append(newCardNode);
  const handValue = calcValue(playerHand);
  dealerValue = calcValue(dealerHand);
  if (handValue > 21) {
    alert('BUST, You loose');
  }
}

const decideWinner = async () => {
  dealerValue = await calcValue(dealerHand);
  playerValue = await calcValue(playerHand);
  alert(`Dealer has ${dealerValue} | You have ${playerValue}`);
  if (dealerValue === playerValue) {
    alert('Push');
  } else {
    dealerValue > playerValue ? alert('You loose') : alert('You WIN!');
  }
}  
  
const hitDealer = async() => {
  const hiddenCard = dealer.children[0];
  hiddenCard.classList.remove('back');
  hiddenCard.innerHTML = dealerHand[0];

  let handValue = await calcValue(dealerHand);
  if (handValue < 16) {
    let newCard = selectRandomCard();
    dealerHand.push(newCard);
    const newCardNode = cardModel.cloneNode(true);
  newCardNode.innerHTML = newCard;
  dealer.append(newCardNode);
  handValue = await calcValue(dealerHand);
  }
  if (handValue < 16) {
  hitDealer();
  } else if (handValue === 21 && calcValue(playerHand) < 21) {
  alert('Dealer has Black Jack, You loose');
  } else if (handValue > 21) {
  alert('Dealer BUST, You WIN!');
  } else {
    decideWinner();
  }
}

hitButton.addEventListener('click', hitPlayer);
passButton.addEventListener('click', hitDealer);
nextHandButton.addEventListener('click', () => window.location.reload());


