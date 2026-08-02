import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

const SAVE_KEY = "wizbits-save-v1";
const USERS_KEY = "wizbits-users-v1";
const CURRENT_USER_KEY = "wizbits-current-user-v1";
const BATTLE_POINTS_RESET_KEY = "wizbits-battle-points-reset-v1";
const MAX_HP = 3;
const BOARD_SIZE = 6;
const MIN_CHAIN = 3;
const ELEMENTS = {
  fire: { label: "Fire", icon: "F", color: 0xf65b32, move: "Flare Pounce" },
  water: { label: "Water", icon: "W", color: 0x2d9eea, move: "Splash Rush" },
  electric: { label: "Electric", icon: "E", color: 0xf1c232, move: "Spark Dash" },
  grass: { label: "Grass", icon: "G", color: 0x55b947, move: "Leaf Tackle" },
};
const ELEMENT_KEYS = Object.keys(ELEMENTS);
const STRONG_AGAINST = {
  fire: "grass",
  grass: "electric",
  electric: "water",
  water: "fire",
};
const WIN_XP = 28;
const WIN_COINS = 12;
const ADVENTURE_WIN_PET_SEEDS = 2;
const PET_SEEDS_TO_GROW = 10;
const MATCHMAKING_BATTLE_POINTS = 50;
const DAILY_BATTLE_POINT_CAP = 150;
const PET_XP_PACK_COST = 150;
const PET_XP_PACK_AMOUNT = 1000;
const PET_SEEDS_PACK_COST = 150;
const PET_SEEDS_PACK_AMOUNT = 10;
const MAX_PROFILE_HEARTS = 3;
const HEART_COST = 20;
const AVATARS = ["Fox", "Bunny", "Tiger", "Panda", "Penguin", "Bee", "Deer", "Parrot"];
const MASCOT_PRICE = 200;
const BATTLE_PET_PRICE = 150;
const DEFAULT_MASCOT = "classic";
const SHOP_MASCOTS = ["crystal-dragon", "leaf-panda", "moon-bunny", "sun-lion", "sky-koala"];
const SHOP_BATTLE_PETS = {
  "kindle-lion": {
    name: "Kindle",
    kind: "Lion",
    element: "fire",
    model: "animal-lion.glb",
    body: 0xf47c48,
    ear: 0x8f3f31,
    accent: 0xffffff,
  },
  "blaze-tiger": {
    name: "Blaze",
    kind: "Tiger",
    element: "fire",
    model: "animal-tiger.glb",
    body: 0xff8f3d,
    ear: 0x7b4f2b,
    accent: 0xffffff,
  },
  "ember-fox": {
    name: "Ember",
    kind: "Fox",
    element: "fire",
    model: "animal-fox.glb",
    body: 0xff6f3c,
    ear: 0x8f3f31,
    accent: 0xfff1d6,
  },
  "scorch-hog": {
    name: "Scorch",
    kind: "Hog",
    element: "fire",
    model: "animal-hog.glb",
    body: 0xe85d35,
    ear: 0x7b4f2b,
    accent: 0xfff1d6,
  },
  "aqua-penguin": {
    name: "Aqua",
    kind: "Penguin",
    element: "water",
    model: "animal-penguin.glb",
    body: 0x8bd3ff,
    ear: 0x4f8fc9,
    accent: 0xffffff,
  },
  "spark-bee": {
    name: "Spark",
    kind: "Bee",
    element: "electric",
    model: "animal-bee.glb",
    body: 0xf3c84a,
    ear: 0x263238,
    accent: 0xffffff,
  },
  "bolt-monkey": {
    name: "Bolt",
    kind: "Monkey",
    element: "electric",
    model: "animal-monkey.glb",
    body: 0xf1c232,
    ear: 0x7b4f2b,
    accent: 0xffffff,
  },
  "leaf-deer": {
    name: "Leaf",
    kind: "Deer",
    element: "grass",
    model: "animal-deer.glb",
    body: 0x63d471,
    ear: 0x7b4f2b,
    accent: 0xf7ffd4,
  },
};
const PET_RANKS = {
  domestic: { label: "Domestic", xpBoost: 1, hpBoost: 0, scale: 0.76 },
  legendary: { label: "Legendary", xpBoost: 1.5, hpBoost: 1, scale: 0.88 },
  mythical: { label: "Mythical", xpBoost: 2, hpBoost: 2, scale: 1 },
};
const TYPE_RANKS = {
  1: { label: "Novice", attackBonus: 0 },
  2: { label: "Prime", attackBonus: 1 },
  3: { label: "Master", attackBonus: 2 },
};
const ADVENTURE_SEQUENCE = ["forest", "number-beach", "puzzle-park", "pet-camp", "boss-trail"];
const ADVENTURE_LEVEL_COUNTS = {
  forest: 22,
  "number-beach": 28,
  "puzzle-park": 28,
  "pet-camp": 28,
  "boss-trail": 28,
};

const KNOCKOUTS_TO_WIN = 3;
const MODEL_ROOT = "assets/pets/kenney-cube";

const canvas = document.querySelector("#game-canvas");
const loginScreen = document.querySelector("#login-screen");
const playerNameInput = document.querySelector("#player-name");
const playerPasswordInput = document.querySelector("#player-password");
const loginButton = document.querySelector("#login-button");
const loginModeButton = document.querySelector("#login-mode-button");
const loginTitle = document.querySelector("#login-title");
const loginMessage = document.querySelector("#login-message");
const xpLabel = document.querySelector("#xp-label");
const coinsLabel = document.querySelector("#coins-label");
const battlePointsLabel = document.querySelector("#battle-points-label");
const globalBattlePointsLabel = document.querySelector("#global-battle-points");
const avatarLabel = document.querySelector("#avatar-label");
const profileNameLabel = document.querySelector("#profile-name");
const heartLabel = document.querySelector("#heart-label");
const backpackButton = document.querySelector("#backpack-button");
const homeMyPetsButton = document.querySelector("#home-my-pets-button");
const homeGrowPetsButton = document.querySelector("#home-grow-pets-button");
const homeBattleFriendButton = document.querySelector("#home-battle-friend-button");
const shopButton = document.querySelector("#shop-button");
const buyHeartButton = document.querySelector("#buy-heart-button");
const logoutButton = document.querySelector("#logout-button");
const playerTeamEl = document.querySelector("#player-team");
const rivalTeamEl = document.querySelector("#rival-team");
const loadScreen = document.querySelector("#load-screen");
const challengeScreen = document.querySelector("#challenge-screen");
const eventsScreen = document.querySelector("#events-screen");
const modeScreen = document.querySelector("#mode-screen");
const hud = document.querySelector("#hud");
const loadChallengesButton = document.querySelector("#load-challenges");
const loadEventsButton = document.querySelector("#load-events");
const loadPlayButton = document.querySelector("#load-play");
const blankScreen = document.querySelector("#blank-screen");
const blankBackButton = document.querySelector("#blank-back");
const matchmakingButton = document.querySelector("#matchmaking-button");
const leaderboardButton = document.querySelector("#leaderboard-button");
const battleShopButton = document.querySelector("#battle-shop-button");
const playChallengesButton = document.querySelector("#play-challenges-button");
const playEventsButton = document.querySelector("#play-events-button");
const myPetsButton = document.querySelector("#my-pets-button");
const growPetsButton = document.querySelector("#grow-pets-button");
const battleFriendButton = document.querySelector("#battle-friend-button");
const growPetsScreen = document.querySelector("#grow-pets-screen");
const growPetsBackButton = document.querySelector("#grow-pets-back");
const growPetsCountButton = document.querySelector("#grow-pets-count");
const growPetsMessage = document.querySelector("#grow-pets-message");
const friendBattleScreen = document.querySelector("#friend-battle-screen");
const friendBattleBackButton = document.querySelector("#friend-battle-back");
const friendList = document.querySelector("#friend-list");
const friendCodeLabel = document.querySelector("#friend-code");
const friendCodeInput = document.querySelector("#friend-code-input");
const friendBattleMessage = document.querySelector("#friend-battle-message");
const quizModeButton = document.querySelector("#quiz-mode-button");
const heartShopScreen = document.querySelector("#heart-shop-screen");
const heartShopBackButton = document.querySelector("#heart-shop-back");
const heartShopBuyButton = document.querySelector("#heart-shop-buy");
const heartShopBalance = document.querySelector("#heart-shop-balance");
const shopScreen = document.querySelector("#shop-screen");
const shopBackButton = document.querySelector("#shop-back");
const shopBalance = document.querySelector("#shop-balance");
const shopEmptyMessage = document.querySelector("#shop-empty-message");
const shopPetEmptyMessage = document.querySelector("#shop-pet-empty-message");
const buyPetXpPackButton = document.querySelector("#buy-pet-xp-pack-button");
const buyPetSeedsPackButton = document.querySelector("#buy-pet-seeds-pack-button");
const battleShopMessage = document.querySelector("#battle-shop-message");
const petSeedsShopMessage = document.querySelector("#pet-seeds-shop-message");
const backpackScreen = document.querySelector("#backpack-screen");
const backpackBackButton = document.querySelector("#backpack-back");
const backpackClassicButton = document.querySelector("#backpack-classic-button");
const buyMascotButtons = [...document.querySelectorAll(".buy-mascot-button")];
const buyBattlePetButtons = [...document.querySelectorAll(".buy-battle-pet-button")];
const backpackMascotButtons = [...document.querySelectorAll(".backpack-mascot-button")];
const loadMascot = document.querySelector("#load-mascot");
const myPetsScreen = document.querySelector("#my-pets-screen");
const myPetsBackButton = document.querySelector("#my-pets-back");
const myTeamGrid = document.querySelector("#my-team-grid");
const ownedPetsGrid = document.querySelector("#owned-pets-grid");
const quizScreen = document.querySelector("#quiz-screen");
const quizBackButton = document.querySelector("#quiz-back");
const leaderboardScreen = document.querySelector("#leaderboard-screen");
const leaderboardBackButton = document.querySelector("#leaderboard-back");
const leaderboardList = document.querySelector("#leaderboard-list");
const quizScore = document.querySelector("#quiz-score");
const quizDiagram = document.querySelector("#quiz-diagram");
const quizQuestion = document.querySelector("#quiz-question");
const quizAnswers = document.querySelector("#quiz-answers");
const quizMessage = document.querySelector("#quiz-message");
const adventureButton = document.querySelector("#adventure-button");
const adventureOptions = document.querySelector("#adventure-options");
const forestPathButton = document.querySelector("#forest-path-button");
const forestLevels = document.querySelector("#forest-levels");
const numberBeachButton = document.querySelector("#number-beach-button");
const puzzleParkButton = document.querySelector("#puzzle-park-button");
const petCampButton = document.querySelector("#pet-camp-button");
const bossTrailButton = document.querySelector("#boss-trail-button");
const adventureLevels = document.querySelector("#adventure-levels");
const homeBotBattleButton = document.querySelector("#home-bot-battle");
const homeFriendBattleButton = document.querySelector("#home-friend-battle");
const challengeTwoButton = document.querySelector("#challenge-two");
const challengeFourButton = document.querySelector("#challenge-four");
const challengeSixButton = document.querySelector("#challenge-six");
const challengeEightButton = document.querySelector("#challenge-eight");
const challengeBackButton = document.querySelector("#challenge-back");
const eventsBackButton = document.querySelector("#events-back");
const eventLevelOneButton = document.querySelector("#event-level-1");
const eventLevelTwoButton = document.querySelector("#event-level-2");
const eventLevelThreeButton = document.querySelector("#event-level-3");
const eventLevelFourButton = document.querySelector("#event-level-4");
const eventLevelFiveButton = document.querySelector("#event-level-5");
const modeOnePlayerButton = document.querySelector("#mode-one-player");
const modeTwoPlayerButton = document.querySelector("#mode-two-player");
const modeBackButton = document.querySelector("#mode-back");
const messageEl = document.querySelector("#message");
const turnLabel = document.querySelector("#turn-label");
const boardEl = document.querySelector("#element-board");
const mathPanel = document.querySelector("#math-panel");
const mathDiagram = document.querySelector("#math-diagram");
const mathQuestionEl = document.querySelector("#math-question");
const mathAnswersEl = document.querySelector("#math-answers");
const rewardPanel = document.querySelector("#reward-panel");
const rewardSummary = document.querySelector("#reward-summary");
const rewardBackButton = document.querySelector("#reward-back-button");
const onePlayerButton = document.querySelector("#one-player-button");
const twoPlayerButton = document.querySelector("#two-player-button");
const retryButton = document.querySelector("#retry-button");
const battleBackButton = document.querySelector("#battle-back-button");
const resetButton = document.querySelector("#reset-button");

const state = {
  currentUser: null,
  avatar: null,
  friendCode: null,
  friends: [],
  friendBattleRequestTo: null,
  ownedMascots: [DEFAULT_MASCOT],
  equippedMascot: DEFAULT_MASCOT,
  ownedBattlePets: [],
  activePetByElement: {},
  leaderboardPoints: 0,
  dailyBattlePoints: { date: todayKey(), earned: 0 },
  petSeeds: 0,
  xp: 0,
  coins: 0,
  hearts: MAX_PROFILE_HEARTS,
  battleHearts: MAX_PROFILE_HEARTS,
  petStats: createDefaultPetStats(),
  typeLevels: createDefaultTypeLevels(),
  playerKnockouts: 0,
  rivalKnockouts: 0,
  playerTeam: createPlayerTeam(),
  rivalTeam: createRivalTeam(),
  gameMode: "two",
  activeSide: "player",
  board: [],
  chain: [],
  dragging: false,
  selectedTarget: null,
  challengeMode: false,
  matchmakingMode: false,
  battleSource: "normal",
  challengePetCount: 2,
  eventMode: false,
  eventLevel: null,
  finalBossMode: false,
  shopReturnTo: "home",
  challengeReturnTo: "home",
  eventsReturnTo: "home",
  friendBattleReturnTo: "home",
  adventureProgress: createDefaultAdventureProgress(),
  selectedTargets: {
    player: null,
    rival: null,
  },
  attacksSinceMath: {
    player: 0,
    rival: 0,
  },
  pendingMathRetry: {
    player: false,
    rival: false,
  },
  mathChallenge: null,
  mathTimerId: null,
  mathTimeLeft: 10,
  quizTimerId: null,
  quizTimeLeft: 20,
  battleActive: false,
  animating: false,
  threeReady: false,
  myPetsReturnTo: "home",
  quizQuestion: null,
  quizCorrect: 0,
  quizTotal: 0,
};

