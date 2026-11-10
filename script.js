const pet = document.getElementById("pet");
const speech = document.getElementById("speech");
const status = document.getElementById("status");
const hearts = document.getElementById("hearts");

const moodBar = document.getElementById("mood-bar");
const friendshipBar = document.getElementById("friendship-bar");
const friendshipLevel = document.getElementById("friendship-level");
const giftCount = document.getElementById("gift-count");

const petButton = document.getElementById("pet-button");
const talkButton = document.getElementById("talk-button");
const giftButton = document.getElementById("gift-button");
const sleepButton = document.getElementById("sleep-button");
const wakeButton = document.getElementById("wake-button");

// Все изображения Коломбины
const emotions = {
    idle: "image/idle.png",
    happy: "image/happy.png",
    shy: "image/shy.png",
    confused: "image/confused.png",
    sad: "image/sad.png",
    annoyed: "image/annoyed.png",
    sleepy: "image/sleepy.png",
    surprised: "image/surprised.png",
    cuddle: "image/cuddle.png",
    peek: "image/peek.png",
    flower: "image/flower.png",
    back: "image/back.png",
    dazzled: "image/dazzled.png",
    flustered: "image/flustered.png",
    excited: "image/excited.png",
    exhausted: "image/exhausted.png"
};

// Загружаем изображения заранее
Object.values(emotions).forEach(path => {
    const image = new Image();
    image.src = path;
});

// Случайные реплики
const messages = [
    "Как тихо и красиво сегодня...",
    "Ты снова пришла ко мне? ♡",
    "Мне нравится проводить с тобой время.",
    "Посидим немного вместе?",
    "Как приятно слышать твой голос...",
    "Здесь так спокойно.",
    "Я рада, что ты рядом."
];

const happyMessages = [
    "Хи-хи... мне приятно! ♡",
    "Это так мило!",
    "Спасибо за нежность...",
    "Ты очень добрая!",
    "Мне нравится!"
];

const giftMessages = [
    "Какой красивый цветочек!",
    "Это для меня? ♡",
    "Спасибо за подарок!",
    "Я буду беречь его.",
    "Какое чудо!"
];

let savedData = {};

try {
    savedData = JSON.parse(
        localStorage.getItem("columbinaPet")
    ) || {};
} catch {
    savedData = {};
}

let mood = savedData.mood ?? 80;
let friendship = savedData.friendship ?? 10;
let gifts = savedData.gifts ?? 0;

let isSleeping = false;
let emotionTimer;
let idleTimer;

function saveProgress() {
    localStorage.setItem(
        "columbinaPet",
        JSON.stringify({ mood, friendship, gifts })
    );
}

function updateStats() {
    mood = Math.max(0, Math.min(100, mood));
    friendship = Math.max(0, friendship);

    moodBar.style.width = mood + "%";

    friendshipBar.style.width =
        (friendship % 100) + "%";

    friendshipLevel.textContent =
        "Уровень дружбы: " +
        (Math.floor(friendship / 100) + 1);

    giftCount.textContent = "Подарки: " + gifts;

    saveProgress();
}

// Смена изображения
function changeEmotion(emotion) {
    if (!emotions[emotion]) return;

    pet.src = emotions[emotion];

    pet.classList.remove("happy", "sleeping");

    if (emotion === "happy" || emotion === "excited") {
        pet.classList.add("happy");
    }

    if (emotion === "sleepy" || emotion === "exhausted") {
        pet.classList.add("sleeping");
    }
}

// Временная эмоция с возвращением к обычной
function temporaryEmotion(emotion, duration = 2500) {
    clearTimeout(emotionTimer);

    changeEmotion(emotion);

    emotionTimer = setTimeout(() => {
        if (!isSleeping) {
            changeEmotion("idle");
        }
    }, duration);
}

function say(text) {
    speech.textContent = text;
}

// Сердечки и звёздочки
function createHearts(amount = 5) {
    const symbols = ["♡", "♥", "✧", "✦"];

    for (let i = 0; i < amount; i++) {
        const heart = document.createElement("span");

        heart.className = "heart";

        heart.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left = Math.random() * 85 + "%";
        heart.style.top = Math.random() * 60 + 10 + "%";

        hearts.appendChild(heart);

        setTimeout(() => heart.remove(), 1300);
    }
}

// Поглаживание
function petColumbina() {
    if (isSleeping) {
        say("Тише... Коломбина спит. Zzz");
        return;
    }

    mood += 8;
    friendship += 5;

    updateStats();

    temporaryEmotion(
        Math.random() < 0.3 ? "shy" : "happy"
    );

    say(
        happyMessages[
            Math.floor(Math.random() * happyMessages.length)
        ]
    );

    createHearts(7);

    status.textContent = "Коломбине приятно! ♡";
}

petButton.addEventListener("click", petColumbina);

let lastPetTime = 0;

pet.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;

    const now = Date.now();

    // Не чаще одного раза в 700 мс
    if (now - lastPetTime < 700) return;

    lastPetTime = now;
    petColumbina();
});

// На телефоне и планшете — поглаживание касанием
pet.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
        petColumbina();
    }
});

// Разговор
talkButton.addEventListener("click", () => {
    if (isSleeping) {
        say("Коломбина сладко спит...");
        return;
    }

    const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

    say(randomMessage);

    const reactions = [
        "idle",
        "confused",
        "surprised",
        "peek",
        "dazzled"
    ];

    const emotion =
        reactions[Math.floor(Math.random() * reactions.length)];

    temporaryEmotion(emotion, 3000);

    mood += 2;
    updateStats();

    status.textContent = "Коломбина слушает тебя...";
});

// Подарок
giftButton.addEventListener("click", () => {
    if (isSleeping) {
        say("Подарим ей цветочек, когда она проснётся...");
        return;
    }

    gifts++;
    friendship += 10;
    mood += 10;

    updateStats();

    changeEmotion("flower");

    say(
        giftMessages[
            Math.floor(Math.random() * giftMessages.length)
        ]
    );

    createHearts(10);

    status.textContent = "Коломбина получила цветочек!";

    clearTimeout(emotionTimer);

    emotionTimer = setTimeout(() => {
        changeEmotion("happy");
    }, 3000);
});

// Сон
sleepButton.addEventListener("click", () => {
    if (isSleeping) return;

    isSleeping = true;

    clearTimeout(emotionTimer);

    changeEmotion("sleepy");

    sleepButton.hidden = true;
    wakeButton.hidden = false;

    say("Спокойной ночи... Zzz ♡");

    status.textContent = "Коломбина сладко спит...";
});

// Пробуждение
wakeButton.addEventListener("click", () => {
    isSleeping = false;

    changeEmotion("surprised");

    sleepButton.hidden = false;
    wakeButton.hidden = true;

    mood += 5;
    updateStats();

    say("Ох... уже утро? ♡");

    status.textContent = "Коломбина проснулась!";

    createHearts(4);

    setTimeout(() => {
        if (!isSleeping) changeEmotion("idle");
    }, 2500);
});

// Иногда Коломбина меняет эмоции самостоятельно
function startIdleReactions() {
    clearInterval(idleTimer);

    idleTimer = setInterval(() => {
        if (isSleeping) return;

        const randomEmotion = [
            "idle",
            "shy",
            "peek",
            "confused",
            "dazzled"
        ];

        const emotion =
            randomEmotion[
                Math.floor(Math.random() * randomEmotion.length)
            ];

        temporaryEmotion(emotion, 2200);
    }, 18000);
}

// Начальное состояние
changeEmotion("idle");
updateStats();
startIdleReactions();

say("...Ты пришла ко мне? ♡");