let scene;
let camera;
let renderer;
let clock;
let world;
let playerPetMeshes = [];
let rivalPetMeshes = [];
let mixers = [];
let rebuildToken = 0;
let slotRockGroup;
const gltfLoader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let authMode = "login";
let saveTimer;

loadSave();
resetTeams();
fillBoard();
renderHud();
renderBoard();
setupThreeScene();

loginButton.addEventListener("click", loginPlayer);
loginModeButton.addEventListener("click", toggleAuthMode);
for (const input of [playerNameInput, playerPasswordInput]) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loginPlayer();
  });
}
logoutButton.addEventListener("click", logoutPlayer);
buyHeartButton.addEventListener("click", () => showHeartShop());
backpackButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  showBackpack();
});
homeMyPetsButton.addEventListener("click", () => showMyPets("home"));
homeGrowPetsButton.addEventListener("click", () => showGrowPets());
homeBattleFriendButton.addEventListener("click", () => showFriendBattleSetup("home"));
shopButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  showShop();
});
shopBackButton.addEventListener("click", () => {
  shopScreen.hidden = true;
  if (state.shopReturnTo === "blank") {
    blankScreen.hidden = false;
    setBlankMenuButtonsHidden(false);
  } else {
    loadScreen.hidden = false;
  }
  state.shopReturnTo = "home";
  renderBattlePoints();
});
backpackBackButton.addEventListener("click", () => {
  backpackScreen.hidden = true;
  loadScreen.hidden = false;
});
for (const button of buyMascotButtons) {
  button.addEventListener("click", () => buyOrEquipMascot(button.dataset.mascot));
}
for (const button of buyBattlePetButtons) {
  button.addEventListener("click", () => buyBattlePet(button.dataset.pet));
}
buyPetXpPackButton.addEventListener("click", () => buyPetXpPack());
buyPetSeedsPackButton.addEventListener("click", () => buyPetSeedsPack());
backpackClassicButton.addEventListener("click", () => {
  state.equippedMascot = DEFAULT_MASCOT;
  saveGame();
  renderHud();
});
for (const button of backpackMascotButtons) {
  button.addEventListener("click", () => equipOwnedMascot(button.dataset.mascot));
}
homeBotBattleButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  clearAdventureBattle();
  state.matchmakingMode = false;
  state.battleSource = "normal";
  state.challengeMode = false;
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  startBattle("one", "normal");
});
homeFriendBattleButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  clearAdventureBattle();
  state.matchmakingMode = false;
  state.battleSource = "normal";
  state.challengeMode = false;
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  startBattle("two", "normal");
});
loadPlayButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  setBlankMenuButtonsHidden(false);
  loadScreen.hidden = true;
  blankScreen.hidden = false;
  renderBattlePoints();
});
blankBackButton.addEventListener("click", () => {
  blankScreen.hidden = true;
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = true;
  setBlankMenuButtonsHidden(false);
  loadScreen.hidden = false;
});
myPetsButton.addEventListener("click", () => showMyPets("blank"));
growPetsButton.addEventListener("click", () => showGrowPets());
battleFriendButton.addEventListener("click", () => showFriendBattleSetup("blank"));
playChallengesButton.addEventListener("click", () => showChallengeScreen("blank"));
playEventsButton.addEventListener("click", () => showEventsScreen("blank"));
growPetsCountButton.addEventListener("click", () => growPetWithSeeds());
growPetsBackButton.addEventListener("click", () => {
  growPetsScreen.hidden = true;
  blankScreen.hidden = false;
  setBlankMenuButtonsHidden(false);
  renderBattlePoints();
});
friendBattleBackButton.addEventListener("click", () => {
  friendBattleScreen.hidden = true;
  if (state.friendBattleReturnTo === "blank") {
    blankScreen.hidden = false;
    setBlankMenuButtonsHidden(false);
    renderBattlePoints();
  } else {
    loadScreen.hidden = false;
  }
});
friendCodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addFriendByCode();
});
leaderboardButton.addEventListener("click", () => showLeaderboard());
battleShopButton.addEventListener("click", () => showShop("blank"));
matchmakingButton.addEventListener("click", () => startMatchmakingBattle());
document.addEventListener("click", (event) => {
  if (event.target.closest("#matchmaking-button")) {
    event.preventDefault();
    startMatchmakingBattle();
  }
});
function startMatchmakingBattle() {
  clearAdventureBattle();
  state.matchmakingMode = true;
  state.battleSource = "matchmaking";
  state.challengeMode = false;
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  quizScreen.hidden = true;
  myPetsScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  blankScreen.hidden = true;
  startBattle("one", "matchmaking");
}
window.startMatchmakingBattle = startMatchmakingBattle;

function showFriendBattleSetup(returnTo = "home") {
  if (!requireLogin()) return;
  state.friendBattleReturnTo = returnTo;
  if (!state.friendCode) {
    state.friendCode = makeUniqueFriendCode(readUsers(), state.currentUser);
    saveGame();
  }
  friendCodeLabel.textContent = `CODE ${state.friendCode}`;
  friendCodeInput.value = "";
  friendBattleMessage.textContent = "Enter a friend's code.";
  renderFriendList();
  loadScreen.hidden = true;
  blankScreen.hidden = true;
  friendBattleScreen.hidden = false;
}

function addFriendByCode() {
  const code = friendCodeInput.value.trim();
  if (!code) return;
  const users = readUsers();
  const entry = Object.entries(users).find(([, profile]) => profile?.friendCode === code);
  if (!entry) {
    friendBattleMessage.textContent = "No player found with that code.";
    return;
  }
  const [username, profile] = entry;
  if (username === state.currentUser) {
    friendBattleMessage.textContent = "That is your code.";
    return;
  }
  if (!state.friends.some((friend) => friend.username === username)) {
    state.friends.push({ username, friendCode: profile.friendCode });
    saveGame();
  }
  friendCodeInput.value = "";
  friendBattleMessage.textContent = `${username} added to your list.`;
  renderFriendList();
}

function renderFriendList() {
  friendList.replaceChildren();
  if (state.friends.length === 0) {
    const empty = document.createElement("p");
    empty.className = "friend-list-empty";
    empty.textContent = "Friend list is empty.";
    friendList.append(empty);
    return;
  }

  for (const friend of state.friends) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "friend-row";
    const name = document.createElement("strong");
    name.textContent = friend.username;
    const code = document.createElement("span");
    code.textContent = `Account ${friend.friendCode}`;
    row.append(name, code);
    row.addEventListener("click", () => requestFriendBattle(friend));
    friendList.append(row);
  }
}

function requestFriendBattle(friend) {
  state.friendBattleRequestTo = friend.username;
  friendBattleMessage.textContent = `Battle request sent to ${friend.username}.`;
  renderFriendList();
}

function makeFriendCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function makeUniqueFriendCode(users, currentUser) {
  const usedCodes = new Set(
    Object.entries(users)
      .filter(([username]) => username !== currentUser)
      .map(([, profile]) => profile?.friendCode)
      .filter(Boolean),
  );
  for (let tries = 0; tries < 100; tries += 1) {
    const code = makeFriendCode();
    if (!usedCodes.has(code)) return code;
  }
  return `${Date.now()}`.slice(-6);
}

function startFriendBattle() {
  clearAdventureBattle();
  state.matchmakingMode = false;
  state.battleSource = "normal";
  state.challengeMode = false;
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  blankScreen.hidden = true;
  startBattle("two", "normal");
}

quizModeButton.addEventListener("click", () => showQuizMode());
blankScreen.addEventListener("click", (event) => {
  if (event.target.closest("#quiz-mode-button")) showQuizMode();
});
document.addEventListener("click", (event) => {
  if (event.target.closest("#quiz-mode-button")) {
    event.preventDefault();
    showQuizMode();
  }
});
myPetsBackButton.addEventListener("click", () => {
  myPetsScreen.hidden = true;
  if (state.myPetsReturnTo === "blank") {
    setBlankMenuButtonsHidden(false);
    blankScreen.hidden = false;
  } else {
    loadScreen.hidden = false;
  }
});
leaderboardBackButton.addEventListener("click", () => {
  leaderboardScreen.hidden = true;
  setBlankMenuButtonsHidden(false);
  blankScreen.hidden = false;
});
quizBackButton.addEventListener("click", () => {
  clearQuizTimer();
  quizScreen.hidden = true;
  setBlankMenuButtonsHidden(false);
  blankScreen.hidden = false;
});
heartShopBackButton.addEventListener("click", () => {
  heartShopScreen.hidden = true;
  loadScreen.hidden = false;
});
heartShopBuyButton.addEventListener("click", () => buyHeart());
adventureButton.addEventListener("click", () => {
  updateAdventureLocks();
  setBlankMenuButtonsHidden(true);
  adventureOptions.hidden = false;
  forestLevels.hidden = true;
  adventureLevels.hidden = true;
});
forestPathButton.addEventListener("click", () => {
  setBlankMenuButtonsHidden(true);
  populateLevels(forestLevels, 22, "forest");
  adventureOptions.hidden = true;
  forestLevels.hidden = false;
  adventureLevels.hidden = true;
});
numberBeachButton.addEventListener("click", () => {
  if (!isAdventureUnlocked("number-beach")) {
    numberBeachButton.textContent = "Number Beach Locked";
    window.setTimeout(updateAdventureLocks, 900);
    return;
  }
  setBlankMenuButtonsHidden(true);
  populateLevels(adventureLevels, 28, "number-beach");
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = false;
});
puzzleParkButton.addEventListener("click", () => {
  setBlankMenuButtonsHidden(true);
  populateLevels(adventureLevels, 28, "puzzle-park");
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = false;
});
petCampButton.addEventListener("click", () => {
  setBlankMenuButtonsHidden(true);
  populateLevels(adventureLevels, 28, "pet-camp");
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = false;
});
bossTrailButton.addEventListener("click", () => {
  setBlankMenuButtonsHidden(true);
  populateLevels(adventureLevels, 28, "boss-trail");
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = false;
});

function populateLevels(container, count, zone) {
  container.replaceChildren();
  const progress = getAdventureProgress(zone);
  for (let level = 1; level <= count; level += 1) {
    const button = document.createElement("button");
    button.type = "button";
    const locked = level > progress.highestUnlocked;
    const complete = Boolean(progress.completedLevels[level]);
    button.disabled = locked;
    button.textContent = zone === "boss-trail" && level === count
      ? "Final Boss"
      : `${complete ? "Done " : locked ? "Locked " : ""}Level ${level}`;
    button.addEventListener("click", () => startAdventureBattle(zone, level));
    container.append(button);
  }
}

function startAdventureBattle(zone, level) {
  if (level > getAdventureProgress(zone).highestUnlocked) return;
  state.matchmakingMode = false;
  state.battleSource = "adventure";
  state.challengeMode = false;
  state.eventMode = false;
  state.finalBossMode = zone === "boss-trail" && level === 28;
  state.adventureZone = zone;
  state.adventureLevel = level;
  blankScreen.hidden = true;
  startBattle("one", "adventure");
}

function clearAdventureBattle() {
  state.adventureZone = null;
  state.adventureLevel = null;
}

function setBlankMenuButtonsHidden(hidden) {
  adventureButton.hidden = hidden;
  matchmakingButton.hidden = hidden;
  leaderboardButton.hidden = hidden;
  battleShopButton.hidden = hidden;
  playChallengesButton.hidden = hidden;
  playEventsButton.hidden = hidden;
  quizModeButton.hidden = hidden;
  myPetsButton.hidden = hidden;
  growPetsButton.hidden = hidden;
  battleFriendButton.hidden = hidden;
}

function updateAdventureLocks() {
  const adventureButtons = [
    [forestPathButton, "forest", "Forest Path"],
    [numberBeachButton, "number-beach", "Number Beach"],
    [puzzleParkButton, "puzzle-park", "Puzzle Park"],
    [petCampButton, "pet-camp", "Pet Camp"],
    [bossTrailButton, "boss-trail", "Boss Trail"],
  ];
  for (const [button, zone, label] of adventureButtons) {
    const unlocked = isAdventureUnlocked(zone);
    button.disabled = !unlocked;
    button.textContent = unlocked ? label : `${label} (Locked)`;
  }
}
modeOnePlayerButton.addEventListener("click", () => {
  clearAdventureBattle();
  state.challengeMode = false;
  state.matchmakingMode = false;
  state.battleSource = "normal";
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  modeScreen.hidden = true;
  startBattle("one", "normal");
});
modeTwoPlayerButton.addEventListener("click", () => {
  clearAdventureBattle();
  state.challengeMode = false;
  state.matchmakingMode = false;
  state.battleSource = "normal";
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  modeScreen.hidden = true;
  startBattle("two", "normal");
});
modeBackButton.addEventListener("click", () => {
  modeScreen.hidden = true;
  loadScreen.hidden = false;
});
loadChallengesButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  showChallengeScreen("home");
});
challengeTwoButton.addEventListener("click", () => startChallengeBattle(2));
challengeFourButton.addEventListener("click", () => startChallengeBattle(4));
challengeSixButton.addEventListener("click", () => startChallengeBattle(6));
challengeEightButton.addEventListener("click", () => startChallengeBattle(8));
challengeBackButton.addEventListener("click", () => {
  if (state.challengeReturnTo === "blank") {
    challengeScreen.hidden = true;
    blankScreen.hidden = false;
    setBlankMenuButtonsHidden(false);
    renderBattlePoints();
  } else {
    showHomeScreen();
  }
});
loadEventsButton.addEventListener("click", () => {
  if (!requireLogin()) return;
  showEventsScreen("home");
});
eventsBackButton.addEventListener("click", () => {
  eventsScreen.hidden = true;
  if (state.eventsReturnTo === "blank") {
    blankScreen.hidden = false;
    setBlankMenuButtonsHidden(false);
    renderBattlePoints();
  } else {
    loadScreen.hidden = false;
  }
});
eventLevelOneButton.addEventListener("click", () => startEventBattle(1));
eventLevelTwoButton.addEventListener("click", () => startEventBattle(2));
eventLevelThreeButton.addEventListener("click", () => startEventBattle(3));
eventLevelFourButton.addEventListener("click", () => startEventBattle(4));
eventLevelFiveButton.addEventListener("click", () => startEventBattle(5));
onePlayerButton.addEventListener("click", () => {
  clearAdventureBattle();
  state.matchmakingMode = false;
  startBattle("one", "normal");
});
twoPlayerButton.addEventListener("click", () => {
  clearAdventureBattle();
  state.matchmakingMode = false;
  startBattle("two", "normal");
});
retryButton.addEventListener("click", () => startBattle(state.gameMode));
battleBackButton.addEventListener("click", () => backToAdventureLevels());
rewardBackButton.addEventListener("click", () => backToAdventureLevels());
resetButton.addEventListener("click", resetSave);
boardEl.addEventListener("pointermove", moveChain);
boardEl.addEventListener("pointerup", finishChain);
boardEl.addEventListener("pointercancel", cancelChain);
boardEl.addEventListener("pointerleave", finishChain);
document.addEventListener("pointerdown", choosePetFromScene, true);
window.addEventListener("resize", resizeRenderer);

function setupThreeScene() {
  try {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9fe5ff);

    camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5.2, 8.6);
    camera.lookAt(0, 1.05, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    clock = new THREE.Clock();
    world = createWorld();
    scene.add(world);
    rebuildPetMeshes();

    state.threeReady = true;
    animate();
  } catch (error) {
    console.error("Three.js scene failed to start:", error);
    messageEl.textContent = "The battle UI is ready, but this browser could not start the 3D scene.";
  }
}

function createWorld() {
  const group = new THREE.Group();
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(4, 7, 5);
  group.add(sun);
  group.add(new THREE.AmbientLight(0xffffff, 1.25));

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(5.6, 6.2, 0.25, 64),
    new THREE.MeshStandardMaterial({ color: 0x6fd16d, roughness: 0.82 }),
  );
  ground.position.y = -0.18;
  ground.scale.z = 0.78;
  group.add(ground);

  slotRockGroup = new THREE.Group();
  group.add(slotRockGroup);
  updateSlotRocks();

  return group;
}

function createPlayerTeam() {
  return [
    makePet("Cinder", "Fox", "fire", "animal-fox.glb", 0xf47c48, 0x7b4f2b, 0xffffff),
    makePet("Splash", "Fish", "water", "animal-fish.glb", 0x5fb9ff, 0x2373a8, 0xffffff),
    makePet("Volt", "Bunny", "electric", "animal-bunny.glb", 0xffd65c, 0x9b6b21, 0xffffff),
    makePet("Sprout", "Beaver", "grass", "animal-beaver.glb", 0x62c370, 0x2f7d4f, 0xf0d27a),
  ];
}

function createRivalTeam() {
  return [
    makePet("Ember", "Cat", "fire", "animal-cat.glb", 0xff8f70, 0x8f3f31, 0xffffff),
    makePet("Ripple", "Penguin", "water", "animal-penguin.glb", 0x8bd3ff, 0x4f8fc9, 0xffffff),
    makePet("Jolt", "Parrot", "electric", "animal-parrot.glb", 0xf3c84a, 0x4c658a, 0xffffff),
    makePet("Clover", "Panda", "grass", "animal-panda.glb", 0x63d471, 0x3a9d52, 0xf7ffd4),
  ];
}

function createBossRivalTeam() {
  return [
    ...createRivalTeam(),
    makePet("Blaze", "Tiger", "fire", "animal-tiger.glb", 0xf47c48, 0x8f3f31, 0xffffff),
    makePet("Storm", "Bee", "electric", "animal-bee.glb", 0xf3c84a, 0x263238, 0xffffff),
  ];
}

function createFinalBossRivalTeam() {
  return [
    ...createBossRivalTeam(),
    makePet("Tundra", "Polar", "water", "animal-polar.glb", 0x8bd3ff, 0x4f8fc9, 0xffffff),
    makePet("Thorn", "Deer", "grass", "animal-deer.glb", 0x63d471, 0x7b4f2b, 0xf7ffd4),
  ];
}

function createChallengeRivalTeam() {
  return [
    ...createFinalBossRivalTeam(),
    makePet("Boulder", "Elephant", "grass", "animal-elephant.glb", 0x63d471, 0x4f8f56, 0xf7ffd4),
    makePet("Bolt", "Monkey", "electric", "animal-monkey.glb", 0xf3c84a, 0x7b4f2b, 0xffffff),
    makePet("Marina", "Crab", "water", "animal-crab.glb", 0x5fb9ff, 0x2373a8, 0xffffff),
    makePet("Kindle", "Lion", "fire", "animal-lion.glb", 0xf47c48, 0x8f3f31, 0xffffff),
  ];
}

function makePet(name, kind, element, model, body, ear, accent) {
  const id = `${name}-${kind}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    id,
    name,
    kind,
    element,
    model: `${MODEL_ROOT}/${model}`,
    hp: MAX_HP,
    maxHp: MAX_HP,
    xp: 0,
    rank: PET_RANKS.domestic.label,
    typeRank: TYPE_RANKS[1].label,
    attackBonus: 0,
    body,
    ear,
    accent,
    animations: {
      idle: "idle",
      attack: "run",
      hit: "gesture-negative",
      victory: "dance",
      positive: "gesture-positive",
    },
  };
}

function createFinalBossPet() {
  return [makePet("Titan", "Tiger", "fire", "animal-tiger.glb", 0xf47c48, 0x8f3f31, 0xffffff)];
}

function resetTeams() {
  state.playerTeam = createPlayerTeam();
  applyOwnedBattlePetsToTeam(state.playerTeam);
  applyPetStatsToTeam(state.playerTeam);
  state.rivalTeam = createRivalTeam();
}

function applyOwnedBattlePetsToTeam(team) {
  const ownedPetIds = state.ownedBattlePets.filter((petId) => SHOP_BATTLE_PETS[petId]);
  for (const element of ELEMENT_KEYS) {
    const activeId = state.activePetByElement[element];
    const activePet = createOwnedPetById(activeId);
    const fallbackPetId = [...ownedPetIds].reverse().find((petId) => SHOP_BATTLE_PETS[petId].element === element);
    const replacement = activePet ?? createOwnedPetById(fallbackPetId);
    if (!replacement) continue;
    const index = team.findIndex((pet) => pet.element === element);
    if (index >= 0) team[index] = replacement;
  }
}

function createOwnedPetById(petId) {
  if (!petId) return null;
  const starter = createPlayerTeam().find((pet) => pet.id === petId);
  if (starter) return starter;
  const catalogPet = SHOP_BATTLE_PETS[petId];
  if (!catalogPet || !state.ownedBattlePets.includes(petId)) return null;
  return makePet(
    catalogPet.name,
    catalogPet.kind,
    catalogPet.element,
    catalogPet.model,
    catalogPet.body,
    catalogPet.ear,
    catalogPet.accent,
  );
}

function showChallengeScreen(returnTo = "home") {
  state.challengeReturnTo = returnTo;
  loadScreen.hidden = true;
  blankScreen.hidden = true;
  challengeScreen.hidden = false;
}

function showEventsScreen(returnTo = "home") {
  if (!requireLogin()) return;
  state.eventsReturnTo = returnTo;
  loadScreen.hidden = true;
  blankScreen.hidden = true;
  eventsScreen.hidden = false;
}

function showHomeScreen() {
  clearQuizTimer();
  canvas.hidden = true;
  hud.hidden = true;
  loadScreen.hidden = false;
  challengeScreen.hidden = true;
  eventsScreen.hidden = true;
  modeScreen.hidden = true;
  blankScreen.hidden = true;
  heartShopScreen.hidden = true;
  shopScreen.hidden = true;
  backpackScreen.hidden = true;
  myPetsScreen.hidden = true;
  leaderboardScreen.hidden = true;
  quizScreen.hidden = true;
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = true;
  if (state.currentUser) loginScreen.hidden = true;
}

function startChallengeBattle(petCount) {
  clearAdventureBattle();
  state.matchmakingMode = false;
  state.battleSource = "challenge";
  state.challengeMode = true;
  state.eventMode = false;
  state.finalBossMode = false;
  state.challengePetCount = petCount;
  challengeScreen.hidden = true;
  startBattle("one", "challenge");
}

function startEventBattle(level) {
  clearAdventureBattle();
  state.matchmakingMode = false;
  state.battleSource = "event";
  state.challengeMode = false;
  state.eventMode = true;
  state.finalBossMode = false;
  state.challengePetCount = 2;
  state.eventLevel = level;
  eventsScreen.hidden = true;
  startBattle("one", "event");
}

function rebuildPetMeshes() {
  if (!scene) return;
  rebuildToken += 1;
  const currentToken = rebuildToken;
  updateSlotRocks();

  for (const mesh of [...playerPetMeshes, ...rivalPetMeshes]) scene.remove(mesh);
  mixers = [];

  playerPetMeshes = state.playerTeam.map((pet, index) => {
    const mesh = createPetMesh(pet);
    mesh.userData.pet = pet;
    mesh.userData.side = "player";
    const slot = playerSlots()[index];
    mesh.position.set(slot.x, 0.1, slot.z);
    mesh.scale.setScalar(meshScaleForPet(pet, pet === firstAlivePet(state.playerTeam)));
    scene.add(mesh);
    loadPetModel(pet, mesh, currentToken, 0.46);
    return mesh;
  });

  rivalPetMeshes = state.rivalTeam.map((pet, index) => {
    const mesh = createPetMesh(pet);
    mesh.userData.pet = pet;
    mesh.userData.side = "rival";
    const slot = rivalSlots()[index];
    mesh.position.set(slot.x, 0.1, slot.z);
    mesh.scale.setScalar(meshScaleForPet(pet, pet === firstAlivePet(state.rivalTeam)));
    mesh.rotation.y = -0.35;
    scene.add(mesh);
    loadPetModel(pet, mesh, currentToken, 0.46);
    return mesh;
  });
}

function updateSlotRocks() {
  if (!slotRockGroup) return;
  slotRockGroup.clear();
  const slots = [
    ...playerSlots(),
    ...rivalSlots().slice(0, state.rivalTeam.length),
  ];

  for (const slot of slots) {
    const rock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.62, 0.18, 24),
      new THREE.MeshStandardMaterial({ color: 0xaeb2b8, roughness: 0.9 }),
    );
    rock.position.set(slot.x, 0.02, slot.z);
    rock.scale.z = 0.75;
    slotRockGroup.add(rock);
  }
}

function loadPetModel(pet, holder, token, scale) {
  gltfLoader.load(
    pet.model,
    (gltf) => {
      if (token !== rebuildToken) return;

      const fallback = holder.getObjectByName("fallbackModel");
      if (fallback) holder.remove(fallback);

      const model = gltf.scene;
      model.name = "kenneyModel";
      model.scale.setScalar(1);
      model.position.set(0, 0, 0);
      model.traverse((child) => {
        child.userData.petHolder = holder;
      });
      holder.add(model);

      const mixer = new THREE.AnimationMixer(model);
      const actions = {};
      for (const clip of gltf.animations) {
        actions[clip.name] = mixer.clipAction(clip);
      }

      holder.userData.pet = pet;
      holder.userData.actions = actions;
      holder.userData.mixer = mixer;
      mixers.push(mixer);
      playPetAnimation(holder, pet.animations.idle);
      console.info(`Loaded Kenney pet model: ${pet.name} (${pet.model})`);
    },
    undefined,
    (error) => {
      console.warn(`Falling back for ${pet.name}; failed to load ${pet.model}`, error);
    },
  );
}

function playerSlots() {
  return [
    { x: -3.5, z: -1.55 },
    { x: -2.45, z: -0.45 },
    { x: -3.35, z: 0.75 },
    { x: -2.2, z: 1.65 },
  ];
}

function rivalSlots() {
  return [
    { x: 3.5, z: -1.55 },
    { x: 2.45, z: -0.45 },
    { x: 3.35, z: 0.75 },
    { x: 2.2, z: 1.65 },
    { x: 4.05, z: -0.25 },
    { x: 3.9, z: 1.45 },
    { x: 4.25, z: -1.2 },
    { x: 4.35, z: 0.75 },
    { x: 1.65, z: -1.45 },
    { x: 1.55, z: 0.95 },
    { x: 4.75, z: -0.75 },
    { x: 4.75, z: 1.8 },
  ];
}

function createPetMesh(pet) {
  const group = new THREE.Group();
  const fallback = new THREE.Group();
  fallback.name = "fallbackModel";
  const bodyMat = new THREE.MeshStandardMaterial({ color: pet.body, roughness: 0.55 });
  const earMat = new THREE.MeshStandardMaterial({ color: pet.ear, roughness: 0.7 });
  const accentMat = new THREE.MeshStandardMaterial({ color: pet.accent, roughness: 0.45 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.5 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 20), bodyMat);
  body.scale.set(1, 0.86, 0.88);
  body.position.y = 0.55;
  fallback.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 20), bodyMat);
  head.position.set(0, 1.05, 0.08);
  fallback.add(head);

  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 14), accentMat);
  muzzle.scale.set(1.25, 0.75, 0.75);
  muzzle.position.set(0, 0.98, 0.39);
  fallback.add(muzzle);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), darkMat);
  nose.position.set(0, 1.02, 0.54);
  fallback.add(nose);

  addEye(fallback, -0.14, darkMat);
  addEye(fallback, 0.14, darkMat);
  addAnimalDetails(fallback, pet.kind, earMat, accentMat);
  fallback.traverse((child) => {
    child.userData.petHolder = group;
  });
  group.add(fallback);
  addHealthBar(group);

  return group;
}

function addHealthBar(group) {
  const bar = new THREE.Group();
  bar.name = "healthBar";
  bar.position.set(0, 1.75, 0);

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.09, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x263238 }),
  );
  const fill = new THREE.Mesh(
    new THREE.BoxGeometry(0.84, 0.055, 0.045),
    new THREE.MeshBasicMaterial({ color: 0x2ecc71 }),
  );
  fill.name = "healthFill";
  fill.position.z = 0.01;
  bar.add(back, fill);
  group.add(bar);
}

function addEye(group, x, material) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), material);
  eye.position.set(x, 1.14, 0.43);
  group.add(eye);
}

function addAnimalDetails(group, kind, earMat, accentMat) {
  if (kind === "Bunny") {
    addLongEar(group, -0.18, earMat);
    addLongEar(group, 0.18, earMat);
    return;
  }

  if (kind === "Turtle") {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.43, 20, 14), accentMat);
    shell.scale.set(1.25, 0.5, 1);
    shell.position.set(0, 0.58, -0.16);
    group.add(shell);
    return;
  }

  if (kind === "Bird") {
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 16), earMat);
    beak.position.set(0, 1.0, 0.58);
    beak.rotation.x = Math.PI / 2;
    group.add(beak);
    return;
  }

  if (kind === "Frog") {
    addEye(group, -0.23, earMat);
    addEye(group, 0.23, earMat);
    return;
  }

  addEar(group, -0.3, earMat);
  addEar(group, 0.3, earMat);
}

function addEar(group, x, material) {
  const ear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 18), material);
  ear.position.set(x, 1.39, 0);
  ear.rotation.z = x < 0 ? 0.4 : -0.4;
  group.add(ear);
}

function addLongEar(group, x, material) {
  const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.46, 8, 14), material);
  ear.position.set(x, 1.48, 0);
  ear.rotation.z = x < 0 ? 0.18 : -0.18;
  group.add(ear);
}

function startBattle(mode = "two", source = state.battleSource || "normal") {
  if (!state.finalBossMode && state.hearts <= 0) {
    renderProfileBadge();
    loginMessage.textContent = `You need a heart to battle. Buy one for ${HEART_COST} Wiz Bucks.`;
    loadScreen.hidden = false;
    challengeScreen.hidden = true;
    eventsScreen.hidden = true;
    blankScreen.hidden = true;
    return;
  }
  state.battleSource = source;
  state.matchmakingMode = source === "matchmaking";
  loadScreen.hidden = true;
  canvas.hidden = false;
  hud.hidden = false;
  const previousPlayerTargetName = state.selectedTargets.player?.name ?? state.selectedTarget?.name;
  const previousRivalTargetName = state.selectedTargets.rival?.name;
  resetTeams();
  if (state.finalBossMode) {
    state.rivalTeam = createFinalBossPet();
    state.rivalTeam[0].hp = 2000;
    state.rivalTeam[0].maxHp = 2000;
  } else if (state.eventMode && state.eventLevel === 5) {
    state.rivalTeam = createFinalBossRivalTeam();
  } else if (state.eventMode && state.eventLevel === 3) {
    state.rivalTeam = createBossRivalTeam();
  }
  if (state.challengeMode) {
    state.rivalTeam = createChallengeRivalTeam().slice(0, state.challengePetCount);
  }
  state.gameMode = mode;
  state.battleHearts = state.finalBossMode ? 4 : state.hearts;
  state.playerKnockouts = 0;
  state.rivalKnockouts = 0;
  state.activeSide = "player";
  fillBoard();
  state.battleActive = true;
  state.animating = false;
  state.chain = [];
  state.dragging = false;
  state.attacksSinceMath = { player: 0, rival: 0 };
  state.pendingMathRetry = { player: false, rival: false };
  state.mathChallenge = null;
  clearMathTimer();
  state.selectedTargets.player =
    state.rivalTeam.find((pet) => pet.name === previousPlayerTargetName && pet.hp > 0) ??
    firstAlivePet(state.rivalTeam);
  state.selectedTargets.rival =
    state.playerTeam.find((pet) => pet.name === previousRivalTargetName && pet.hp > 0) ??
    firstAlivePet(state.playerTeam);
  state.selectedTarget = state.selectedTargets.player;
  onePlayerButton.hidden = true;
  twoPlayerButton.hidden = true;
  retryButton.hidden = true;
  battleBackButton.hidden = true;
  mathPanel.hidden = true;
  rewardPanel.hidden = true;
  startPlayerTurn();
  rebuildPetMeshes();
  renderHud();
  renderBoard();
}

function fillBoard() {
  state.board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => randomElement()),
  );
}

function renderBoard(matchedTiles = []) {
  boardEl.replaceChildren();
  const matchedKeys = new Set(matchedTiles.map((tile) => tileKey(tile.row, tile.col)));
  const chainKeys = new Set(state.chain.map((tile) => tileKey(tile.row, tile.col)));

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const element = state.board[row][col];
      const button = document.createElement("button");
      button.type = "button";
      button.className = `element-tile ${element}`;
      button.textContent = ELEMENTS[element].icon;
      button.setAttribute("aria-label", `${ELEMENTS[element].label} tile`);
      button.disabled =
        !state.battleActive ||
        state.animating ||
        Boolean(state.mathChallenge) ||
        (state.gameMode === "one" && state.activeSide === "rival");
      if (chainKeys.has(tileKey(row, col))) button.classList.add("chain");
      if (matchedKeys.has(tileKey(row, col))) button.classList.add("matched");
      button.dataset.row = row;
      button.dataset.col = col;
      button.addEventListener("pointerdown", (event) => beginChain(event, row, col));
      boardEl.append(button);
    }
  }
}

function beginChain(event, row, col) {
  if (!state.battleActive || state.animating) return;
  if (state.gameMode === "one" && state.activeSide === "rival") return;
  event.preventDefault();
  boardEl.setPointerCapture?.(event.pointerId);
  state.dragging = true;
  state.chain = [{ row, col }];
  const element = state.board[row][col];
  messageEl.textContent = `Connect ${ELEMENTS[element].label} tiles. Release to attack.`;
  renderBoard();
}

function moveChain(event) {
  if (!state.dragging || !state.battleActive || state.animating) return;
  event.preventDefault();

  const tileButton = document.elementFromPoint(event.clientX, event.clientY)?.closest(".element-tile");
  if (!tileButton || !boardEl.contains(tileButton)) return;

  const row = Number(tileButton.dataset.row);
  const col = Number(tileButton.dataset.col);
  extendChain(row, col);
}

function extendChain(row, col) {
  const tile = { row, col };
  const lastTile = state.chain[state.chain.length - 1];
  if (!lastTile || sameTile(lastTile, tile)) return;

  const existingIndex = state.chain.findIndex((chainTile) => sameTile(chainTile, tile));
  if (existingIndex !== -1) {
    state.chain = state.chain.slice(0, existingIndex + 1);
    renderBoard();
    return;
  }

  const chainElement = state.board[state.chain[0].row][state.chain[0].col];
  const tileElement = state.board[row][col];
  if (!areNeighbors(lastTile, tile) || tileElement !== chainElement) {
    return;
  }

  state.chain.push(tile);
  messageEl.textContent = `${state.chain.length} ${ELEMENTS[chainElement].label} tiles connected.`;
  renderBoard();
}

async function finishChain(event) {
  if (!state.dragging) return;
  event?.preventDefault();
  state.dragging = false;

  if (state.chain.length >= MIN_CHAIN) {
    await resolveChain();
    return;
  }

  state.chain = [];
  messageEl.textContent = "Connect at least 3 matching adjacent tiles.";
  renderBoard();
}

function cancelChain() {
  state.dragging = false;
  state.chain = [];
  renderBoard();
}

async function resolveChain() {
  if (state.mathChallenge) return;
  state.animating = true;
  state.dragging = false;
  const matches = [...state.chain];
  const attackElement = state.board[matches[0].row][matches[0].col];
  state.chain = [];

  const target = selectedTargetForActiveSide();
  if (!target) {
    state.animating = false;
    renderBoard();
    return;
  }

  renderBoard(matches);
  await resolveAttack(state.activeSide, attackElement, matches.length, target);
  state.attacksSinceMath[state.activeSide] += 1;
  clearAndRefill(matches);
  await wait(180);
  renderBoard();

  if (checkBattleEnd()) {
    return;
  }

  if (state.gameMode === "one" && state.activeSide === "player") {
    if (state.attacksSinceMath.player >= 2) {
      state.attacksSinceMath.player = 0;
      state.animating = false;
      startMathChallenge();
      return;
    }

    await resolveAiTurn();
    state.animating = false;
    if (!checkBattleEnd()) startPlayerTurn();
    return;
  }

  state.animating = false;
  switchTurn();
}

function startMathChallenge() {
  clearMathTimer();
  state.mathChallenge = makeMathQuestion();
  state.mathTimeLeft = 10;
  turnLabel.textContent = `${activePlayerName()} math check`;
  messageEl.textContent = "Answer this math question. You cannot attack this turn.";
  updateMathQuestionText();
  renderMathDiagram();
  mathAnswersEl.replaceChildren();
  mathPanel.hidden = false;

  for (const answer of state.mathChallenge.answers) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => answerMathQuestion(answer));
    mathAnswersEl.append(button);
  }

  renderBoard();
  state.mathTimerId = window.setInterval(() => {
    state.mathTimeLeft -= 1;
    updateMathQuestionText();

    if (state.mathTimeLeft <= 0) {
      answerMathQuestion(null);
    }
  }, 1000);
}

async function answerMathQuestion(answer) {
  if (!state.mathChallenge || state.animating) return;

  clearMathTimer();
  const correct = answer === state.mathChallenge.correctAnswer;
  state.pendingMathRetry[state.activeSide] = !correct;
  state.mathChallenge = null;
  mathPanel.hidden = true;
  state.animating = true;
  turnLabel.textContent = `${activePlayerName()} math check`;
  messageEl.textContent = correct
    ? "Correct. Your next turn can attack again."
    : answer === null
      ? "Time ran out. Your turn is over."
      : "Not quite. Your turn is over.";

  await wait(450);
  if (state.gameMode === "one" && state.activeSide === "player") {
    await resolveAiTurn();
    state.animating = false;
    if (!checkBattleEnd()) startPlayerTurn();
    return;
  }

  state.animating = false;
  switchTurn();
}

function updateMathQuestionText() {
  if (!state.mathChallenge) return;
  mathQuestionEl.textContent = `${state.mathChallenge.text}  (${state.mathTimeLeft}s)`;
}

function renderMathDiagram() {
  renderQuestionDiagram(mathDiagram, state.mathChallenge?.diagram);
}

function renderQuestionDiagram(container, diagram) {
  container.replaceChildren();
  if (!diagram) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  if (diagram.type === "rectangle") {
    const shape = document.createElement("div");
    shape.className = "diagram-rect";
    const top = document.createElement("span");
    top.className = "diagram-label top";
    top.textContent = diagram.top;
    const side = document.createElement("span");
    side.className = "diagram-label side";
    side.textContent = diagram.side;
    shape.append(top, side);
    container.append(shape);
    return;
  }

  if (diagram.type === "array") {
    const array = document.createElement("div");
    array.className = "diagram-array";
    array.style.gridTemplateColumns = `repeat(${diagram.columns}, 16px)`;
    for (let i = 0; i < diagram.rows * diagram.columns; i += 1) {
      const dot = document.createElement("span");
      dot.className = "dot";
      array.append(dot);
    }
    container.append(array);
    return;
  }

  if (diagram.type === "angle") {
    const angle = document.createElement("div");
    angle.className = "diagram-angle";
    const arc = document.createElement("span");
    arc.className = "arc";
    const label = document.createElement("span");
    label.className = "diagram-label";
    label.textContent = diagram.label;
    label.style.left = "84px";
    label.style.bottom = "48px";
    angle.append(arc, label);
    container.append(angle);
    return;
  }

  if (diagram.type === "fraction") {
    const fraction = document.createElement("div");
    fraction.className = "diagram-fraction";
    for (let i = 0; i < diagram.denominator; i += 1) {
      const piece = document.createElement("span");
      if (i < diagram.numerator) piece.className = "filled";
      fraction.append(piece);
    }
    container.append(fraction);
    return;
  }

  if (diagram.type === "cubes") {
    const cubes = document.createElement("div");
    cubes.className = "diagram-cubes";
    const count = Math.min(16, diagram.count);
    for (let i = 0; i < count; i += 1) cubes.append(document.createElement("span"));
    container.append(cubes);
  }
}

function clearMathTimer() {
  if (state.mathTimerId) {
    window.clearInterval(state.mathTimerId);
    state.mathTimerId = null;
  }
}

function startPlayerTurn() {
  state.chain = [];
  state.dragging = false;
  state.selectedTarget = state.selectedTargets[state.activeSide];

  if (state.pendingMathRetry[state.activeSide]) {
    startMathChallenge();
    return;
  }

  if (state.attacksSinceMath[state.activeSide] >= 2) {
    state.attacksSinceMath[state.activeSide] = 0;
    startMathChallenge();
    return;
  }

  turnLabel.textContent = `${activePlayerName()} turn`;
  messageEl.textContent = `${activePlayerName()}: pick a target, then drag through 3+ matching adjacent tiles.`;
  mathPanel.hidden = true;
  renderHud();
  renderBoard();
}

function switchTurn() {
  state.activeSide = state.activeSide === "player" ? "rival" : "player";
  startPlayerTurn();
}

async function resolveAiTurn() {
  state.activeSide = "rival";
  turnLabel.textContent = "Player 2 turn";

  const attacker = firstAlivePet(state.rivalTeam);
  const target = firstAlivePet(state.playerTeam);
  if (!attacker || !target) return;

  messageEl.textContent = `Player 2: ${attacker.name} is attacking ${target.name}.`;
  await wait(350);
  await resolveAttack("rival", attacker.element, 3, target);
  state.attacksSinceMath.rival += 1;
  state.activeSide = "player";
}

async function resolveAttack(attackingSide, element, matchedCount, target) {
  const attacker = firstAliveByElement(teamForSide(attackingSide), element) ?? firstAlivePet(teamForSide(attackingSide));
  if (!attacker || !target) return;

  const baseDamage = Math.min(4, Math.max(1, matchedCount - 2));
  const multiplier = effectivenessMultiplier(element, target.element);
  const typeBonus = attackingSide === "player" ? typeAttackBonus(element) : 0;
  const attackPower = Math.max(1, Math.round(baseDamage * multiplier) + typeBonus);
  const damage = state.finalBossMode ? Math.max(120, attackPower * 80) : attackPower;
  const wasAlive = target.hp > 0;
  target.hp = Math.max(0, target.hp - damage);
  if (wasAlive && target.hp <= 0) {
    if (attackingSide === "player") {
      state.rivalKnockouts += 1;
    } else {
      state.playerKnockouts += 1;
    }
    state.selectedTargets[attackingSide] = firstAlivePet(opposingTeamForSide(attackingSide));
    state.selectedTarget = state.selectedTargets[attackingSide];
  }
  const xpGain = Math.round(5 * attackPower * petXpBoost(attacker));
  attacker.xp += xpGain;
  if (attackingSide === "player") savePetBattleXp(attacker, xpGain);
  messageEl.textContent = `${activePlayerName(attackingSide)}: ${attacker.name} used ${ELEMENTS[element].move} on ${target.name} for ${damage} damage${effectivenessText(multiplier)}.`;
  renderHud();
  updateTeamMeshes();
  await animatePetAttack(attackingSide, attacker, target, element);
}

function winBattle() {
  state.battleActive = false;
  state.animating = false;
  state.mathChallenge = null;
  clearMathTimer();
  mathPanel.hidden = true;
  completeAdventureLevel();
  const isMatchmakingBattle = state.battleSource === "matchmaking" || state.matchmakingMode;
  const battlePointAward = isMatchmakingBattle
    ? awardMatchmakingBattlePoints()
    : { awarded: 0, remaining: 0 };
  const petSeedsAwarded = state.adventureZone ? ADVENTURE_WIN_PET_SEEDS : 0;
  state.xp += WIN_XP;
  state.coins += WIN_COINS;
  state.petSeeds += petSeedsAwarded;
  saveGame();
  turnLabel.textContent = state.gameMode === "one" ? "You win" : "Player 1 wins";
  const battlePointMessage = isMatchmakingBattle
    ? battlePointAward.awarded > 0
      ? ` You also earned ${battlePointAward.awarded} Battle Points. Total: ${state.leaderboardPoints}.`
      : ` You reached today's ${DAILY_BATTLE_POINT_CAP} Battle Point limit. Total: ${state.leaderboardPoints}.`
    : "";
  const petSeedMessage = petSeedsAwarded > 0 ? ` You also earned ${petSeedsAwarded} Pet Seeds.` : "";
  messageEl.textContent = `${state.gameMode === "one" ? "You defeated" : "Player 1 defeated"} ${state.eventMode ? "all" : knockoutsToWinForSide("rival")} ${state.gameMode === "one" ? "rival" : "Player 2"} pets and earned ${WIN_XP} XP and ${WIN_COINS} Wiz Bucks.${battlePointMessage}${petSeedMessage}`;
  retryButton.textContent = "Play Again";
  retryButton.hidden = false;
  onePlayerButton.hidden = false;
  twoPlayerButton.hidden = false;
  battleBackButton.hidden = !(state.adventureZone || isMatchmakingBattle);
  showBattleRewards();
  renderHud();
  renderBoard();
}

function showBattleRewards() {
  if (!state.adventureZone) {
    rewardPanel.hidden = true;
    return;
  }
  const levelName = state.finalBossMode ? "Final Boss" : `Level ${state.adventureLevel}`;
  rewardSummary.textContent = `${levelName}: +${WIN_XP} XP, +${WIN_COINS} Wiz Bucks, +${ADVENTURE_WIN_PET_SEEDS} Pet Seeds`;
  rewardPanel.hidden = false;
}

function backToAdventureLevels() {
  if (state.matchmakingMode && !state.adventureZone) {
    canvas.hidden = true;
    hud.hidden = true;
    rewardPanel.hidden = true;
    blankScreen.hidden = false;
    setBlankMenuButtonsHidden(false);
    renderBattlePoints();
    return;
  }
  const zone = state.adventureZone;
  canvas.hidden = true;
  hud.hidden = true;
  rewardPanel.hidden = true;
  blankScreen.hidden = false;
  setBlankMenuButtonsHidden(true);
  loadScreen.hidden = true;
  challengeScreen.hidden = true;
  eventsScreen.hidden = true;
  modeScreen.hidden = true;
  adventureOptions.hidden = true;
  renderBattlePoints();

  if (!zone) {
    showHomeScreen();
    return;
  }

  if (zone === "forest") {
    populateLevels(forestLevels, ADVENTURE_LEVEL_COUNTS.forest, "forest");
    forestLevels.hidden = false;
    adventureLevels.hidden = true;
  } else {
    populateLevels(adventureLevels, ADVENTURE_LEVEL_COUNTS[zone], zone);
    forestLevels.hidden = true;
    adventureLevels.hidden = false;
  }
}

function loseBattle() {
  state.battleActive = false;
  state.animating = false;
  state.mathChallenge = null;
  clearMathTimer();
  mathPanel.hidden = true;
  rewardPanel.hidden = true;
  if (!state.finalBossMode) {
    state.hearts = Math.max(0, state.hearts - 1);
    saveGame();
  }
  turnLabel.textContent = state.gameMode === "one" ? "You lose" : "Player 2 wins";
  messageEl.textContent = `${state.gameMode === "one" ? "The rival" : "Player 2"} defeated 3 Player 1 pets.`;
  retryButton.textContent = "Retry";
  retryButton.hidden = false;
  onePlayerButton.hidden = false;
  twoPlayerButton.hidden = false;
  battleBackButton.hidden = true;
  renderHud();
  renderBoard();
}

function checkBattleEnd() {
  if (state.rivalKnockouts >= knockoutsToWinForSide("rival")) {
    winBattle();
    return true;
  }

  if (state.playerKnockouts >= knockoutsToWinForSide("player")) {
    loseBattle();
    return true;
  }

  return false;
}

function knockoutsToWinForSide(side) {
  if (state.finalBossMode && side === "rival") return 1;
  if (state.finalBossMode && side === "player") return 4;
  if (side === "player") return Math.max(1, state.battleHearts || state.hearts || MAX_PROFILE_HEARTS);
  if (state.eventMode && side === "rival") return state.rivalTeam.length;
  if (state.eventMode && (state.eventLevel === 3 || state.eventLevel === 5) && side === "player") {
    return 4;
  }
  if (state.challengeMode && side === "rival") return state.challengePetCount;
  return KNOCKOUTS_TO_WIN;
}

function clearAndRefill(matches) {
  for (const tile of matches) state.board[tile.row][tile.col] = null;

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    const column = [];
    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
      if (state.board[row][col]) column.push(state.board[row][col]);
    }
    while (column.length < BOARD_SIZE) column.push(randomElement());
    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
      state.board[row][col] = column[BOARD_SIZE - 1 - row];
    }
  }

  state.chain = [];
}

function renderHud() {
  xpLabel.textContent = `XP ${state.xp}`;
  coinsLabel.textContent = `Wiz Bucks ${state.coins}`;
  renderBattlePoints();
  renderProfileBadge();
  renderTeam(playerTeamEl, state.playerTeam, "player");
  renderTeam(rivalTeamEl, state.rivalTeam, "rival");
}

function renderBattlePoints() {
  const label = `Battle Points ${state.leaderboardPoints}`;
  battlePointsLabel.textContent = label;
  globalBattlePointsLabel.textContent = label;
  globalBattlePointsLabel.hidden = !state.currentUser || blankScreen.hidden;
}

function renderPetSeeds() {
  const seeds = Math.min(10, Math.max(0, state.petSeeds));
  growPetsCountButton.textContent = `${seeds}/10`;
  growPetsCountButton.disabled = state.petSeeds < PET_SEEDS_TO_GROW;
}

function renderTeam(container, team, side) {
  container.replaceChildren();
  const activePet = firstAlivePet(team);
  const knockouts = side === "player" ? state.playerKnockouts : state.rivalKnockouts;
  const hearts = Math.max(0, knockoutsToWinForSide(side) - knockouts);
  const isDefendingSide = state.battleActive && state.activeSide !== side && !state.mathChallenge;
  const activeTarget = state.selectedTargets[state.activeSide];

  const teamHearts = document.createElement("div");
  teamHearts.className = "team-hearts";
  const teamTitle = document.createElement("span");
  teamTitle.className = "team-title";
  teamTitle.textContent = side === "player" ? "Player 1" : "Player 2";
  teamHearts.append(teamTitle);
  for (let i = 0; i < knockoutsToWinForSide(side); i += 1) {
    const heart = document.createElement("span");
    heart.className = i < hearts ? "heart" : "heart empty";
    teamHearts.append(heart);
  }
  container.append(teamHearts);

  for (const pet of team) {
    const card = document.createElement("article");
    card.className = "pet-badge";
    if (side === "player" && pet === activePet) card.classList.add("active");
    if (pet.hp <= 0 || hearts <= 0) card.classList.add("out");

    const head = document.createElement("div");
    head.className = "pet-head";

    const name = document.createElement("span");
    name.textContent = side === "player" ? petDisplayName(pet) : `${pet.name} ${pet.kind}`;

    const chip = document.createElement("span");
    chip.className = `element-chip ${pet.element}`;
    chip.textContent = ELEMENTS[pet.element].icon;
    chip.title = ELEMENTS[pet.element].label;

    const meta = document.createElement("div");
    meta.className = "pet-meta";
    const typeLevel = side === "player" ? typeLevelFor(pet.element) : 1;
    meta.textContent = side === "player"
      ? `${petRankLabel(pet)}${petRankLabel(pet) ? " • " : ""}${ELEMENTS[pet.element].label} ${pet.typeRank} L${typeLevel} • XP ${pet.xp} • HP ${pet.hp}`
      : `${ELEMENTS[pet.element].label} • XP ${pet.xp} • HP ${pet.hp}`;

    const hpBar = document.createElement("div");
    hpBar.className = "stat-bar";
    const hpFill = document.createElement("div");
    hpFill.className = "stat-fill";
    hpFill.style.width = `${(pet.hp / (pet.maxHp ?? MAX_HP)) * 100}%`;
    hpBar.append(hpFill);

    head.append(name, chip);
    card.append(head, meta, hpBar);
    if (isDefendingSide && pet.hp > 0 && hearts > 0) {
      card.classList.add("targetable");
      card.addEventListener("click", () => chooseTarget(side, pet));
    }
    if (isDefendingSide && pet === activeTarget && pet.hp > 0) card.classList.add("targeted");
    card.dataset.side = side;
    container.append(card);
  }
}

function chooseTarget(side, pet) {
  if (
    state.animating ||
    state.mathChallenge ||
    !state.battleActive ||
    state.activeSide === side ||
    pet.hp <= 0
  ) {
    return;
  }
  state.selectedTargets[state.activeSide] = pet;
  state.selectedTarget = pet;
  messageEl.textContent = `${activePlayerName()} targeting ${pet.name}. Drag through 3+ matching tiles to attack.`;
  renderHud();
}

function petDisplayName(pet) {
  const rank = petRankLabel(pet);
  return rank ? `${rank} ${pet.name} ${pet.kind}` : `${pet.name} ${pet.kind}`;
}

function petRankLabel(pet) {
  return pet.rankKey === "domestic" ? "" : pet.rank;
}

function choosePetFromScene(event) {
  if (!state.threeReady || !state.battleActive || state.animating || state.mathChallenge) return;
  const uiTarget = event.target.closest?.(
    ".element-board, .actions, .math-panel, .pet-badge, button",
  );
  if (uiTarget) return;

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(scene.children, true);
  for (const hit of hits) {
    const holder = findPetHolder(hit.object);
    if (!holder) continue;

    const { side, pet } = holder.userData;
    if (side && pet) {
      chooseTarget(side, pet);
      return;
    }
  }
}

function findPetHolder(object) {
  let current = object;
  while (current) {
    if (current.userData?.petHolder) return current.userData.petHolder;
    if (current.userData?.pet && current.userData?.side) return current;
    current = current.parent;
  }
  return null;
}

function updateTeamMeshes() {
  if (!state.threeReady) return;

  playerPetMeshes.forEach((mesh, index) => {
    const pet = state.playerTeam[index];
    mesh.visible = state.playerKnockouts < knockoutsToWinForSide("player") && pet.hp > 0;
    mesh.scale.setScalar(meshScaleForPet(pet, pet === firstAlivePet(state.playerTeam)));
    updateMeshHealth(mesh, pet.hp);
  });

  rivalPetMeshes.forEach((mesh, index) => {
    const pet = state.rivalTeam[index];
    mesh.visible = state.rivalKnockouts < knockoutsToWinForSide("rival") && pet.hp > 0;
    mesh.scale.setScalar(meshScaleForPet(pet, pet === firstAlivePet(state.rivalTeam)));
    updateMeshHealth(mesh, pet.hp);
  });
}

function meshScaleForPet(pet, active = false) {
  const rankScale = (PET_RANKS[pet.rankKey] ?? PET_RANKS.mythical).scale;
  const base = active ? 0.54 : 0.43;
  return base * rankScale;
}

function updateMeshHealth(mesh, hearts) {
  const fill = mesh.getObjectByName("healthFill");
  if (!fill) return;
  const pet = mesh.userData.pet;
  const ratio = Math.max(0, hearts / (pet?.maxHp ?? MAX_HP));
  fill.scale.x = ratio;
  fill.position.x = -0.42 * (1 - ratio);
}

function firstAliveByElement(team, element) {
  return team.find((pet) => pet.hp > 0 && pet.element === element);
}

function firstAlivePet(team) {
  return team.find((pet) => pet.hp > 0);
}

function petIndex(team, pet) {
  return team.indexOf(pet);
}

function activePlayerName(side = state.activeSide) {
  if (state.gameMode === "one") return side === "player" ? "You" : "Rival";
  return side === "player" ? "Player 1" : "Player 2";
}

function opposingSide(side) {
  return side === "player" ? "rival" : "player";
}

function teamForSide(side) {
  return side === "player" ? state.playerTeam : state.rivalTeam;
}

function opposingTeamForSide(side) {
  return teamForSide(opposingSide(side));
}

function meshesForSide(side) {
  return side === "player" ? playerPetMeshes : rivalPetMeshes;
}

function selectedTargetForActiveSide() {
  const defendingTeam = opposingTeamForSide(state.activeSide);
  const target = state.selectedTargets[state.activeSide];
  if (target?.hp > 0) return target;

  const fallback = firstAlivePet(defendingTeam);
  state.selectedTargets[state.activeSide] = fallback;
  state.selectedTarget = fallback;
  return fallback;
}

function animatePetAttack(attackingSide, attacker, target, element) {
  if (!state.threeReady) return Promise.resolve();
  const attackerMeshes = meshesForSide(attackingSide);
  const targetMeshes = meshesForSide(opposingSide(attackingSide));
  const attackerMesh = attackerMeshes[petIndex(teamForSide(attackingSide), attacker)];
  const targetMesh = targetMeshes[petIndex(opposingTeamForSide(attackingSide), target)];
  playPetAnimation(attackerMesh, attacker.animations.attack, false);
  playPetAnimation(targetMesh, target.animations.hit, false);
  return animateAttack(attackerMesh, targetMesh, element);
}

function animateAttack(attacker, target, element) {
  const startX = attacker.position.x;
  const startY = attacker.position.y;
  const startZ = attacker.position.z;
  const attackerStartScale = attacker.scale.clone();
  const targetStartX = target.position.x;
  const targetStartY = target.position.y;
  const targetStartZ = target.position.z;
  const targetStartScale = target.scale.clone();
  const direction = Math.sign(targetStartX - startX) || 1;
  const lungeX = startX + (targetStartX - startX) * 0.42;
  const lungeZ = startZ + (targetStartZ - startZ) * 0.42;
  const projectile = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 18, 14),
    new THREE.MeshBasicMaterial({ color: ELEMENTS[element].color }),
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.025, 8, 28),
    new THREE.MeshBasicMaterial({ color: ELEMENTS[element].color, transparent: true, opacity: 0 }),
  );
  projectile.position.copy(attacker.position);
  projectile.position.y += 1.05;
  ring.position.set(targetStartX, targetStartY + 1.02, targetStartZ);
  ring.rotation.x = Math.PI / 2;
  scene.add(projectile, ring);
  const burstPieces = Array.from({ length: 8 }, (_, index) => {
    const piece = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 10, 8),
      new THREE.MeshBasicMaterial({ color: ELEMENTS[element].color, transparent: true, opacity: 0 }),
    );
    piece.userData.angle = (index / 8) * Math.PI * 2;
    piece.position.set(targetStartX, targetStartY + 1.08, targetStartZ);
    scene.add(piece);
    return piece;
  });

  return tween(980, (progress) => {
    if (progress < 0.18) {
      const t = progress / 0.18;
      attacker.scale.set(
        attackerStartScale.x * (1 + t * 0.16),
        attackerStartScale.y * (1 - t * 0.2),
        attackerStartScale.z * (1 + t * 0.16),
      );
      attacker.position.x = startX - direction * t * 0.18;
      attacker.position.y = startY - t * 0.06;
      attacker.rotation.z = -direction * t * 0.18;
      projectile.visible = false;
      return;
    }

    if (progress < 0.68) {
      const t = (progress - 0.18) / 0.5;
      const arc = Math.sin(t * Math.PI);
      attacker.scale.set(
        attackerStartScale.x * (1 - arc * 0.05),
        attackerStartScale.y * (1 + arc * 0.14),
        attackerStartScale.z * (1 - arc * 0.05),
      );
      attacker.position.x = startX + (lungeX - startX) * t;
      attacker.position.z = startZ + (lungeZ - startZ) * t;
      attacker.position.y = startY + arc * 0.52;
      attacker.rotation.z = direction * arc * 0.32;
      projectile.visible = true;
      projectile.position.lerpVectors(
        new THREE.Vector3(startX, startY + 1.08, startZ),
        new THREE.Vector3(targetStartX, targetStartY + 1.08, targetStartZ),
        t,
      );
      projectile.position.y += arc * 0.55;
      projectile.scale.setScalar(1 + arc * 1.1);
      return;
    }

    const t = (progress - 0.68) / 0.32;
    const shake = Math.sin(t * Math.PI * 12) * (1 - t);
    const burst = Math.sin(t * Math.PI);
    projectile.visible = false;
    ring.material.opacity = 0.85 * (1 - t);
    ring.scale.setScalar(1 + t * 3.1);
    attacker.position.x = lungeX + (startX - lungeX) * t;
    attacker.position.z = lungeZ + (startZ - lungeZ) * t;
    attacker.position.y = startY + Math.sin((1 - t) * Math.PI) * 0.22;
    attacker.rotation.z = direction * (1 - t) * 0.2;
    target.position.x = targetStartX + direction * 0.38 * burst;
    target.position.y = targetStartY + 0.22 * burst;
    target.rotation.z = shake * 0.28;
    target.scale.set(
      targetStartScale.x * (1 + burst * 0.14),
      targetStartScale.y * (1 - burst * 0.14),
      targetStartScale.z * (1 + burst * 0.14),
    );
    for (const piece of burstPieces) {
      piece.material.opacity = 0.9 * (1 - t);
      piece.position.set(
        targetStartX + Math.cos(piece.userData.angle) * t * 0.95,
        targetStartY + 1.08 + Math.sin(t * Math.PI) * 0.28,
        targetStartZ + Math.sin(piece.userData.angle) * t * 0.95,
      );
    }
  }).then(() => {
    scene.remove(projectile, ring, ...burstPieces);
    attacker.position.x = startX;
    attacker.position.y = startY;
    attacker.position.z = startZ;
    attacker.rotation.z = 0;
    attacker.scale.copy(attackerStartScale);
    target.position.set(targetStartX, targetStartY, targetStartZ);
    target.rotation.z = 0;
    target.scale.copy(targetStartScale);
    playPetAnimation(attacker, attacker.userData.pet?.animations.idle);
    playPetAnimation(target, target.userData.pet?.animations.idle);
  });
}

function playPetAnimation(holder, clipName, loop = true) {
  const actions = holder?.userData?.actions;
  if (!actions || !clipName || !actions[clipName]) return;

  for (const action of Object.values(actions)) action.fadeOut(0.08);

  const action = actions[clipName];
  action.reset();
  action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
  action.clampWhenFinished = !loop;
  action.fadeIn(0.08);
  action.play();
}

function tween(durationMs, update) {
  return new Promise((resolve) => {
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / durationMs, 1);
      update(easeInOut(progress));
      if (progress < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function randomElement() {
  return ELEMENT_KEYS[randomInt(0, ELEMENT_KEYS.length - 1)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeMathQuestion() {
  const makers = [
    makeGardenAreaStory,
    makeFencePerimeterStory,
    makeTileArrayStory,
    makeAngleStory,
    makeFractionSnackStory,
    makeVolumeCrateStory,
    makeElapsedTimeStory,
    makePatternStory,
  ];
  return makers[randomInt(0, makers.length - 1)]();
}

function makeGardenAreaStory() {
  const length = randomInt(4, 10);
  const width = randomInt(3, 8);
  return makeQuestionFromAnswer(
    `Sprout builds a rectangular garden that is ${length} feet long and ${width} feet wide. What is the area in square feet?`,
    length * width,
    10,
    { type: "rectangle", top: `${length} ft`, side: `${width} ft` },
  );
}

function makeFencePerimeterStory() {
  const length = randomInt(5, 12);
  const width = randomInt(3, 8);
  return makeQuestionFromAnswer(
    `Cinder wants to put a fence around a rectangular training field ${length} feet long and ${width} feet wide. How many feet of fence are needed?`,
    2 * (length + width),
    10,
    { type: "rectangle", top: `${length} ft`, side: `${width} ft` },
  );
}

function makeTileArrayStory() {
  const rows = randomInt(3, 8);
  const columns = randomInt(3, 7);
  const broken = randomInt(1, 6);
  return makeQuestionFromAnswer(
    `Volt places battle tiles in ${rows} rows with ${columns} tiles in each row. If ${broken} tiles crack, how many tiles are still usable?`,
    rows * columns - broken,
    10,
    { type: "array", rows, columns },
  );
}

function makeAngleStory() {
  const known = [20, 30, 40, 45, 50, 60][randomInt(0, 5)];
  return makeQuestionFromAnswer(
    `Splash draws a right angle for a water slide path. One part measures ${known} degrees. What is the other part of the 90 degree angle?`,
    90 - known,
    10,
    { type: "angle", label: `${known} deg` },
  );
}

function makeFractionSnackStory() {
  const denominator = [2, 3, 4][randomInt(0, 2)];
  const numerator = randomInt(1, denominator - 1);
  const total = denominator * randomInt(3, 8);
  return makeQuestionFromAnswer(
    `The pet team has ${total} berry treats. They eat ${numerator}/${denominator} of them before battle. How many treats did they eat?`,
    (total / denominator) * numerator,
    8,
    { type: "fraction", numerator, denominator },
  );
}

function makeVolumeCrateStory() {
  const length = randomInt(2, 5);
  const width = randomInt(2, 4);
  const height = randomInt(2, 3);
  return makeQuestionFromAnswer(
    `A supply crate is ${length} cubes long, ${width} cubes wide, and ${height} cubes tall. How many unit cubes fit inside?`,
    length * width * height,
    10,
    { type: "cubes", count: length * width * height },
  );
}

function makeElapsedTimeStory() {
  const training = randomInt(10, 30);
  const puzzle = randomInt(10, 25);
  const left = randomInt(10, 40);
  const total = training + puzzle + left;
  return makeQuestionFromAnswer(
    `The pets have ${total} minutes before the boss gate closes. They train for ${training} minutes and solve puzzles for ${puzzle} minutes. How many minutes are left?`,
    left,
    10,
  );
}

function makePatternStory() {
  const start = randomInt(2, 10);
  const step = randomInt(2, 6);
  const fourth = start + step * 3;
  return makeQuestionFromAnswer(
    `A magic path shows this pattern: ${start}, ${start + step}, ${start + step * 2}, __. What number comes next?`,
    fourth,
    8,
  );
}

function makeAdditionQuestion() {
  const left = randomInt(120, 899);
  const right = randomInt(80, 499);
  return makeQuestionFromAnswer(`${left} + ${right} = ?`, left + right, 35);
}

function makeSubtractionQuestion() {
  const right = randomInt(80, 499);
  const answer = randomInt(120, 699);
  const left = answer + right;
  return makeQuestionFromAnswer(`${left} - ${right} = ?`, answer, 35);
}

function makeMultiplicationQuestion() {
  const left = randomInt(2, 12);
  const right = randomInt(2, 12);
  return makeQuestionFromAnswer(`${left} x ${right} = ?`, left * right, 12);
}

function makeDivisionQuestion() {
  const answer = randomInt(2, 12);
  const divisor = randomInt(2, 12);
  const dividend = answer * divisor;
  return makeQuestionFromAnswer(`${dividend} ÷ ${divisor} = ?`, answer, 6);
}

function makeMissingNumberQuestion() {
  const hidden = randomInt(20, 99);
  const add = randomInt(20, 99);
  const total = hidden + add;
  return makeQuestionFromAnswer(`□ + ${add} = ${total}`, hidden, 10);
}

function makeBalancedQuestion() {
  const left = randomInt(20, 90);
  const right = randomInt(10, 60);
  const shift = randomInt(10, 50);
  const total = left + right;
  const correctAnswer = total - shift;
  return makeQuestionFromAnswer(`${left} + ${right} = ${shift} + □`, correctAnswer, 10);
}

function makeOrderQuestion() {
  const left = randomInt(4, 12);
  const middle = randomInt(3, 9);
  const right = randomInt(12, 38);
  return makeQuestionFromAnswer(`${left} x ${middle} + ${right} = ?`, left * middle + right, 18);
}

function makeFactorQuestion() {
  const factors = [3, 4, 6, 8, 9, 12];
  const factor = factors[randomInt(0, factors.length - 1)];
  const correctAnswer = factor * randomInt(3, 11);
  const answers = new Set([correctAnswer]);
  while (answers.size < 4) {
    const option = correctAnswer + randomInt(-factor * 4, factor * 4);
    if (option > 0 && option % factor !== 0) answers.add(option);
  }
  return {
    text: `Which number is a multiple of ${factor}?`,
    correctAnswer,
    answers: shuffle([...answers]),
  };
}

function makeFractionQuestion() {
  const denominator = randomInt(3, 8);
  const numerator = randomInt(1, denominator - 1);
  const whole = denominator * randomInt(4, 12);
  const answer = (whole / denominator) * numerator;
  return makeQuestionFromAnswer(`${numerator}/${denominator} of ${whole} = ?`, answer, 12);
}

function makeQuestionFromAnswer(text, correctAnswer, spread, diagram = null) {
  const answers = new Set([correctAnswer]);

  while (answers.size < 4) {
    const option = correctAnswer + randomInt(-spread, spread);
    if (option >= 0) answers.add(option);
  }

  return {
    text,
    correctAnswer,
    diagram,
    answers: shuffle([...answers]),
  };
}

function shuffle(items) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);
}

function sameTile(first, second) {
  return first.row === second.row && first.col === second.col;
}

function areNeighbors(first, second) {
  const rowDistance = Math.abs(first.row - second.row);
  const colDistance = Math.abs(first.col - second.col);
  return rowDistance <= 1 && colDistance <= 1 && rowDistance + colDistance > 0;
}

function tileKey(row, col) {
  return `${row}:${col}`;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function effectivenessMultiplier(attackElement, targetElement) {
  if (STRONG_AGAINST[attackElement] === targetElement) return 2;
  if (STRONG_AGAINST[targetElement] === attackElement) return 0.5;
  return 1;
}

function effectivenessText(multiplier) {
  if (multiplier > 1) return " - super effective";
  if (multiplier < 1) return " - resisted";
  return "";
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || "request_failed");
    error.status = response.status;
    throw error;
  }
  return body;
}

async function loadSave() {
  try {
    const { user } = await api("/api/me");
    applyProfile(user);
    cacheProfile(user);
    resetTeams();
    showLoadScreen();
  } catch (error) {
    if (error.status !== 401) {
      loginMessage.textContent = "The game server is unavailable. Try again in a moment.";
    }
    renderProfileBadge();
  }
}

function saveGame() {
  if (!state.currentUser) return;
  const profile = profileFromState();
  cacheProfile(profile);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await api("/api/profile", {
        method: "PUT",
        body: JSON.stringify({ profile }),
      });
    } catch (error) {
      console.error("Could not save game progress", error);
    }
  }, 500);
  renderProfileBadge();
}

function cacheProfile(profile) {
  const users = readUsers();
  users[profile.username] = profile;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, profile.username);
}

function resetSave() {
  if (!state.currentUser) return;
  const freshProfile = createDefaultProfile(state.currentUser, state.avatar);
  applyProfile(freshProfile);
  saveGame();
  resetTeams();
  updateAdventureLocks();
  renderHud();
  messageEl.textContent = "Save reset. Your pets are ready for a fresh start.";
}

async function loginPlayer() {
  const username = normalizeUsername(playerNameInput.value);
  const password = playerPasswordInput.value;
  if (username.length < 3 || password.length < 8) {
    loginMessage.textContent = "Use at least 3 characters for the name and 8 for the password.";
    return;
  }

  loginButton.disabled = true;
  loginMessage.textContent = authMode === "register" ? "Creating account..." : "Logging in...";
  try {
    const localProfile = readUsers()[username];
    const { user } = await api(`/api/${authMode}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const profile = authMode === "register" && localProfile
      ? {
          ...localProfile,
          username: user.username,
          avatar: user.avatar,
          friendCode: user.friendCode,
          friends: [],
        }
      : user;
    applyProfile(profile);
    resetTeams();
    showLoadScreen();
    saveGame();
    playerPasswordInput.value = "";
  } catch (error) {
    const messages = {
      invalid_login: "That player name or password is not correct.",
      username_taken: "That player name is already taken. Try logging in instead.",
      invalid_username_or_password: "Use at least 3 characters for the name and 8 for the password.",
    };
    loginMessage.textContent = messages[error.message] || "Could not log in. Try again.";
  } finally {
    loginButton.disabled = false;
  }
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  const registering = authMode === "register";
  loginTitle.textContent = registering ? "Create Account" : "Log In";
  loginButton.textContent = registering ? "Create Account" : "Log In";
  loginModeButton.textContent = registering ? "I already have an account" : "Create an account";
  playerPasswordInput.autocomplete = registering ? "new-password" : "current-password";
  loginMessage.textContent = registering
    ? "Choose a player name and a password with at least 8 characters."
    : "Your progress is saved to your account.";
}

async function logoutPlayer() {
  clearTimeout(saveTimer);
  await api("/api/logout", { method: "POST", body: "{}" }).catch(() => {});
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.reload();
}

function requireLogin() {
  if (state.currentUser) return true;
  loginScreen.hidden = false;
  loginMessage.textContent = "Log in to continue.";
  playerNameInput.focus();
  return false;
}

function showHeartShop() {
  if (!requireLogin()) return;
  loadScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  heartShopScreen.hidden = false;
}

function showShop(returnTo = "home") {
  if (!requireLogin()) return;
  state.shopReturnTo = returnTo;
  loadScreen.hidden = true;
  blankScreen.hidden = true;
  backpackScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  shopScreen.hidden = false;
  renderProfileBadge();
}

function showGrowPets() {
  if (!requireLogin()) return;
  renderPetSeeds();
  loadScreen.hidden = true;
  blankScreen.hidden = true;
  friendBattleScreen.hidden = true;
  growPetsScreen.hidden = false;
}

function showBackpack() {
  loadScreen.hidden = true;
  shopScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  backpackScreen.hidden = false;
  renderProfileBadge();
}

function showMyPets(returnTo = "blank") {
  if (!requireLogin()) return;
  state.myPetsReturnTo = returnTo;
  resetTeams();
  renderMyPets();
  loadScreen.hidden = true;
  blankScreen.hidden = true;
  shopScreen.hidden = true;
  backpackScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  heartShopScreen.hidden = true;
  challengeScreen.hidden = true;
  eventsScreen.hidden = true;
  modeScreen.hidden = true;
  quizScreen.hidden = true;
  leaderboardScreen.hidden = true;
  myPetsScreen.hidden = false;
}

function showLeaderboard() {
  renderLeaderboard();
  blankScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  leaderboardScreen.hidden = false;
}

function renderLeaderboard() {
  const playerName = state.currentUser ?? "Player";
  const rows = [
    { name: playerName, score: state.leaderboardPoints, me: true },
  ];
  leaderboardList.replaceChildren();
  rows.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = row.me ? "leaderboard-row me" : "leaderboard-row";
    const rank = document.createElement("span");
    rank.textContent = `#${index + 1}`;
    const name = document.createElement("strong");
    name.textContent = row.name;
    const score = document.createElement("span");
    score.textContent = `${row.score} pts`;
    item.append(rank, name, score);
    leaderboardList.append(item);
  });
}

function showQuizMode() {
  clearQuizTimer();
  state.quizCorrect = 0;
  state.quizTotal = 0;
  adventureOptions.hidden = true;
  forestLevels.hidden = true;
  adventureLevels.hidden = true;
  blankScreen.hidden = true;
  leaderboardScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  quizScreen.hidden = false;
  quizScore.textContent = "Score 0/0";
  quizQuestion.textContent = "Loading question...";
  quizMessage.textContent = "Pick an answer.";
  quizAnswers.replaceChildren();
  window.setTimeout(nextQuizQuestion, 0);
}

window.openQuizMode = showQuizMode;

function nextQuizQuestion() {
  clearQuizTimer();
  state.quizQuestion = makeMathQuestion();
  state.quizTimeLeft = 20;
  quizMessage.textContent = "Pick an answer.";
  updateQuizHeader();
  quizQuestion.textContent = state.quizQuestion.text;
  renderQuestionDiagram(quizDiagram, state.quizQuestion.diagram);
  quizAnswers.replaceChildren();

  for (const answer of state.quizQuestion.answers) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => answerQuizQuestion(answer));
    quizAnswers.append(button);
  }
  state.quizTimerId = window.setInterval(() => {
    state.quizTimeLeft -= 1;
    updateQuizHeader();
    if (state.quizTimeLeft <= 0) answerQuizQuestion(null);
  }, 1000);
}

function answerQuizQuestion(answer) {
  if (!state.quizQuestion) return;
  clearQuizTimer();
  const correct = answer === state.quizQuestion.correctAnswer;
  state.quizTotal += 1;
  if (correct) state.quizCorrect += 1;
  updateQuizHeader();
  quizMessage.textContent = answer === null
    ? `Time's up. The answer was ${state.quizQuestion.correctAnswer}.`
    : correct
      ? "Correct! Next question..."
      : `Not quite. The answer was ${state.quizQuestion.correctAnswer}.`;
  for (const button of quizAnswers.querySelectorAll("button")) {
    button.disabled = true;
  }
  window.setTimeout(nextQuizQuestion, 1000);
}

function updateQuizHeader() {
  quizScore.textContent = `Score ${state.quizCorrect}/${state.quizTotal} • ${state.quizTimeLeft}s`;
}

function clearQuizTimer() {
  if (!state.quizTimerId) return;
  window.clearInterval(state.quizTimerId);
  state.quizTimerId = null;
}

function showLoadScreen() {
  loginScreen.hidden = true;
  loadScreen.hidden = false;
  heartShopScreen.hidden = true;
  shopScreen.hidden = true;
  backpackScreen.hidden = true;
  myPetsScreen.hidden = true;
  growPetsScreen.hidden = true;
  friendBattleScreen.hidden = true;
  leaderboardScreen.hidden = true;
  quizScreen.hidden = true;
  canvas.hidden = true;
  hud.hidden = true;
  updateAdventureLocks();
  renderProfileBadge();
  renderBattlePoints();
}

function buyHeart() {
  if (!state.currentUser) return;
  if (state.hearts >= MAX_PROFILE_HEARTS) {
    loginMessage.textContent = "Hearts are already full.";
    return;
  }
  if (state.coins < HEART_COST) {
    loginMessage.textContent = `You need ${HEART_COST} Wiz Bucks to buy a heart.`;
    return;
  }
  state.coins -= HEART_COST;
  state.hearts = Math.min(MAX_PROFILE_HEARTS, state.hearts + 1);
  saveGame();
  renderHud();
}

function buyOrEquipMascot(mascotId) {
  if (!SHOP_MASCOTS.includes(mascotId)) return;
  if (!state.ownedMascots.includes(mascotId)) {
    if (state.coins < MASCOT_PRICE) return;
    state.coins -= MASCOT_PRICE;
    state.ownedMascots.push(mascotId);
  }
  state.equippedMascot = mascotId;
  saveGame();
  renderHud();
}

function equipOwnedMascot(mascotId) {
  if (!state.ownedMascots.includes(mascotId)) return;
  state.equippedMascot = mascotId;
  saveGame();
  renderHud();
}

function buyBattlePet(petId) {
  if (!SHOP_BATTLE_PETS[petId] || state.ownedBattlePets.includes(petId)) return;
  if (state.coins < BATTLE_PET_PRICE) return;
  state.coins -= BATTLE_PET_PRICE;
  state.ownedBattlePets.push(petId);
  state.activePetByElement[SHOP_BATTLE_PETS[petId].element] = petId;
  saveGame();
  resetTeams();
  renderHud();
  renderMyPets();
  if (state.threeReady) rebuildPetMeshes();
}

function buyPetXpPack() {
  if (!state.currentUser) return;
  if (state.leaderboardPoints < PET_XP_PACK_COST) {
    battleShopMessage.textContent = `You need ${PET_XP_PACK_COST} Battle Points.`;
    renderBattleShopButtons();
    return;
  }
  state.leaderboardPoints -= PET_XP_PACK_COST;
  for (const petId of ownedPetIdsForXp()) {
    const existing = state.petStats[petId] ?? { rank: "domestic", xp: 0 };
    state.petStats[petId] = {
      ...existing,
      xp: (Number.isFinite(existing.xp) ? existing.xp : 0) + PET_XP_PACK_AMOUNT,
    };
  }
  battleShopMessage.textContent = `All your pets gained ${PET_XP_PACK_AMOUNT} XP.`;
  saveGame();
  resetTeams();
  renderHud();
  renderMyPets();
  if (state.threeReady) rebuildPetMeshes();
}

function buyPetSeedsPack() {
  if (!state.currentUser) return;
  if (state.leaderboardPoints < PET_SEEDS_PACK_COST) {
    petSeedsShopMessage.textContent = `You need ${PET_SEEDS_PACK_COST} Battle Points.`;
    renderBattleShopButtons();
    return;
  }
  state.leaderboardPoints -= PET_SEEDS_PACK_COST;
  state.petSeeds += PET_SEEDS_PACK_AMOUNT;
  petSeedsShopMessage.textContent = `You bought ${PET_SEEDS_PACK_AMOUNT} Pet Seeds.`;
  saveGame();
  renderHud();
  renderPetSeeds();
}

function growPetWithSeeds() {
  if (!state.currentUser) return;
  if (state.petSeeds < PET_SEEDS_TO_GROW) {
    growPetsMessage.textContent = `Collect ${PET_SEEDS_TO_GROW - state.petSeeds} more Pet Seeds.`;
    renderPetSeeds();
    return;
  }

  const newPetId = randomUngrownPetId();
  if (!newPetId) {
    growPetsMessage.textContent = "You already have every available grown pet.";
    renderPetSeeds();
    return;
  }

  const newPet = SHOP_BATTLE_PETS[newPetId];
  state.ownedBattlePets.push(newPetId);
  state.activePetByElement[newPet.element] = newPetId;
  state.petStats[newPetId] = state.petStats[newPetId] ?? { rank: "domestic", xp: 0 };
  state.petSeeds -= PET_SEEDS_TO_GROW;
  saveGame();
  resetTeams();
  renderHud();
  renderMyPets();
  growPetsMessage.textContent = `You grew ${newPet.name} ${newPet.kind}. It replaced your ${ELEMENTS[newPet.element].label} pet.`;
  if (state.threeReady) rebuildPetMeshes();
}

function randomUngrownPetId() {
  const candidates = Object.keys(SHOP_BATTLE_PETS).filter((petId) => !state.ownedBattlePets.includes(petId));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function ownedPetIdsForXp() {
  return [
    ...new Set([
      ...createPlayerTeam().map((pet) => pet.id),
      ...state.ownedBattlePets.filter((petId) => SHOP_BATTLE_PETS[petId]),
    ]),
  ];
}

function readUsers() {
  return safeParse(localStorage.getItem(USERS_KEY), {});
}

function resetSavedBattlePointsOnce(users) {
  if (localStorage.getItem(BATTLE_POINTS_RESET_KEY) === "done") return false;
  for (const profile of Object.values(users)) {
    if (!profile || typeof profile !== "object") continue;
    profile.leaderboardPoints = 0;
    profile.dailyBattlePoints = { date: todayKey(), earned: 0 };
  }
  localStorage.setItem(BATTLE_POINTS_RESET_KEY, "done");
  return true;
}

function ensureFriendCodes(users) {
  let changed = false;
  for (const [username, profile] of Object.entries(users)) {
    if (!profile || typeof profile !== "object") continue;
    if (profile.friendCode) continue;
    profile.friendCode = makeUniqueFriendCode(users, username);
    changed = true;
  }
  return changed;
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeUsername(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 18);
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function normalizeDailyBattlePoints(value = {}) {
  const today = todayKey();
  const earned = Number.isFinite(value?.earned)
    ? Math.min(DAILY_BATTLE_POINT_CAP, Math.max(0, value.earned))
    : 0;
  if (value?.date === today) return { date: today, earned };
  return { date: today, earned: 0 };
}

function awardMatchmakingBattlePoints() {
  state.dailyBattlePoints = normalizeDailyBattlePoints(state.dailyBattlePoints);
  if (state.leaderboardPoints < state.dailyBattlePoints.earned) {
    state.dailyBattlePoints.earned = Math.max(0, state.leaderboardPoints);
  }
  const remaining = Math.max(0, DAILY_BATTLE_POINT_CAP - state.dailyBattlePoints.earned);
  const awarded = Math.min(MATCHMAKING_BATTLE_POINTS, remaining);
  if (awarded <= 0) return { awarded: 0, remaining: 0 };
  state.leaderboardPoints += awarded;
  state.dailyBattlePoints.earned += awarded;
  return {
    awarded,
    remaining: Math.max(0, DAILY_BATTLE_POINT_CAP - state.dailyBattlePoints.earned),
  };
}

function createDefaultProfile(username, avatar = randomAvatar()) {
  return {
    username,
    avatar,
    friendCode: makeUniqueFriendCode(readUsers(), username),
    friends: [],
    xp: 0,
    coins: 80,
    leaderboardPoints: 0,
    dailyBattlePoints: { date: todayKey(), earned: 0 },
    petSeeds: 0,
    hearts: MAX_PROFILE_HEARTS,
    ownedMascots: [DEFAULT_MASCOT],
    equippedMascot: DEFAULT_MASCOT,
    ownedBattlePets: [],
    activePetByElement: {},
    petStats: createDefaultPetStats(),
    typeLevels: createDefaultTypeLevels(),
    adventureProgress: createDefaultAdventureProgress(),
  };
}

function createDefaultPetStats() {
  return {
    "cinder-fox": { rank: "domestic", xp: 0 },
    "splash-fish": { rank: "domestic", xp: 0 },
    "volt-bunny": { rank: "domestic", xp: 0 },
    "sprout-beaver": { rank: "domestic", xp: 0 },
  };
}

function createDefaultTypeLevels() {
  return {
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
  };
}

function cleanActivePetByElement(activeMap = {}) {
  const cleaned = {};
  for (const element of ELEMENT_KEYS) {
    const petId = activeMap[element];
    if (createOwnedPetById(petId)) cleaned[element] = petId;
  }
  return cleaned;
}

function createDefaultAdventureProgress() {
  return {
    forest: createAdventureProgress(true),
    "number-beach": createAdventureProgress(false),
    "puzzle-park": createAdventureProgress(false),
    "pet-camp": createAdventureProgress(false),
    "boss-trail": createAdventureProgress(false),
  };
}

function createAdventureProgress(unlocked) {
  return {
    unlocked,
    completed: false,
    highestUnlocked: unlocked ? 1 : 0,
    completedLevels: {},
  };
}

function randomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

function applyProfile(profile) {
  const fallback = createDefaultProfile(profile.username || "Player", profile.avatar);
  state.currentUser = profile.username || fallback.username;
  state.avatar = profile.avatar || fallback.avatar;
  state.friendCode = profile.friendCode || fallback.friendCode;
  state.friends = Array.isArray(profile.friends)
    ? profile.friends.filter((friend) => friend?.username && friend?.friendCode)
    : fallback.friends;
  state.xp = Number.isFinite(profile.xp) ? profile.xp : fallback.xp;
  state.coins = Number.isFinite(profile.coins) ? profile.coins : fallback.coins;
  state.leaderboardPoints = Number.isFinite(profile.leaderboardPoints)
    ? profile.leaderboardPoints
    : fallback.leaderboardPoints;
  state.dailyBattlePoints = normalizeDailyBattlePoints(profile.dailyBattlePoints);
  state.petSeeds = Number.isFinite(profile.petSeeds) ? profile.petSeeds : fallback.petSeeds;
  state.hearts = Number.isFinite(profile.hearts) ? Math.min(MAX_PROFILE_HEARTS, profile.hearts) : fallback.hearts;
  const migratedMascots = Array.isArray(profile.ownedMascots)
    ? profile.ownedMascots.map((mascot) => (mascot === "star-fox" ? "crystal-dragon" : mascot))
    : [DEFAULT_MASCOT, "crystal-dragon"];
  state.ownedMascots = [...new Set([DEFAULT_MASCOT, ...migratedMascots])];
  const equippedMascot = profile.equippedMascot === "star-fox" ? "crystal-dragon" : profile.equippedMascot;
  state.equippedMascot = state.ownedMascots.includes(equippedMascot)
    ? equippedMascot
    : DEFAULT_MASCOT;
  state.ownedBattlePets = Array.isArray(profile.ownedBattlePets)
    ? profile.ownedBattlePets.filter((petId) => Boolean(SHOP_BATTLE_PETS[petId]))
    : fallback.ownedBattlePets;
  state.activePetByElement = cleanActivePetByElement(profile.activePetByElement ?? fallback.activePetByElement);
  state.battleHearts = state.hearts;
  state.petStats = { ...fallback.petStats, ...(profile.petStats ?? {}) };
  state.typeLevels = { ...fallback.typeLevels, ...(profile.typeLevels ?? {}) };
  state.adventureProgress = mergeAdventureProgress(profile.adventureProgress);
  playerNameInput.value = state.currentUser;
  applyPetStatsToTeam(state.playerTeam);
  renderProfileBadge();
  updateAdventureLocks();
}

function profileFromState() {
  return {
    username: state.currentUser,
    avatar: state.avatar,
    friendCode: state.friendCode,
    friends: state.friends,
    xp: state.xp,
    coins: state.coins,
    leaderboardPoints: state.leaderboardPoints,
    dailyBattlePoints: state.dailyBattlePoints,
    petSeeds: state.petSeeds,
    hearts: state.hearts,
    ownedMascots: state.ownedMascots,
    equippedMascot: state.equippedMascot,
    ownedBattlePets: state.ownedBattlePets,
    activePetByElement: state.activePetByElement,
    petStats: state.petStats,
    typeLevels: state.typeLevels,
    adventureProgress: state.adventureProgress,
  };
}

function mergeAdventureProgress(progress = {}) {
  const defaults = createDefaultAdventureProgress();
  for (const zone of ADVENTURE_SEQUENCE) {
    defaults[zone] = {
      ...defaults[zone],
      ...(progress[zone] ?? {}),
      completedLevels: {
        ...defaults[zone].completedLevels,
        ...(progress[zone]?.completedLevels ?? {}),
      },
    };
  }
  if (progress.forestComplete) {
    defaults.forest.completed = true;
    defaults.forest.completedLevels[22] = true;
    defaults["number-beach"].unlocked = true;
    defaults["number-beach"].highestUnlocked = Math.max(1, defaults["number-beach"].highestUnlocked);
  }
  return defaults;
}

function getAdventureProgress(zone) {
  if (!state.adventureProgress[zone]) state.adventureProgress[zone] = createAdventureProgress(zone === "forest");
  return state.adventureProgress[zone];
}

function isAdventureUnlocked(zone) {
  return Boolean(getAdventureProgress(zone).unlocked);
}

function completeAdventureLevel() {
  if (!state.adventureZone || !state.adventureLevel) return;
  const progress = getAdventureProgress(state.adventureZone);
  const count = ADVENTURE_LEVEL_COUNTS[state.adventureZone] ?? state.adventureLevel;
  progress.completedLevels[state.adventureLevel] = true;
  progress.highestUnlocked = Math.max(progress.highestUnlocked, Math.min(count, state.adventureLevel + 1));
  if (state.adventureLevel >= count) {
    progress.completed = true;
    const nextZone = ADVENTURE_SEQUENCE[ADVENTURE_SEQUENCE.indexOf(state.adventureZone) + 1];
    if (nextZone) {
      const nextProgress = getAdventureProgress(nextZone);
      nextProgress.unlocked = true;
      nextProgress.highestUnlocked = Math.max(1, nextProgress.highestUnlocked);
    }
  }
  updateAdventureLocks();
}

function applyPetStatsToTeam(team) {
  for (const pet of team) {
    const stats = state.petStats[pet.id] ?? { rank: "domestic", xp: pet.xp };
    const rank = PET_RANKS[stats.rank] ?? PET_RANKS.domestic;
    pet.rankKey = stats.rank ?? "domestic";
    pet.rank = rank.label;
    pet.xp = Number.isFinite(stats.xp) ? stats.xp : 0;
    pet.maxHp = MAX_HP + rank.hpBoost;
    pet.hp = pet.maxHp;
    pet.typeRank = TYPE_RANKS[typeLevelFor(pet.element)].label;
    pet.attackBonus = typeAttackBonus(pet.element);
  }
}

function typeLevelFor(element) {
  return Math.min(3, Math.max(1, state.typeLevels[element] ?? 1));
}

function typeAttackBonus(element) {
  return TYPE_RANKS[typeLevelFor(element)].attackBonus;
}

function petXpBoost(pet) {
  return (PET_RANKS[pet.rankKey] ?? PET_RANKS.domestic).xpBoost;
}

function savePetBattleXp(pet, xpGain) {
  const existing = state.petStats[pet.id] ?? { rank: pet.rankKey ?? "domestic", xp: 0 };
  state.petStats[pet.id] = {
    ...existing,
    xp: (Number.isFinite(existing.xp) ? existing.xp : 0) + xpGain,
  };
  saveGame();
}

function renderProfileBadge() {
  if (!avatarLabel || !profileNameLabel || !heartLabel) return;
  avatarLabel.textContent = state.avatar ?? "Fox";
  profileNameLabel.textContent = state.currentUser ?? "Player";
  heartLabel.textContent = `Hearts ${state.hearts}/${MAX_PROFILE_HEARTS}`;
  heartShopBalance.textContent = `Wiz Bucks ${state.coins}`;
  shopBalance.textContent = `Wiz Bucks ${state.coins}`;
  renderHomeMascot();
  const cannotBuyHeart = !state.currentUser || state.hearts >= MAX_PROFILE_HEARTS || state.coins < HEART_COST;
  backpackButton.disabled = !state.currentUser;
  homeMyPetsButton.disabled = false;
  homeGrowPetsButton.disabled = !state.currentUser;
  homeBattleFriendButton.disabled = !state.currentUser;
  shopButton.disabled = !state.currentUser;
  buyHeartButton.disabled = !state.currentUser;
  heartShopBuyButton.disabled = cannotBuyHeart;
  backpackClassicButton.disabled = !state.currentUser || state.equippedMascot === DEFAULT_MASCOT;
  backpackClassicButton.textContent = state.equippedMascot === DEFAULT_MASCOT ? "Equipped" : "Equip";
  renderMascotButtons();
  renderBattlePetButtons();
  renderBattleShopButtons();
  renderPetSeeds();
  heartShopBuyButton.textContent = state.hearts >= MAX_PROFILE_HEARTS
    ? "Hearts Full"
    : `Buy Heart - ${HEART_COST} Wiz Bucks`;
  renderBattlePoints();
}

function renderMascotButtons() {
  let visibleShopItems = 0;
  for (const button of buyMascotButtons) {
    const mascotId = button.dataset.mascot;
    const owned = state.ownedMascots.includes(mascotId);
    const card = button.closest(".market-card");
    if (card) card.hidden = owned;
    if (!owned) visibleShopItems += 1;
    button.disabled =
      !state.currentUser ||
      state.equippedMascot === mascotId ||
      (!owned && state.coins < MASCOT_PRICE);
    button.textContent = "Buy";
  }
  shopEmptyMessage.hidden = visibleShopItems > 0;

  for (const button of backpackMascotButtons) {
    const mascotId = button.dataset.mascot;
    const owned = state.ownedMascots.includes(mascotId);
    const card = document.querySelector(`#${mascotId}-mascot-card`);
    const label = document.querySelector(`#${mascotId}-owned-label`);
    if (card) {
      card.hidden = !owned;
      card.classList.toggle("locked", false);
    }
    if (label) label.textContent = owned ? "Owned" : "Locked";
    button.disabled = !state.currentUser || !owned || state.equippedMascot === mascotId;
    button.textContent = state.equippedMascot === mascotId
      ? "Equipped"
      : owned
        ? "Equip"
        : "Locked";
  }
}

function renderBattlePetButtons() {
  let visibleShopPets = 0;
  for (const button of buyBattlePetButtons) {
    const petId = button.dataset.pet;
    const owned = state.ownedBattlePets.includes(petId);
    const card = button.closest(".market-card");
    if (card) card.hidden = owned;
    if (!owned) visibleShopPets += 1;
    button.disabled = !state.currentUser || state.coins < BATTLE_PET_PRICE;
    button.textContent = "Buy";
  }
  shopPetEmptyMessage.hidden = visibleShopPets > 0;
}

function renderBattleShopButtons() {
  buyPetXpPackButton.disabled = !state.currentUser || state.leaderboardPoints < PET_XP_PACK_COST;
  buyPetXpPackButton.textContent = state.leaderboardPoints >= PET_XP_PACK_COST
    ? "Buy 1000 XP"
    : `Need ${PET_XP_PACK_COST} Battle Points`;
  buyPetSeedsPackButton.disabled = !state.currentUser || state.leaderboardPoints < PET_SEEDS_PACK_COST;
  buyPetSeedsPackButton.textContent = state.leaderboardPoints >= PET_SEEDS_PACK_COST
    ? "Buy 10 Pet Seeds"
    : `Need ${PET_SEEDS_PACK_COST} Battle Points`;
}

function renderMyPets() {
  myTeamGrid.replaceChildren();
  ownedPetsGrid.replaceChildren();
  for (const pet of state.playerTeam) {
    myTeamGrid.append(createPetCollectionCard(pet, { active: true }));
  }

  const ownedPetsById = new Map();
  for (const pet of createPlayerTeam()) {
    ownedPetsById.set(pet.id, pet);
  }
  for (const pet of state.playerTeam) {
    ownedPetsById.set(pet.id, pet);
  }
  for (const pet of state.ownedBattlePets
    .map((petId) => SHOP_BATTLE_PETS[petId])
    .filter(Boolean)
    .map((pet) => makePet(pet.name, pet.kind, pet.element, pet.model, pet.body, pet.ear, pet.accent))) {
    ownedPetsById.set(pet.id, pet);
  }
  const ownedPets = [...ownedPetsById.values()];

  if (ownedPets.length === 0) {
    const empty = document.createElement("p");
    empty.className = "pet-list-empty";
    empty.textContent = "Buy pets in the Shop to add them here.";
    ownedPetsGrid.append(empty);
    return;
  }

  for (const pet of ownedPets) {
    ownedPetsGrid.append(createPetCollectionCard(pet, { selectable: true, active: isPetOnActiveTeam(pet) }));
  }
}

function createPetCollectionCard(pet, options = {}) {
  const card = document.createElement("article");
  card.className = "market-card";
  if (options.active) card.classList.add("selected-pet");
  if (options.selectable) {
    card.classList.add("selectable-pet");
    card.tabIndex = 0;
    card.addEventListener("click", () => chooseBattlePet(pet));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        chooseBattlePet(pet);
      }
    });
  }
  const art = document.createElement("div");
  art.className = `market-card-art ${pet.element}-pet`;
  const title = document.createElement("h3");
  title.textContent = petDisplayName(pet);
  const details = document.createElement("p");
  details.textContent = `${ELEMENTS[pet.element].label} • HP ${pet.maxHp ?? MAX_HP} • XP ${pet.xp}`;
  const action = document.createElement("p");
  action.textContent = options.active ? "On Team" : options.selectable ? "Click to add" : "";
  card.append(art, title, details);
  if (action.textContent) card.append(action);
  return card;
}

function chooseBattlePet(pet) {
  state.activePetByElement[pet.element] = pet.id;
  saveGame();
  resetTeams();
  renderMyPets();
  if (state.threeReady && state.battleActive) rebuildPetMeshes();
}

function isPetOnActiveTeam(pet) {
  return state.playerTeam.some((teamPet) => teamPet.id === pet.id);
}

function renderHomeMascot() {
  if (!loadMascot) return;
  loadMascot.classList.toggle("crystal-dragon", state.equippedMascot === "crystal-dragon");
  loadMascot.classList.toggle("leaf-panda", state.equippedMascot === "leaf-panda");
  loadMascot.classList.toggle("moon-bunny", state.equippedMascot === "moon-bunny");
  loadMascot.classList.toggle("sun-lion", state.equippedMascot === "sun-lion");
  loadMascot.classList.toggle("sky-koala", state.equippedMascot === "sky-koala");
}

function resizeRenderer() {
  if (!state.threeReady) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if (!state.threeReady) return;

  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();
  for (const mixer of mixers) mixer.update(delta);
  playerPetMeshes.forEach((pet, index) => {
    pet.rotation.y = 0.35 + Math.sin(elapsed * 1.6 + index) * 0.06;
  });
  rivalPetMeshes.forEach((pet, index) => {
    pet.rotation.y = -0.35 + Math.sin(elapsed * 1.4 + index + 1) * 0.06;
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
