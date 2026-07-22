// Okey 101 - Combined Application Script
// Bypasses browser CORS policy when index.html is opened directly via file:// protocol.

// ==========================================
// 1. AUDIO SYNTHESIZER
// ==========================================
class OkeyAudio {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        } catch (e) {
            console.warn("AudioContext init error:", e);
        }
    }

    playClack(volume = 0.5, pitchMultiplier = 1.0) {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const now = this.ctx.currentTime;

            const bufferSize = this.ctx.sampleRate * 0.05;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseNode = this.ctx.createBufferSource();
            noiseNode.buffer = buffer;

            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = 1200 * pitchMultiplier;
            noiseFilter.Q.value = 3.0;

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(volume * 0.4, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            noiseNode.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);

            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2200 * pitchMultiplier, now);
            
            const osc2 = this.ctx.createOscillator();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(3400 * pitchMultiplier, now);

            const oscGain = this.ctx.createGain();
            oscGain.gain.setValueAtTime(volume * 0.3, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            const osc2Gain = this.ctx.createGain();
            osc2Gain.gain.setValueAtTime(volume * 0.15, now);
            osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            osc.connect(oscGain);
            oscGain.connect(this.ctx.destination);

            osc2.connect(osc2Gain);
            osc2Gain.connect(this.ctx.destination);

            noiseNode.start(now);
            noiseNode.stop(now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            osc2.start(now);
            osc2.stop(now + 0.05);
        } catch (e) {
            console.warn("playClack audio error:", e);
        }
    }

    playShuffle() {
        try {
            this.init();
            if (!this.ctx) return;
            const clackCount = 8 + Math.floor(Math.random() * 5);
            let timeDelay = 0;
            for (let i = 0; i < clackCount; i++) {
                timeDelay += 60 + Math.random() * 80;
                setTimeout(() => {
                    const vol = 0.2 + Math.random() * 0.3;
                    const pitch = 0.8 + Math.random() * 0.4;
                    this.playClack(vol, pitch);
                }, timeDelay);
            }
        } catch (e) {
            console.warn("playShuffle audio error:", e);
        }
    }

    playDiscard() {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const now = this.ctx.currentTime;
            const duration = 0.15;

            const bufferSize = this.ctx.sampleRate * duration;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noiseNode = this.ctx.createBufferSource();
            noiseNode.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + duration);
            filter.Q.value = 2.0;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            noiseNode.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noiseNode.start(now);
            noiseNode.stop(now + duration);

            setTimeout(() => {
                this.playClack(0.4, 0.95);
            }, duration * 1000);
        } catch (e) {
            console.warn("playDiscard audio error:", e);
        }
    }

    playWin() {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
            
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.12);

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.001, now + idx * 0.12);
                gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.12);
                osc.stop(now + idx * 0.12 + 0.4);
            });
        } catch (e) {
            console.warn("playWin audio error:", e);
        }
    }

    playError() {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.18);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {
            console.warn("playError audio error:", e);
        }
    }
}
const audio = new OkeyAudio();

// ==========================================
// 2. GAME MODEL DEFINITIONS
// ==========================================
class Tile {
    constructor(id, color, number, isFakeJoker = false) {
        this.id = id;
        this.color = color;
        this.number = number;
        this.isFakeJoker = isFakeJoker;
    }
}

class GameState {
    constructor() {
        let initialChips = 5000;
        try {
            const saved = localStorage.getItem('okey_player_chips');
            if (saved !== null) initialChips = parseInt(saved);
        } catch (e) {}

        this.players = [
            { name: "Siz", hand: [], openedMelds: [], openedInPairs: false, discards: [], isHuman: true, score: 0, chips: initialChips },
            { name: "Bot 1 (Metin)", hand: [], openedMelds: [], openedInPairs: false, discards: [], isHuman: false, score: 0, chips: 5000 },
            { name: "Bot 2 (Canan)", hand: [], openedMelds: [], openedInPairs: false, discards: [], isHuman: false, score: 0, chips: 5000 },
            { name: "Bot 3 (Oya)", hand: [], openedMelds: [], openedInPairs: false, discards: [], isHuman: false, score: 0, chips: 5000 }
        ];
        this.entryBet = 100;
        this.roundPot = 0;
        this.rolledOverPot = 0;
        this.deck = [];
        this.indicatorTile = null;
        this.okeyTile = null;
        
        this.turn = 0;
        this.dealer = 0;
        this.round = 1;
        this.maxRounds = 3;
        this.status = "setup";
        
        this.drawnThisTurn = false;
        this.discardTakenThisTurn = false;
        this.lastDiscardedTile = null;

        this.progressiveMode = false;
        this.partnerMode = false;
        this.currentOpenThreshold = 101;
        this.lastIslekDiscarder = null;
        this.lastIslekTile = null;
    }

    createDeck() {
        const colors = ['red', 'blue', 'black', 'yellow'];
        const deck = [];
        let idCounter = 0;

        for (let set = 1; set <= 2; set++) {
            for (const color of colors) {
                for (let num = 1; num <= 13; num++) {
                    deck.push(new Tile(`tile-${idCounter++}`, color, num));
                }
            }
        }

        deck.push(new Tile(`tile-${idCounter++}`, 'joker', 0, true));
        deck.push(new Tile(`tile-${idCounter++}`, 'joker', 0, true));

        this.deck = deck;
    }

    shuffleDeck() {
        // Run 5 passes of Fisher-Yates shuffle for maximum entropy and 100% fair random dealing
        for (let pass = 0; pass < 5; pass++) {
            for (let i = this.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
            }
        }
    }

    determineOkey() {
        let indicatorIdx;
        do {
            indicatorIdx = Math.floor(Math.random() * this.deck.length);
        } while (this.deck[indicatorIdx].isFakeJoker);

        this.indicatorTile = this.deck[indicatorIdx];
        
        // Move indicator tile to the bottom of the deck (index 0) so it remains in the 106-tile deck
        this.deck.splice(indicatorIdx, 1);
        this.deck.unshift(this.indicatorTile);

        const nextNum = this.indicatorTile.number === 13 ? 1 : this.indicatorTile.number + 1;
        
        this.okeyTile = {
            color: this.indicatorTile.color,
            number: nextNum
        };

        this.deck.forEach(tile => {
            if (tile.isFakeJoker) {
                tile.color = this.okeyTile.color;
                tile.number = this.okeyTile.number;
            } else if (tile.color === this.okeyTile.color && tile.number === this.okeyTile.number) {
                tile.isOkey = true;
            }
        });
    }

    startNewRound() {
        this.createDeck();
        this.shuffleDeck();
        this.determineOkey();

        console.log("--- DESTE DOĞRULAMASI ---");
        console.log("Toplam Taş Sayısı:", this.deck.length);
        console.log("Renk Dağılımı:", this.deck.reduce((acc, t) => { acc[t.color] = (acc[t.color] || 0) + 1; return acc; }, {}));
        console.log("Sahte Okey Sayısı:", this.deck.filter(t => t.isFakeJoker).length);
        console.log("-------------------------");

        this.players.forEach(player => {
            if (player.chips < this.entryBet) {
                player.chips += 10000;
            }
            player.chips -= this.entryBet;

            player.hand = [];
            player.openedMelds = [];
            player.openedInPairs = false;
            player.discards = [];
            player.islekPenaltyCount = 0;
            player.canShowIndicator = true;
            player.drewDiscardToOpen = false;
            player.lastDiscardDrawPenalty = 0;
            player.initialOpeningSum = 0;
            player.showedIndicatorThisRound = false;
            player.lastIndicatorDiscount = 0;
        });

        this.roundPot = (4 * this.entryBet) + this.rolledOverPot;
        this.rolledOverPot = 0;

        try {
            localStorage.setItem('okey_player_chips', this.players[0].chips);
        } catch (e) {}

        this.lastIslekDiscarder = null;
        this.lastIslekTile = null;
        this.currentOpenThreshold = 101;

        this.dealer = (this.round - 1) % 4;
        this.turn = this.dealer;

        // Deal tiles round-robin (1 tile at a time to each player around the table) for true 100% fair random distribution
        for (let round = 0; round < 21; round++) {
            for (let p = 0; p < 4; p++) {
                this.players[p].hand.push(this.deck.pop());
            }
        }
        // Dealer gets the 22nd tile
        this.players[this.dealer].hand.push(this.deck.pop());

        // The dealer starts with 22 tiles and does not draw on the first turn
        this.drawnThisTurn = true;
        this.discardTakenThisTurn = false;
        this.lastDiscardedTile = null;
        this.status = "playing";
    }

    startNewGame(maxRounds = 3) {
        this.maxRounds = maxRounds;
        this.round = 1;
        this.players.forEach(p => p.score = 0);
        this.startNewRound();
        this.status = "playing";
    }

    isWildcard(tile) {
        return tile && tile.isOkey === true;
    }

    isFakeJoker(tile) {
        return tile && tile.isFakeJoker === true;
    }

    drawTile(playerIdx) {
        if (this.status !== "playing" || playerIdx !== this.turn || this.drawnThisTurn) return null;
        if (this.deck.length === 0) {
            this.endRoundNull();
            return null;
        }

        const tile = this.deck.pop();
        this.players[playerIdx].hand.push(tile);
        this.drawnThisTurn = true;
        this.discardTakenThisTurn = false;
        this.players[playerIdx].canShowIndicator = false;
        return tile;
    }

    drawFromDiscard(playerIdx) {
        if (this.status !== "playing" || playerIdx !== this.turn || this.drawnThisTurn) return null;

        const prevPlayerIdx = (playerIdx + 3) % 4;
        const prevDiscards = this.game ? this.game.players[prevPlayerIdx].discards : this.players[prevPlayerIdx].discards;
        if (prevDiscards.length === 0) return null;

        const tile = prevDiscards[prevDiscards.length - 1];
        
        const player = this.players[playerIdx];
        const hasOpened = player.openedMelds.length > 0 || player.openedInPairs;
        if (!hasOpened) {
            player.drewDiscardToOpen = true;
        }

        prevDiscards.pop();
        this.players[playerIdx].hand.push(tile);
        this.drawnThisTurn = true;
        this.discardTakenThisTurn = true;
        this.lastDiscardedTile = tile;
        this.players[playerIdx].canShowIndicator = false;
        return tile;
    }

    returnDiscardTile(playerIdx) {
        if (!this.discardTakenThisTurn || !this.lastDiscardedTile) return;
        
        const hand = this.players[playerIdx].hand;
        const index = hand.findIndex(t => t.id === this.lastDiscardedTile.id);
        if (index !== -1) {
            hand.splice(index, 1);
            const prevPlayerIdx = (playerIdx + 3) % 4;
            this.players[prevPlayerIdx].discards.push(this.lastDiscardedTile);
            this.drawnThisTurn = false;
            this.discardTakenThisTurn = false;
            this.lastDiscardedTile = null;
        }
    }

    discardTile(playerIdx, tileId) {
        if (this.status !== "playing" || playerIdx !== this.turn || !this.drawnThisTurn) return false;

        if (this.discardTakenThisTurn && this.lastDiscardedTile) {
            const stillInHand = this.players[playerIdx].hand.some(t => t.id === this.lastDiscardedTile.id);
            if (stillInHand) return false;
        }

        const player = this.players[playerIdx];
        const tileIdx = player.hand.findIndex(t => t.id === tileId);
        if (tileIdx === -1) return false;

        const tile = player.hand[tileIdx];

        // Check if the discarded tile is playable (işlek) on any table meld
        let isIslek = false;
        for (let pIdx = 0; pIdx < 4; pIdx++) {
            const targetPlayer = this.players[pIdx];
            for (let mIdx = 0; mIdx < targetPlayer.openedMelds.length; mIdx++) {
                const targetMeld = targetPlayer.openedMelds[mIdx];
                
                // Try prepend
                const testPrepend = [tile, ...targetMeld];
                if (this.validateMeld(testPrepend).valid) {
                    isIslek = true;
                    break;
                }
                
                // Try append
                const testAppend = [...targetMeld, tile];
                if (this.validateMeld(testAppend).valid) {
                    isIslek = true;
                    break;
                }
            }
            if (isIslek) break;
        }

        if (isIslek) {
            player.islekPenaltyCount = (player.islekPenaltyCount || 0) + 1;
            this.lastIslekDiscarder = playerIdx;
            this.lastIslekTile = tile;
        } else {
            this.lastIslekDiscarder = null;
            this.lastIslekTile = null;
        }

        player.hand.splice(tileIdx, 1);
        player.discards.push(tile);
        player.canShowIndicator = false;

        if (player.hand.length === 0) {
            this.endRound(playerIdx, tile);
            return true;
        }

        this.turn = (this.turn + 1) % 4;
        this.drawnThisTurn = false;
        this.discardTakenThisTurn = false;
        this.lastDiscardedTile = null;

        if (this.deck.length === 0) {
            this.endRoundNull();
            return true;
        }

        return true;
    }

    validateMeld(meld) {
        if (meld.length < 3) return { valid: false, reason: "Per en az 3 taştan oluşmalıdır." };

        const wildcardsCount = meld.filter(t => this.isWildcard(t)).length;
        if (wildcardsCount === meld.length) {
            return { valid: true, type: 'run' };
        }

        const nonWildcards = meld.filter(t => !this.isWildcard(t));
        const firstTile = nonWildcards[0];

        const sameColor = nonWildcards.every(t => t.color === firstTile.color);
        const sameNumber = nonWildcards.every(t => t.number === firstTile.number);

        if (sameColor) {
            let validNormal = true;
            let anchorIdx = meld.findIndex(t => !this.isWildcard(t));
            let anchorVal = meld[anchorIdx].number;
            let startVal = anchorVal - anchorIdx;

            for (let i = 0; i < meld.length; i++) {
                const targetVal = startVal + i;
                if (targetVal < 1 || targetVal > 13) {
                    validNormal = false;
                    break;
                }
                const tile = meld[i];
                if (!this.isWildcard(tile) && tile.number !== targetVal) {
                    validNormal = false;
                    break;
                }
            }

            if (validNormal) {
                return { valid: true, type: 'run', high: false };
            }
            return { valid: false, reason: "Seri per ardışık sayılardan oluşmalıdır (ör. Kırmızı 5-6-7)." };

        } else if (sameNumber) {
            if (meld.length > 4) {
                return { valid: false, reason: "Grup per en fazla 4 taştan oluşabilir." };
            }

            const colors = nonWildcards.map(t => t.color);
            const uniqueColors = new Set(colors);
            if (colors.length !== uniqueColors.size) {
                return { valid: false, reason: "Grup perde aynı renkten birden fazla taş bulunamaz." };
            }

            return { valid: true, type: 'group' };
        }

        return { valid: false, reason: "Per ya aynı renkten ardışık sayılar ya da farklı renklerden aynı sayılar olmalıdır." };
    }

    calculateMeldPoints(meld) {
        const validation = this.validateMeld(meld);
        if (!validation.valid) return 0;

        let sum = 0;
        if (validation.type === 'group') {
            const normalTile = meld.find(t => !this.isWildcard(t));
            const val = normalTile ? normalTile.number : this.okeyTile.number;
            return meld.length * val;
        }

        const isHighRun = validation.high;

        const anchorIdx = meld.findIndex(t => !this.isWildcard(t));
        if (anchorIdx === -1) {
            return meld.length * this.okeyTile.number;
        }

        const anchorVal = meld[anchorIdx].number;
        const use14 = isHighRun;
        const getVal = (num) => (use14 && num === 1) ? 14 : num;
        
        const startVal = getVal(anchorVal) - anchorIdx;

        for (let i = 0; i < meld.length; i++) {
            const tile = meld[i];
            if (this.isWildcard(tile)) {
                sum += (startVal + i === 14) ? 1 : (startVal + i);
            } else {
                sum += tile.number;
            }
        }
        return sum;
    }

    validatePairs(pairs, isAlreadyOpenedInPairs = false) {
        if (!isAlreadyOpenedInPairs && pairs.length < 5) {
            return { valid: false, reason: "Çift açmak için en az 5 çift gereklidir." };
        }
        if (pairs.length < 1) {
            return { valid: false, reason: "En az 1 çift seçilmelidir." };
        }
        
        for (const pair of pairs) {
            if (pair.length !== 2) return { valid: false, reason: "Her çift tam olarak 2 taştan oluşmalıdır." };
            const [t1, t2] = pair;

            if (this.indicatorTile) {
                const isIndicator = (t) => !t.isFakeJoker && !t.isOkey && t.color === this.indicatorTile.color && t.number === this.indicatorTile.number;
                if (isIndicator(t1) || isIndicator(t2)) {
                    return { valid: false, reason: "Gösterge taşı çift olarak kullanılamaz!" };
                }
            }
            
            if (this.isWildcard(t1) || this.isWildcard(t2)) {
                continue;
            }

            if (t1.color !== t2.color || t1.number !== t2.number) {
                return { valid: false, reason: "Çiftler birebir aynı taşlardan oluşmalıdır." };
            }
        }
        return { valid: true };
    }

    openMelds(playerIdx, melds) {
        if (playerIdx !== this.turn) return { success: false, reason: "Sıra sizde değil." };
        if (!this.drawnThisTurn) return { success: false, reason: "Önce yerden veya desteden taş çekmelisiniz." };

        const player = this.players[playerIdx];
        if (player.openedInPairs) {
            return { success: false, reason: "Çift açtıktan sonra per açamazsınız!" };
        }

        if (player.drewDiscardToOpen && player.drawnDiscardTile) {
            const allOpenedTiles = melds.flat();
            const usesDrawnTile = allOpenedTiles.some(t => t.id === player.drawnDiscardTile.id);
            if (!usesDrawnTile) {
                return { success: false, reason: "Yerden çektiğiniz taş açtığınız perlerin içinde yer almalıdır!" };
            }
        }

        const hasOpenedBefore = player.openedMelds.length > 0 || player.openedInPairs;

        let totalSum = 0;
        for (const meld of melds) {
            const validation = this.validateMeld(meld);
            if (!validation.valid) {
                return { success: false, reason: validation.reason };
            }
            totalSum += this.calculateMeldPoints(meld);
        }

        if (!hasOpenedBefore) {
            const required = this.getRequiredOpenThreshold(playerIdx);
            if (totalSum < required) {
                return { success: false, reason: `Açmak için perlerin toplamı en az ${required} olmalıdır. Şu anki toplam: ${totalSum}` };
            }
        }

        for (const meld of melds) {
            for (const tile of meld) {
                const idx = player.hand.findIndex(t => t.id === tile.id);
                if (idx === -1) {
                    return { success: false, reason: "Elinizde olmayan bir taş kullanılmaya çalışıldı." };
                }
                player.hand.splice(idx, 1);
            }
            player.openedMelds.push(meld);
        }

        if (!hasOpenedBefore) {
            player.initialOpeningSum = totalSum;
        }

        if (!hasOpenedBefore && this.progressiveMode) {
            this.currentOpenThreshold = Math.max(this.currentOpenThreshold, totalSum + 1);
        }

        return { success: true, sum: totalSum };
    }

    getRequiredOpenThreshold(playerIdx) {
        if (!this.progressiveMode) {
            return 101;
        }

        const partnerIdx = (playerIdx + 2) % 4;
        let maxOpponentScore = 0;

        for (let p = 0; p < 4; p++) {
            if (p === playerIdx) continue;
            if (this.partnerMode && p === partnerIdx) continue; // Partner's score is ignored for progressive limit!

            const player = this.players[p];
            if (player.openedMelds.length > 0 && !player.openedInPairs) {
                if (player.initialOpeningSum > maxOpponentScore) {
                    maxOpponentScore = player.initialOpeningSum;
                }
            }
        }

        if (maxOpponentScore > 0) {
            return maxOpponentScore + 1;
        }

        return 101;
    }

    openPairs(playerIdx, pairs) {
        if (playerIdx !== this.turn) return { success: false, reason: "Sıra sizde değil." };
        if (!this.drawnThisTurn) return { success: false, reason: "Önce yerden veya desteden taş çekmelisiniz." };

        const player = this.players[playerIdx];
        if (player.openedMelds.length > 0 && !player.openedInPairs) {
            return { success: false, reason: "Zaten seri açtınız, çift açamazsınız." };
        }

        if (player.drewDiscardToOpen && player.drawnDiscardTile) {
            const allOpenedTiles = pairs.flat();
            const usesDrawnTile = allOpenedTiles.some(t => t.id === player.drawnDiscardTile.id);
            if (!usesDrawnTile) {
                return { success: false, reason: "Yerden çektiğiniz taş açtığınız çiftlerin içinde yer almalıdır!" };
            }
        }

        const isAlreadyOpenedInPairs = player.openedInPairs;
        const validation = this.validatePairs(pairs, isAlreadyOpenedInPairs);
        if (!validation.valid) {
            return { success: false, reason: validation.reason };
        }

        for (const pair of pairs) {
            for (const tile of pair) {
                const idx = player.hand.findIndex(t => t.id === tile.id);
                if (idx === -1) {
                    return { success: false, reason: "Elinizde olmayan bir taş kullanılmaya çalışıldı." };
                }
                player.hand.splice(idx, 1);
            }
            player.openedMelds.push(pair);
        }

        player.openedInPairs = true;
        return { success: true };
    }

    showIndicator(playerIdx) {
        const player = this.players[playerIdx];
        if (!player.canShowIndicator || playerIdx !== this.turn || this.drawnThisTurn) {
            return { success: false, reason: "Göstergeyi sadece ilk turunuzda, taş çekmeden önce gösterebilirsiniz." };
        }

        const indicator = this.indicatorTile;
        const hasIndicator = player.hand.some(t => !t.isFakeJoker && !t.isOkey && t.color === indicator.color && t.number === indicator.number);

        if (!hasIndicator) {
            return { success: false, reason: "Elinizde gösterge taşı bulunmuyor!" };
        }

        player.showedIndicatorThisRound = true;
        player.canShowIndicator = false;
        return { success: true, tile: indicator };
    }

    addTileToTable(playerIdx, tileId, targetPlayerIdx, meldIdx, appendToStart = false) {
        if (playerIdx !== this.turn) return { success: false, reason: "Sıra sizde değil." };
        if (!this.drawnThisTurn) return { success: false, reason: "Önce yerden veya desteden taş çekmelisiniz." };

        const player = this.players[playerIdx];
        const targetPlayer = this.players[targetPlayerIdx];
        
        const hasOpened = player.openedMelds.length > 0 || player.openedInPairs;
        if (!hasOpened) {
            return { success: false, reason: "Yere taş işlemek için önce kendi elinizi açmış olmalısınız." };
        }

        if (targetPlayer.openedInPairs) {
            return { success: false, reason: "Çift perlere taş işlenemez." };
        }

        const tileIdx = player.hand.findIndex(t => t.id === tileId);
        if (tileIdx === -1) return { success: false, reason: "Taş elinizde bulunamadı." };
        const tile = player.hand[tileIdx];

        const targetMeld = targetPlayer.openedMelds[meldIdx];
        if (!targetMeld) return { success: false, reason: "Hedef per bulunamadı." };

        // Prohibit Okey swapping with +101 penalty (Kendi taşınla Okey almak yasak + 101 Ceza)
        for (let i = 0; i < targetMeld.length; i++) {
            if (this.isWildcard(targetMeld[i])) {
                const rep = this.getOkeyRepresentationInMeld(targetMeld, i);
                if (rep && !tile.isFakeJoker && !tile.isOkey && tile.color === rep.color && tile.number === rep.number) {
                    player.score += 101;
                    return { success: false, reason: "Açılmış perdeki Okey'i değiştirmek yasaktır! Kural ihlali: +101 Ceza Puanı eklendi." };
                }
            }
        }

        // Check for appending/prepending to start or end of meld
        const testMeld = [...targetMeld];
        if (appendToStart) {
            testMeld.unshift(tile);
        } else {
            testMeld.push(tile);
        }

        const validation = this.validateMeld(testMeld);
        if (!validation.valid) {
            return { success: false, reason: "Taş bu pere uyum sağlamıyor." };
        }

        player.hand.splice(tileIdx, 1);
        if (appendToStart) {
            targetMeld.unshift(tile);
        } else {
            targetMeld.push(tile);
        }

        return { success: true };
    }

    getOkeyRepresentationInMeld(meld, okeyIndex) {
        const nonOkeyTiles = meld.filter(t => !t.isOkey);
        if (nonOkeyTiles.length === 0) return null;
        
        const isGroup = nonOkeyTiles.every(t => t.number === nonOkeyTiles[0].number);
        if (isGroup) {
            const expectedNumber = nonOkeyTiles[0].number;
            const usedColors = nonOkeyTiles.map(t => t.color);
            const allColors = ['red', 'blue', 'black', 'yellow'];
            const missingColors = allColors.filter(c => !usedColors.includes(c));
            
            return {
                type: 'group',
                number: expectedNumber,
                allowedColors: missingColors
            };
        } else {
            const runColor = nonOkeyTiles[0].color;
            const nonOkeyIdx = meld.findIndex(t => !t.isOkey);
            const nonOkeyTile = meld[nonOkeyIdx];
            const expectedNumber = nonOkeyTile.number + (okeyIndex - nonOkeyIdx);
            
            return {
                type: 'run',
                number: expectedNumber,
                color: runColor
            };
        }
    }

    tryRetrieveOkey(playerIdx, tileId, targetPlayerIdx, meldIdx) {
        if (playerIdx !== this.turn) return { success: false, reason: "Sıra sizde değil." };
        if (!this.drawnThisTurn) return { success: false, reason: "Önce yerden veya desteden taş çekmelisiniz." };

        const player = this.players[playerIdx];
        const targetPlayer = this.players[targetPlayerIdx];
        
        const hasOpened = player.openedMelds.length > 0 || player.openedInPairs;
        if (!hasOpened) {
            return { success: false, reason: "Yere taş işlemek için önce kendi elinizi açmış olmalısınız." };
        }

        if (targetPlayer.openedInPairs) {
            return { success: false, reason: "Çift perlerden okey çalınamaz." };
        }

        const tileIdx = player.hand.findIndex(t => t.id === tileId);
        if (tileIdx === -1) return { success: false, reason: "Taş elinizde bulunamadı." };
        const playerTile = player.hand[tileIdx];

        const targetMeld = targetPlayer.openedMelds[meldIdx];
        if (!targetMeld) return { success: false, reason: "Hedef per bulunamadı." };

        for (let i = 0; i < targetMeld.length; i++) {
            const tileInMeld = targetMeld[i];
            if (tileInMeld.isOkey) {
                const rep = this.getOkeyRepresentationInMeld(targetMeld, i);
                if (!rep) continue;

                let matches = false;
                if (rep.type === 'group') {
                    matches = (playerTile.number === rep.number && rep.allowedColors.includes(playerTile.color));
                } else if (rep.type === 'run') {
                    matches = (playerTile.number === rep.number && playerTile.color === rep.color);
                }

                if (matches) {
                    player.hand.splice(tileIdx, 1);
                    const okeyTile = targetMeld[i];
                    targetMeld[i] = playerTile;
                    player.hand.push(okeyTile);

                    return { success: true, okeyTile: okeyTile, message: `Yerdeki Okey'i alıp yerine ${playerTile.color} ${playerTile.number} koydunuz!` };
                }
            }
        }

        return { success: false, reason: "Taş, yerdeki Okey'in yerine uymuyor." };
    }

    endRound(winnerIdx, discardedTile) {
        this.status = "round_end";
        const winner = this.players[winnerIdx];
        const discardedOkey = discardedTile.isOkey === true;

        this.players.forEach(p => p.lastWonChips = 0);

        this.players.forEach((player, idx) => {
            let penalty = 0;
            const hasOpened = player.openedMelds.length > 0 || player.openedInPairs;

            if (idx === winnerIdx) {
                penalty = discardedOkey ? -202 : -101;
            } else {
                if (!hasOpened) {
                    penalty = 202;
                } else {
                    const handSum = player.hand.reduce((sum, tile) => sum + (tile.isOkey ? 101 : tile.number), 0);
                    penalty = player.openedInPairs ? handSum * 2 : handSum;
                }

                if (discardedOkey) penalty *= 2;
                if (winner.openedInPairs) penalty *= 2;
            }

            // Store details for scoreboard display before adding islek ceza
            const handSumVal = (idx === winnerIdx) ? 0 : (hasOpened ? player.hand.reduce((sum, tile) => sum + (tile.isOkey ? 101 : tile.number), 0) : 202);
            player.lastHandSum = (idx === winnerIdx) ? 0 : (hasOpened && player.openedInPairs ? handSumVal * 2 : handSumVal);
            player.lastIslekPenalty = (player.islekPenaltyCount || 0) * 101;
            player.lastDiscardDrawPenalty = player.drewDiscardToOpen ? 101 : 0;
            player.lastIndicatorDiscount = player.showedIndicatorThisRound ? -101 : 0;

            let totalRoundPenalty = penalty + player.lastIslekPenalty + player.lastDiscardDrawPenalty + player.lastIndicatorDiscount;
            player.lastRoundTotal = totalRoundPenalty;

            player.score += totalRoundPenalty;
        });

        // Distribute chips based on mode
        if (this.partnerMode) {
            // Winning team gets the whole pot divided by 2
            const teamAWin = (winnerIdx === 0 || winnerIdx === 2);
            const share = Math.floor(this.roundPot / 2);
            if (teamAWin) {
                this.players[0].chips += share;
                this.players[2].chips += share;
                this.players[0].lastWonChips = share;
                this.players[2].lastWonChips = share;
            } else {
                this.players[1].chips += share;
                this.players[3].chips += share;
                this.players[1].lastWonChips = share;
                this.players[3].lastWonChips = share;
            }
        } else {
            // Solo mode: rank players by lastRoundTotal (penalty score this round)
            const sorted = [...this.players].sort((a, b) => a.lastRoundTotal - b.lastRoundTotal);
            
            const first = sorted[0];
            const second = sorted[1];
            const third = sorted[2];
            const fourth = sorted[3];

            // 1st gets 2.5 * entryBet + rolledOverPot
            // 2nd gets 1.0 * entryBet
            // 3rd gets 0.5 * entryBet
            // 4th gets 0
            const share3 = Math.floor(this.entryBet * 0.5);
            const share2 = this.entryBet;
            const share1 = this.roundPot - (share3 + share2);

            first.chips += share1;
            first.lastWonChips = share1;

            second.chips += share2;
            second.lastWonChips = share2;

            third.chips += share3;
            third.lastWonChips = share3;

            fourth.chips += 0;
            fourth.lastWonChips = 0;
        }

        this.roundPot = 0;

        try {
            localStorage.setItem('okey_player_chips', this.players[0].chips);
        } catch (e) {}
    }

    endRoundNull() {
        this.status = "round_end";
        
        this.rolledOverPot = this.roundPot;
        this.roundPot = 0;
        this.players.forEach(p => p.lastWonChips = 0);

        this.players.forEach((player, idx) => {
            const hasOpened = player.openedMelds.length > 0 || player.openedInPairs;
            let penalty = 0;
            if (!hasOpened) {
                penalty = 202;
            } else {
                const handSum = player.hand.reduce((sum, tile) => sum + (tile.isOkey ? 101 : tile.number), 0);
                penalty = player.openedInPairs ? handSum * 2 : handSum;
            }

            player.lastHandSum = penalty;
            player.lastIslekPenalty = (player.islekPenaltyCount || 0) * 101;
            player.lastDiscardDrawPenalty = player.drewDiscardToOpen ? 101 : 0;
            player.lastIndicatorDiscount = player.showedIndicatorThisRound ? -101 : 0;
            player.lastRoundTotal = penalty + player.lastIslekPenalty + player.lastDiscardDrawPenalty + player.lastIndicatorDiscount;

            player.score += player.lastRoundTotal;
        });
    }

    nextRound() {
        if (this.round >= this.maxRounds) {
            this.status = "game_end";
        } else {
            this.round++;
            this.startNewRound();
        }
    }
}

// ==========================================
// 3. AI BOT PLAYERS
// ==========================================
class OkeyBot {
    constructor(gameState) {
        this.game = gameState;
    }

    playTurn(botIdx) {
        const log = [];
        const bot = this.game.players[botIdx];

        if (this.game.turn !== botIdx || this.game.status !== 'playing') {
            return log;
        }

        if (bot.canShowIndicator) {
            const indicatorTile = this.game.indicatorTile;
            const hasIndicator = bot.hand.some(t => !t.isFakeJoker && !t.isOkey && t.color === indicatorTile.color && t.number === indicatorTile.number);
            if (hasIndicator) {
                const res = this.game.showIndicator(botIdx);
                if (res.success) {
                    log.push(`✨ ${bot.name} elindeki göstergeyi (${indicatorTile.color}-${indicatorTile.number}) gösterdi! -101 puan aldı.`);
                    audio.playWin();
                }
            }
            bot.canShowIndicator = false;
        }

        const prevPlayerIdx = (botIdx + 3) % 4;
        const prevDiscards = this.game.players[prevPlayerIdx].discards;
        let drewFromDiscard = false;

        // In Okey 101, if a player already has 22 tiles (e.g. dealer on the first turn), they do not draw!
        if (bot.hand.length < 22) {
            if (prevDiscards.length > 0) {
                const potentialTile = prevDiscards[prevDiscards.length - 1];
                const canUseDiscard = this.evaluateDiscardUse(botIdx, potentialTile);
                
                if (canUseDiscard) {
                    this.game.drawFromDiscard(botIdx);
                    drewFromDiscard = true;
                    log.push(`${bot.name} yerdeki ${potentialTile.color}-${potentialTile.number} taşını çekti.`);
                }
            }

            if (!drewFromDiscard) {
                const drawnTile = this.game.drawTile(botIdx);
                if (drawnTile) {
                    log.push(`${bot.name} desteden bir taş çekti.`);
                } else {
                    return log;
                }
            }
        }

        const hasOpened = bot.openedMelds.length > 0 || bot.openedInPairs;
        const possibleMeldsInfo = this.findAllPossibleMelds(bot.hand);
        
        if (!hasOpened) {
            const required = this.game.getRequiredOpenThreshold(botIdx);
            if (possibleMeldsInfo.totalSum >= required) {
                const openResult = this.game.openMelds(botIdx, possibleMeldsInfo.melds);
                if (openResult.success) {
                    log.push(`${bot.name} elini açtı! Toplam puan: ${openResult.sum}`);
                }
            }
        } else {
            if (possibleMeldsInfo.melds.length > 0) {
                const openResult = this.game.openMelds(botIdx, possibleMeldsInfo.melds);
                if (openResult.success) {
                    log.push(`${bot.name} yere yeni perler açtı.`);
                }
            }
        }

        if (bot.openedMelds.length > 0 || bot.openedInPairs) {
            let tileAdded = true;
            while (tileAdded) {
                tileAdded = false;

                // 1. Try Okey kurtarma (retrieval) first!
                for (let i = 0; i < bot.hand.length; i++) {
                    const tile = bot.hand[i];
                    for (let pIdx = 0; pIdx < 4; pIdx++) {
                        const targetPlayer = this.game.players[pIdx];
                        for (let mIdx = 0; mIdx < targetPlayer.openedMelds.length; mIdx++) {
                            const retrieveResult = this.game.tryRetrieveOkey(botIdx, tile.id, pIdx, mIdx);
                            if (retrieveResult.success) {
                                log.push(`🔥 ${bot.name}, yerdeki Okey'i alıp yerine ${tile.color} ${tile.number} koydu!`);
                                tileAdded = true;
                                break;
                            }
                        }
                        if (tileAdded) break;
                    }
                    if (tileAdded) break;
                }

                // 2. Try normal processing if no Okey was retrieved
                if (!tileAdded) {
                    for (let i = 0; i < bot.hand.length; i++) {
                        const tile = bot.hand[i];
                        for (let pIdx = 0; pIdx < 4; pIdx++) {
                            const targetPlayer = this.game.players[pIdx];
                            for (let mIdx = 0; mIdx < targetPlayer.openedMelds.length; mIdx++) {
                                let addResult = this.game.addTileToTable(botIdx, tile.id, pIdx, mIdx, true);
                                if (addResult.success) {
                                    log.push(`${bot.name}, ${targetPlayer.name} adlı oyuncunun serine taş işledi.`);
                                    tileAdded = true;
                                    break;
                                }
                                addResult = this.game.addTileToTable(botIdx, tile.id, pIdx, mIdx, false);
                                if (addResult.success) {
                                    log.push(`${bot.name}, ${targetPlayer.name} adlı oyuncunun serine taş işledi.`);
                                    tileAdded = true;
                                    break;
                                }
                            }
                            if (tileAdded) break;
                        }
                        if (tileAdded) break;
                    }
                }
            }
        }

        const discardTileId = this.chooseDiscardTile(botIdx);
        const discardTile = bot.hand.find(t => t.id === discardTileId);
        
        if (discardTile) {
            const success = this.game.discardTile(botIdx, discardTileId);
            if (success) {
                log.push(`${bot.name} yere ${discardTile.color}-${discardTile.number} taşını attı.`);
            } else {
                this.game.returnDiscardTile(botIdx);
                this.game.drawTile(botIdx);
                const secondDiscardId = this.chooseDiscardTile(botIdx);
                const secondDiscard = bot.hand.find(t => t.id === secondDiscardId);
                if (secondDiscard) {
                    this.game.discardTile(botIdx, secondDiscardId);
                    log.push(`${bot.name} desteden çekip yere ${secondDiscard.color}-${secondDiscard.number} taşını attı.`);
                }
            }
        }

        // Failsafe: Ensure the bot always completes its turn by making a discard
        if (this.game.turn === botIdx) {
            const fallbackId = bot.hand.find(t => !t.isOkey)?.id || bot.hand[0]?.id;
            if (fallbackId) {
                this.game.drawnThisTurn = true; // force true to bypass check
                const forceSuccess = this.game.discardTile(botIdx, fallbackId);
                if (!forceSuccess) {
                    // Absolute fallback: manual array modification and turn transition
                    const tileIdx = bot.hand.findIndex(t => t.id === fallbackId);
                    if (tileIdx !== -1) {
                        const tile = bot.hand.splice(tileIdx, 1)[0];
                        bot.discards.push(tile);
                    }
                    this.game.turn = (this.game.turn + 1) % 4;
                    this.game.drawnThisTurn = false;
                    this.game.discardTakenThisTurn = false;
                    this.game.lastDiscardedTile = null;
                }
                const discarded = bot.discards[bot.discards.length - 1];
                log.push(`${bot.name} (Güvenli Çıkış) yere ${discarded.color}-${discarded.number} attı.`);
            }
        }

        return log;
    }

    evaluateDiscardUse(botIdx, tile) {
        const bot = this.game.players[botIdx];
        const tempHand = [...bot.hand, tile];

        if (bot.openedMelds.length === 0 && !bot.openedInPairs) {
            const meldsInfo = this.findAllPossibleMelds(tempHand);
            const usesDiscard = meldsInfo.melds.some(meld => meld.some(t => t.id === tile.id));
            const required = this.game.getRequiredOpenThreshold(botIdx);
            return (meldsInfo.totalSum >= required) && usesDiscard;
        }

        const meldsInfo = this.findAllPossibleMelds(tempHand);
        const usesDiscardInNewMeld = meldsInfo.melds.some(meld => meld.some(t => t.id === tile.id));
        if (usesDiscardInNewMeld) return true;

        for (let pIdx = 0; pIdx < 4; pIdx++) {
            const targetPlayer = this.game.players[pIdx];
            for (let mIdx = 0; mIdx < targetPlayer.openedMelds.length; mIdx++) {
                const targetMeld = targetPlayer.openedMelds[mIdx];
                
                const testPrepend = [tile, ...targetMeld];
                if (this.game.validateMeld(testPrepend).valid) return true;

                const testAppend = [...targetMeld, tile];
                if (this.game.validateMeld(testAppend).valid) return true;
            }
        }

        return false;
    }

    findAllPossibleMelds(hand) {
        const wildcards = hand.filter(t => this.game.isWildcard(t));
        const normals = hand.filter(t => !this.game.isWildcard(t));

        const allCandidateMelds = [];

        // Groups by number
        const groupsByNumber = {};
        normals.forEach(t => {
            if (!groupsByNumber[t.number]) groupsByNumber[t.number] = [];
            groupsByNumber[t.number].push(t);
        });

        for (const numStr in groupsByNumber) {
            const tiles = groupsByNumber[numStr];
            const colorsMap = {};
            tiles.forEach(t => {
                if (!colorsMap[t.color]) colorsMap[t.color] = [];
                colorsMap[t.color].push(t);
            });

            const uniqueColorsTiles = Object.values(colorsMap).map(arr => arr[0]);
            const n = uniqueColorsTiles.length;
            
            if (n >= 3) {
                // Generate size 3 combinations
                for (let i = 0; i < n; i++) {
                    for (let j = i + 1; j < n; j++) {
                        for (let k = j + 1; k < n; k++) {
                            allCandidateMelds.push([uniqueColorsTiles[i], uniqueColorsTiles[j], uniqueColorsTiles[k]]);
                        }
                    }
                }
                // Generate size 4 combination
                if (n === 4) {
                    allCandidateMelds.push(uniqueColorsTiles);
                }
            }

            // Groups with 1 wildcard
            if (n >= 2 && wildcards.length >= 1) {
                for (let i = 0; i < n; i++) {
                    for (let j = i + 1; j < n; j++) {
                        allCandidateMelds.push([uniqueColorsTiles[i], uniqueColorsTiles[j], wildcards[0]]);
                    }
                }
            }
            // Groups with 2 wildcards
            if (n >= 1 && wildcards.length >= 2) {
                for (let i = 0; i < n; i++) {
                    allCandidateMelds.push([uniqueColorsTiles[i], wildcards[0], wildcards[1]]);
                }
            }
        }

        // Runs by color
        const groupsByColor = { red: [], blue: [], black: [], yellow: [] };
        normals.forEach(t => {
            if (groupsByColor[t.color]) {
                groupsByColor[t.color].push(t);
            }
        });

        for (const color in groupsByColor) {
            const colorTiles = groupsByColor[color];
            const numMap = {};
            colorTiles.forEach(t => {
                if (!numMap[t.number]) numMap[t.number] = [];
                numMap[t.number].push(t);
            });

            // Loop over all possible start values S from 1 to 13
            for (let S = 1; S <= 13; S++) {
                for (let len = 3; len <= 5; len++) {
                    if (S + len - 1 > 13) continue;

                    // Try to build a run of size 'len' starting at S
                    let wildcardsNeeded = 0;
                    const subsetTiles = [];
                    let possible = true;

                    for (let k = 0; k < len; k++) {
                        const targetNum = S + k;
                        if (numMap[targetNum] && numMap[targetNum].length > 0) {
                            subsetTiles.push(numMap[targetNum][0]);
                        } else {
                            wildcardsNeeded++;
                            if (wildcardsNeeded <= wildcards.length) {
                                subsetTiles.push(wildcards[wildcardsNeeded - 1]);
                            } else {
                                possible = false;
                                break;
                            }
                        }
                    }

                    // A run cannot consist entirely of wildcards
                    if (possible && wildcardsNeeded < len) {
                        allCandidateMelds.push(subsetTiles);
                    }
                }
            }
        }

        allCandidateMelds.forEach(meld => {
            meld.points = this.game.calculateMeldPoints(meld);
        });

        // Deduplicate candidate melds based on tile IDs to optimize search space
        const uniqueCandidates = [];
        const seenCandidateKeys = new Set();
        
        allCandidateMelds.forEach(meld => {
            const key = meld.map(t => t.id).sort().join(',');
            if (!seenCandidateKeys.has(key)) {
                seenCandidateKeys.add(key);
                uniqueCandidates.push(meld);
            }
        });

        // DFS Backtracking to find the absolute highest scoring combination of non-overlapping melds
        let bestCombination = [];
        let maxCombinationPoints = 0;

        const findBest = (index, currentMelds, currentPoints, usedIds) => {
            if (currentPoints > maxCombinationPoints) {
                maxCombinationPoints = currentPoints;
                bestCombination = [...currentMelds];
            }

            for (let i = index; i < uniqueCandidates.length; i++) {
                const candidate = uniqueCandidates[i];
                // Check conflicts
                const hasConflict = candidate.some(tile => usedIds.has(tile.id));
                if (!hasConflict) {
                    // Choose
                    candidate.forEach(tile => usedIds.add(tile.id));
                    currentMelds.push(candidate);
                    
                    findBest(i + 1, currentMelds, currentPoints + candidate.points, usedIds);
                    
                    // Backtrack
                    currentMelds.pop();
                    candidate.forEach(tile => usedIds.delete(tile.id));
                }
            }
        };

        findBest(0, [], 0, new Set());

        return {
            melds: bestCombination,
            totalSum: maxCombinationPoints
        };
    }

    chooseDiscardTile(botIdx) {
        const bot = this.game.players[botIdx];
        const hand = bot.hand;

        if (hand.length === 0) return null;

        const okeys = hand.filter(t => this.game.isWildcard(t));
        const nonOkeys = hand.filter(t => !this.game.isWildcard(t));

        if (nonOkeys.length === 0) {
            return okeys[0].id;
        }

        const hasOpened = bot.openedMelds.length > 0 || bot.openedInPairs;

        const tileScores = nonOkeys.map(tile => {
            let utilityScore = 0;

            const sameNumCount = nonOkeys.filter(t => t.number === tile.number && t.id !== tile.id).length;
            utilityScore += sameNumCount * 15;

            const adjacentNums = nonOkeys.filter(t => t.color === tile.color && Math.abs(t.number - tile.number) === 1).length;
            utilityScore += adjacentNums * 10;

            // Strategy:
            // If NOT opened: discard smaller tiles first to keep high tiles for a 101 meld!
            // If already opened: discard larger tiles first to minimize penalty points!
            let strategyBonus = 0;
            if (!hasOpened) {
                strategyBonus = (14 - tile.number) * 0.5; // High bonus for small numbers
            } else {
                strategyBonus = tile.number * 0.5; // High bonus for large numbers
            }

            const discardScore = (14 - utilityScore) + strategyBonus;

            return {
                id: tile.id,
                tile: tile,
                score: discardScore
            };
        });

        tileScores.sort((a, b) => b.score - a.score);

        return tileScores[0].id;
    }
}

// ==========================================
// 4. USER INTERFACE CONTROLLER
// ==========================================
class OkeyUI {
    constructor() {
        this.game = new GameState();
        this.bot = new OkeyBot(this.game);
        
        this.btnStartGame = document.getElementById('btn-start-game');
        this.btnNextRound = document.getElementById('btn-next-round');
        this.btnRestartGame = document.getElementById('btn-restart-game');
        this.btnSortGroups = document.getElementById('btn-sort-groups');
        this.btnSortPairs = document.getElementById('btn-sort-pairs');
        this.btnOpenMelds = document.getElementById('btn-open-melds');
        this.btnOpenPairs = document.getElementById('btn-open-pairs');
        this.btnShowIndicator = document.getElementById('btn-show-indicator');
        this.btnClearSelection = document.getElementById('btn-clear-selection');
        
        this.modalStart = document.getElementById('modal-start');
        this.modalRoundOver = document.getElementById('modal-round-over');
        this.modalGameOver = document.getElementById('modal-game-over');
        
        this.roundIndicator = document.getElementById('round-indicator');
        this.deckCountView = document.getElementById('deck-count-view');
        this.indicatorTileView = document.getElementById('indicator-tile-view');
        this.okeyTileView = document.getElementById('okey-tile-view');
        
        this.scoreboardList = document.getElementById('scoreboard-list');
        this.logsFeed = document.getElementById('logs-feed');
        
        this.drawPile = document.getElementById('main-draw-pile');
        this.leftDiscardPile = document.getElementById('left-player-discard-pile');
        this.leftDiscardContainer = document.getElementById('left-discard-tile-container');
        this.leftDiscardPlaceholder = document.getElementById('left-discard-placeholder');
        this.discardPile = document.getElementById('main-discard-pile');
        this.activeDiscardContainer = document.getElementById('active-discard-container');
        this.discardPlaceholder = document.getElementById('discard-placeholder');
        this.selectedSumIndicator = document.getElementById('selected-sum-indicator');
        this.btnProcessTile = document.getElementById('btn-process-tile');
        
        if (typeof window.MultiplayerManager !== 'undefined') {
            this.multiplayer = new window.MultiplayerManager();
        } else if (typeof MultiplayerManager !== 'undefined') {
            this.multiplayer = new MultiplayerManager();
        } else {
            console.warn("MultiplayerManager is not defined yet, using fallback dummy.");
            this.multiplayer = {
                initHost: async (code, name) => ({ success: true, roomCode: code || 'OKEY-101' }),
                joinRoom: async (code, name) => ({ success: true, roomCode: code, seatIndex: 0 }),
                getShareableLink: () => window.location.href,
                seats: [
                    { id: 'host', name: 'Siz', isBot: false },
                    { id: null, name: 'Bot 1', isBot: true },
                    { id: null, name: 'Bot 2', isBot: true },
                    { id: null, name: 'Bot 3', isBot: true }
                ]
            };
        }

        this.rackGrid = [
            Array(24).fill(null),
            Array(24).fill(null)
        ];
        
        this.selectedTileIds = new Set();
        this.draggedTileElement = null;
        this.dragSource = null;
        this.roundCountSelection = 3;
        this.botSpeed = 1200;
    }

    getMySeatIndex() {
        if (this.multiplayer && this.multiplayer.roomCode && this.multiplayer.mySeatIndex !== undefined) {
            return this.multiplayer.mySeatIndex;
        }
        return 0;
    }

    isMyTurn() {
        return this.game.turn === this.getMySeatIndex();
    }

    getMyPlayer() {
        return this.game.players[this.getMySeatIndex()] || this.game.players[0];
    }

    getTileHTML(tile) {
        if (tile.isOkey) {
            return `<span class="tile-val" style="color:#d62828;">101</span><div class="tile-cup"><span class="tile-sym" style="color:#d62828;">★</span></div>`;
        }
        if (tile.isFakeJoker) {
            return `<span class="tile-val" style="color:#2b2b2b;">🍀</span><div class="tile-cup"><span class="tile-sym" style="color:#2b2b2b;">🍀</span></div>`;
        }
        const sym = tile.color === 'red' ? '♥' : tile.color === 'blue' ? '♦' : tile.color === 'black' ? '♣' : '♠';
        const hexColor = tile.color === 'red' ? '#d62828' : tile.color === 'blue' ? '#0077b6' : tile.color === 'black' ? '#111111' : '#e67e22';
        return `<span class="tile-val" style="color:${hexColor};">${tile.number}</span><div class="tile-cup"><span class="tile-sym" style="color:${hexColor};">${sym}</span></div>`;
    }

    startGameDirectly() {
        try {
            const activeRoomBtn = document.querySelector('#room-mode-selection .btn-toggle.active');
            const roomMode = activeRoomBtn ? activeRoomBtn.dataset.roomMode : 'local';

            const inputName = document.getElementById('input-player-name');
            const playerName = (inputName && inputName.value.trim()) ? inputName.value.trim() : "Siz";
            if (this.game && this.game.players && this.game.players[0]) {
                this.game.players[0].name = playerName;
            }

            if (roomMode === 'create') {
                this.addLog("Oda oluşturuluyor...", "system");
                this.multiplayer.initHost(null, playerName).then(res => {
                    const roomBadge = document.getElementById('room-code-badge-view');
                    const roomText = document.getElementById('room-code-text');
                    const lobbyDisplay = document.getElementById('lobby-room-code-display');

                    if (roomBadge && roomText) {
                        roomText.textContent = `Oda: #${res.roomCode}`;
                        roomBadge.style.display = 'inline-flex';
                    }
                    if (lobbyDisplay) {
                        lobbyDisplay.textContent = `Oda: #${res.roomCode}`;
                    }

                    if (this.modalStart) this.modalStart.classList.remove('active');
                    const modalLobby = document.getElementById('modal-lobby');
                    if (modalLobby) modalLobby.classList.add('active');

                    this.renderLobbySeats(this.multiplayer.seats);
                    this.multiplayer.onRoomStateChanged = (seats) => this.renderLobbySeats(seats);

                    this.addLog(`Oda oluşturuldu! Kod: ${res.roomCode}`, "system");
                }).catch(() => {
                    if (this.modalStart) this.modalStart.classList.remove('active');
                    this.game.startNewGame(3);
                    this.syncRackFromHand();
                    this.renderBoard();
                });
                return;
            } else if (roomMode === 'join') {
                const inputCode = document.getElementById('input-room-code');
                const code = inputCode ? inputCode.value.trim() : '';
                if (code) {
                    this.addLog("Odaya bağlanılıyor...", "system");
                    this.multiplayer.joinRoom(code, playerName).then(res => {
                        if (!res.success) {
                            alert(res.reason || "Odaya bağlanılamadı.");
                            return;
                        }
                        const roomBadge = document.getElementById('room-code-badge-view');
                        const roomText = document.getElementById('room-code-text');
                        const lobbyDisplay = document.getElementById('lobby-room-code-display');

                        if (roomBadge && roomText) {
                            roomText.textContent = `Oda: #${res.roomCode}`;
                            roomBadge.style.display = 'inline-flex';
                        }
                        if (lobbyDisplay) {
                            lobbyDisplay.textContent = `Oda: #${res.roomCode}`;
                        }

                        if (this.modalStart) this.modalStart.classList.remove('active');
                        const modalLobby = document.getElementById('modal-lobby');
                        if (modalLobby) modalLobby.classList.add('active');

                        this.renderLobbySeats(this.multiplayer.seats);
                        this.multiplayer.onRoomStateChanged = (seats) => this.renderLobbySeats(seats);
                    }).catch(() => {
                        if (this.modalStart) this.modalStart.classList.remove('active');
                        this.game.startNewGame(3);
                        this.syncRackFromHand();
                        this.renderBoard();
                    });
                    return;
                } else {
                    alert("Lütfen bir oda kodu girin!");
                    return;
                }
            }

            if (this.modalStart) this.modalStart.classList.remove('active');

            const activeRoundBtn = document.querySelector('#round-selection .btn-toggle.active');
            const rounds = activeRoundBtn ? parseInt(activeRoundBtn.dataset.rounds) : 3;

            this.game.startNewGame(rounds);
            this.syncRackFromHand();
            this.renderBoard();
            this.addLog("Oyun başladı! Taşlar dağıtıldı.", "system");
        } catch (e) {
            console.error("Direct start error:", e);
            const m = document.getElementById('modal-start');
            if (m) m.classList.remove('active');
            if (this.game) {
                this.game.startNewGame(3);
                this.syncRackFromHand();
                this.renderBoard();
            }
        }
    }

    init() {
        this.setupRackSlots();
        this.bindEvents();
        this.renderScoreboard();
        this.checkDailyReward();
        this.checkUrlRoomJoin();
        
        setInterval(() => {
            this.checkDailyReward();
        }, 30000);
    }

    checkUrlRoomJoin() {
        const params = new URLSearchParams(window.location.search);
        let roomCode = params.get('room');
        if (!roomCode && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            roomCode = hashParams.get('room');
        }
        if (roomCode) {
            const roomButtons = document.querySelectorAll('#room-mode-selection .btn-toggle');
            roomButtons.forEach(b => b.classList.remove('active'));
            const joinBtn = document.querySelector('#room-mode-selection [data-room-mode="join"]');
            if (joinBtn) joinBtn.classList.add('active');
            
            const joinGroup = document.getElementById('join-code-group');
            if (joinGroup) joinGroup.style.display = 'block';
            
            const inputCode = document.getElementById('input-room-code');
            if (inputCode) inputCode.value = roomCode.toUpperCase();
        }
    }

    setupRackSlots() {
        const rows = [
            document.getElementById('player-rack-row-1'),
            document.getElementById('player-rack-row-2')
        ];

        rows.forEach((rowEl, rIdx) => {
            rowEl.innerHTML = '';
            for (let cIdx = 0; cIdx < 24; cIdx++) {
                const slot = document.createElement('div');
                slot.className = 'rack-slot';
                slot.dataset.row = rIdx;
                slot.dataset.col = cIdx;
                
                slot.addEventListener('dragover', (e) => this.onDragOver(e, slot));
                slot.addEventListener('dragleave', () => this.onDragLeave(slot));
                slot.addEventListener('drop', (e) => this.onDrop(e, slot));
                
                rowEl.appendChild(slot);
            }
        });
    }

    bindEvents() {
        let roomModeSelection = 'local';
        const roomButtons = document.querySelectorAll('#room-mode-selection .btn-toggle');
        const joinCodeGroup = document.getElementById('join-code-group');
        roomButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                roomButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                roomModeSelection = btn.dataset.roomMode;
                if (joinCodeGroup) {
                    joinCodeGroup.style.display = (roomModeSelection === 'join') ? 'block' : 'none';
                }
                audio.playClack(0.4, 1.2);
            });
        });

        const btnCopyLink = document.getElementById('btn-copy-room-link');
        if (btnCopyLink) {
            btnCopyLink.addEventListener('click', () => {
                const link = this.multiplayer.getShareableLink();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(link).then(() => {
                        this.addLog("Oda davet linki panoya kopyalandı!", "system");
                        audio.playClack(0.5, 1.3);
                    }).catch(() => {
                        prompt("Oda davet linkiniz:", link);
                    });
                } else {
                    prompt("Oda davet linkiniz:", link);
                }
            });
        }

        const roundButtons = document.querySelectorAll('#round-selection .btn-toggle');
        roundButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                roundButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.roundCountSelection = parseInt(btn.dataset.rounds);
                audio.playClack(0.4, 1.2);
            });
        });

        let isPartnerSelection = false;
        const typeButtons = document.querySelectorAll('#game-type-selection .btn-toggle');
        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                typeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                isPartnerSelection = btn.dataset.type === 'partner';
                audio.playClack(0.4, 1.2);
            });
        });

        let isProgressiveSelection = false;
        const modeButtons = document.querySelectorAll('#game-mode-selection .btn-toggle');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                isProgressiveSelection = btn.dataset.mode === 'progressive';
                audio.playClack(0.4, 1.2);
            });
        });

        let betAmountSelection = 100;
        const betButtons = document.querySelectorAll('#chip-bet-selection .btn-toggle');
        betButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                betButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                betAmountSelection = parseInt(btn.dataset.bet);
                audio.playClack(0.4, 1.2);
            });
        });

        if (this.btnStartGame) {
            this.btnStartGame.addEventListener('click', async () => {
                try {
                    try { audio.init(); } catch (e) {}

                    const activeRoomBtn = document.querySelector('#room-mode-selection .btn-toggle.active');
                    const currentRoomMode = activeRoomBtn ? activeRoomBtn.dataset.roomMode : 'local';

                    const activeTypeBtn = document.querySelector('#game-type-selection .btn-toggle.active');
                    const currentIsPartner = activeTypeBtn ? activeTypeBtn.dataset.type === 'partner' : false;

                    const activeModeBtn = document.querySelector('#game-mode-selection .btn-toggle.active');
                    const currentIsProgressive = activeModeBtn ? activeModeBtn.dataset.mode === 'progressive' : false;

                    const activeBetBtn = document.querySelector('#chip-bet-selection .btn-toggle.active');
                    const currentBet = activeBetBtn ? parseInt(activeBetBtn.dataset.bet) : 100;

                    const activeRoundBtn = document.querySelector('#round-selection .btn-toggle.active');
                    const currentRounds = activeRoundBtn ? parseInt(activeRoundBtn.dataset.rounds) : 3;

                    const inputName = document.getElementById('input-player-name');
                    const playerName = (inputName && inputName.value.trim()) ? inputName.value.trim() : "Siz";
                    this.game.players[0].name = playerName;

                    if (currentRoomMode === 'create') {
                        this.addLog("Oda oluşturuluyor...", "system");
                        const res = await this.multiplayer.initHost(null, playerName);
                        const roomBadge = document.getElementById('room-code-badge-view');
                        const roomText = document.getElementById('room-code-text');
                        const lobbyDisplay = document.getElementById('lobby-room-code-display');

                        if (roomBadge && roomText) {
                            roomText.textContent = `Oda: #${res.roomCode}`;
                            roomBadge.style.display = 'inline-flex';
                        }
                        if (lobbyDisplay) {
                            lobbyDisplay.textContent = `Oda: #${res.roomCode}`;
                        }

                        if (this.modalStart) this.modalStart.classList.remove('active');
                        const modalLobby = document.getElementById('modal-lobby');
                        if (modalLobby) modalLobby.classList.add('active');

                        this.renderLobbySeats(this.multiplayer.seats);
                        this.multiplayer.onRoomStateChanged = (seats) => this.renderLobbySeats(seats);

                        this.addLog(`Oda oluşturuldu! Kod: ${res.roomCode}`, "system");
                        return;
                    } else if (currentRoomMode === 'join') {
                        const inputCode = document.getElementById('input-room-code');
                        const code = inputCode ? inputCode.value.trim() : '';
                        if (!code) {
                            alert("Lütfen katılmak istediğiniz oda kodunu girin!");
                            return;
                        }
                        this.addLog("Odaya bağlanılıyor...", "system");
                        const res = await this.multiplayer.joinRoom(code, playerName);
                        if (!res.success) {
                            alert(res.reason);
                            return;
                        }
                        const roomBadge = document.getElementById('room-code-badge-view');
                        const roomText = document.getElementById('room-code-text');
                        const lobbyDisplay = document.getElementById('lobby-room-code-display');

                        if (roomBadge && roomText) {
                            roomText.textContent = `Oda: #${res.roomCode}`;
                            roomBadge.style.display = 'inline-flex';
                        }
                        if (lobbyDisplay) {
                            lobbyDisplay.textContent = `Oda: #${res.roomCode}`;
                        }

                        if (this.modalStart) this.modalStart.classList.remove('active');
                        const modalLobby = document.getElementById('modal-lobby');
                        if (modalLobby) modalLobby.classList.add('active');

                        this.renderLobbySeats(this.multiplayer.seats);
                        this.multiplayer.onRoomStateChanged = (seats) => this.renderLobbySeats(seats);

                        this.addLog(`Odaya başarıyla bağlandınız! Koltuk: ${res.seatIndex + 1}`, "system");
                        return;
                    }

                    if (this.modalStart) this.modalStart.classList.remove('active');
                    this.game.entryBet = currentBet;
                    this.game.partnerMode = currentIsPartner;
                    this.game.progressiveMode = currentIsProgressive;
                    this.game.startNewGame(currentRounds);
                    this.syncRackFromHand();
                    this.renderBoard();
                    this.addLog("Oyun başladı! Taşlar dağıtıldı.", "system");
                    try { audio.playShuffle(); } catch (e) {}
                    
                    if (this.game.turn !== 0) {
                        this.triggerBotTurns();
                    }
                } catch (err) {
                    console.error("Game start fallback triggered:", err);
                    if (this.modalStart) this.modalStart.classList.remove('active');
                    this.game.startNewGame(this.roundCountSelection || 3);
                    this.syncRackFromHand();
                    this.renderBoard();
                }
            });
        }

        const btnLobbyCopy = document.getElementById('btn-lobby-copy-link');
        if (btnLobbyCopy) {
            btnLobbyCopy.addEventListener('click', () => {
                const link = this.multiplayer.getShareableLink();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(link).then(() => {
                        this.addLog("Oda davet linki panoya kopyalandı!", "system");
                        audio.playClack(0.5, 1.3);
                    }).catch(() => {
                        prompt("Oda davet linkiniz:", link);
                    });
                } else {
                    prompt("Oda davet linkiniz:", link);
                }
            });
        }

        const btnLeaveLobby = document.getElementById('btn-leave-lobby');
        if (btnLeaveLobby) {
            btnLeaveLobby.addEventListener('click', () => {
                const modalLobby = document.getElementById('modal-lobby');
                if (modalLobby) modalLobby.classList.remove('active');
                this.modalStart.classList.add('active');
            });
        }

        this.multiplayer.onStartGameReceived = (data) => {
            const modalLobby = document.getElementById('modal-lobby');
            if (modalLobby) modalLobby.classList.remove('active');
            if (this.modalStart) this.modalStart.classList.remove('active');

            if (data.roomSettings) {
                this.game.entryBet = data.roomSettings.entryBet;
                this.game.partnerMode = data.roomSettings.partnerMode;
                this.game.progressiveMode = data.roomSettings.progressiveMode;
                this.game.maxRounds = data.roomSettings.maxRounds;
            }

            if (data.gameData) {
                this.game.deck = data.gameData.deck;
                this.game.players = data.gameData.players;
                this.game.indicatorTile = data.gameData.indicatorTile;
                this.game.okeyTile = data.gameData.okeyTile;
                this.game.turn = data.gameData.turn;
                this.game.dealer = data.gameData.dealer;
                this.game.round = data.gameData.round;
                this.game.status = 'playing';
            }

            this.syncRackFromHand();
            this.renderBoard();
            this.addLog("Oyun kurucu oyunu başlattı! İyi oyunlar.", "system");
            try { audio.playShuffle(); } catch (e) {}
        };

        const btnStartMultiplayerGame = document.getElementById('btn-start-multiplayer-game');
        if (btnStartMultiplayerGame) {
            btnStartMultiplayerGame.addEventListener('click', () => {
                const modalLobby = document.getElementById('modal-lobby');
                if (modalLobby) modalLobby.classList.remove('active');
                if (this.modalStart) this.modalStart.classList.remove('active');

                // Map seats to player names
                this.multiplayer.seats.forEach((seat, idx) => {
                    this.game.players[idx].name = seat.name;
                    this.game.players[idx].isBot = seat.isBot;
                });

                const activeTypeBtn = document.querySelector('#game-type-selection .btn-toggle.active');
                const isPartner = activeTypeBtn ? activeTypeBtn.dataset.type === 'partner' : false;

                const activeModeBtn = document.querySelector('#game-mode-selection .btn-toggle.active');
                const isProgressive = activeModeBtn ? activeModeBtn.dataset.mode === 'progressive' : false;

                const activeBetBtn = document.querySelector('#chip-bet-selection .btn-toggle.active');
                const currentBet = activeBetBtn ? parseInt(activeBetBtn.dataset.bet) : 100;

                const activeRoundBtn = document.querySelector('#round-selection .btn-toggle.active');
                const currentRounds = activeRoundBtn ? parseInt(activeRoundBtn.dataset.rounds) : 3;

                this.game.entryBet = currentBet;
                this.game.partnerMode = isPartner;
                this.game.progressiveMode = isProgressive;
                this.game.startNewGame(currentRounds);
                this.syncRackFromHand();
                this.renderBoard();
                this.addLog("Masadaki oyuncular yerleşti! Oyun başladı.", "system");
                try { audio.playShuffle(); } catch (e) {}

                // Broadcast start game to all connected clients!
                this.multiplayer.broadcast({
                    type: 'START_GAME',
                    roomSettings: {
                        entryBet: this.game.entryBet,
                        partnerMode: this.game.partnerMode,
                        progressiveMode: this.game.progressiveMode,
                        maxRounds: this.game.maxRounds
                    },
                    gameData: {
                        deck: this.game.deck,
                        players: this.game.players,
                        indicatorTile: this.game.indicatorTile,
                        okeyTile: this.game.okeyTile,
                        turn: this.game.turn,
                        dealer: this.game.dealer,
                        round: this.game.round
                    }
                });

                if (this.game.turn !== 0 && this.game.players[this.game.turn].isBot) {
                    this.triggerBotTurns();
                }
            });
        }

        this.btnNextRound.addEventListener('click', () => {
            this.modalRoundOver.classList.remove('active');
            this.game.nextRound();
            if (this.game.status === 'game_end') {
                this.showGameOver();
            } else {
                this.selectedTileIds.clear();
                this.syncRackFromHand();
                this.renderBoard();
                this.addLog(`El ${this.game.round} başladı!`, "system");
                audio.playShuffle();
                if (this.game.turn !== 0) {
                    this.triggerBotTurns();
                }
            }
        });

        this.btnRestartGame.addEventListener('click', () => {
            this.modalGameOver.classList.remove('active');
            this.modalStart.classList.add('active');
        });

        this.drawPile.addEventListener('click', () => {
            if (this.game.turn !== 0 || this.game.drawnThisTurn) return;
            if (this.game.deck.length === 0) {
                this.game.endRoundNull();
                this.renderBoard();
                this.showRoundOver();
                this.addLog("Deste bitti! El berabere tamamlandı.", "system");
                return;
            }
            const tile = this.game.drawTile(0);
            if (tile) {
                audio.playClack(0.5, 1.1);
                this.addTileToFirstEmptySlot(tile);
                this.renderBoard();
                this.addLog("Desteden bir taş çektiniz.");
            }
        });

        if (this.leftDiscardPile) {
            this.leftDiscardPile.addEventListener('click', () => {
                if (this.game.turn !== 0 || this.game.drawnThisTurn) return;
                
                const prevPlayerIdx = 3;
                const prevDiscards = this.game.players[prevPlayerIdx].discards;
                if (prevDiscards.length === 0) return;
                const potentialTile = prevDiscards[prevDiscards.length - 1];

                const canUse = this.bot.evaluateDiscardUse(0, potentialTile);
                if (!canUse) {
                    audio.playError();
                    this.addLog("Yerdeki taşı sadece elinizi açmak veya taş işlemek için çekebilirsiniz!", "system");
                    return;
                }

                const tile = this.game.drawFromDiscard(0);
                if (tile) {
                    audio.playClack(0.5, 1.1);
                    this.addTileToFirstEmptySlot(tile);
                    this.renderBoard();
                    this.addLog(`Sol oyuncudan ${tile.color}-${tile.number} taşını çektiniz.`);
                }
            });
        }

        // Discard pile: Throw tile to end turn (Benim Attıklarım)
        this.discardPile.addEventListener('click', () => {
            if (this.game.turn !== 0) return;
            if (!this.game.drawnThisTurn) {
                this.addLog("Önce desteden veya sol oyuncudan (Bana Atılan) taş çekmelisiniz!", "system");
                audio.playError();
                return;
            }

            if (this.selectedTileIds.size === 1) {
                const tileId = Array.from(this.selectedTileIds)[0];
                const success = this.game.discardTile(0, tileId);
                if (success) {
                    this.removeTileFromRackGrid(tileId);
                    this.selectedTileIds.clear();
                    audio.playClack(0.6, 0.9);
                    this.renderBoard();
                    this.addLog("Taş attınız. Sıra diğer oyuncuda.");
                    this.triggerBotTurns();
                } else {
                    audio.playError();
                    this.addLog("Seçtiğiniz taş atılamadı!", "system");
                }
            } else if (this.selectedTileIds.size === 0) {
                this.addLog("Lütfen atmak istediğiniz taşı seçip 'Benim Attığım' alanına tıklayın.", "system");
            } else {
                this.addLog("Lütfen atmak için sadece 1 taş seçin!", "system");
            }
        });

        this.btnSortGroups.addEventListener('click', () => {
            this.sortRackGroups();
            audio.playShuffle();
        });

        this.btnSortPairs.addEventListener('click', () => {
            this.sortRackPairs();
            audio.playShuffle();
        });

        this.btnClearSelection.addEventListener('click', () => {
            this.selectedTileIds.clear();
            this.renderRack();
            this.updateSelectionIndicators();
            audio.playClack(0.3, 0.9);
        });

        if (this.btnProcessTile) {
            this.btnProcessTile.addEventListener('click', () => {
                this.handleProcessTileClick();
            });
        }

        this.btnOpenMelds.addEventListener('click', () => {
            if (!this.isMyTurn()) {
                this.addLog("Sıra sizde değil!", "system");
                audio.playError();
                return;
            }
            if (!this.game.drawnThisTurn) {
                this.addLog("Önce yerden veya desteden taş çekmelisiniz!", "system");
                audio.playError();
                return;
            }

            const myPlayer = this.getMyPlayer();
            const selectedTiles = [];
            this.selectedTileIds.forEach(id => {
                const tile = myPlayer.hand.find(t => t.id === id);
                if (tile) selectedTiles.push(tile);
            });

            if (selectedTiles.length === 0) {
                this.addLog("Lütfen açmak istediğiniz perleri ıstakanızdan seçin veya 'Perleri Diz' butonuna basın.", "system");
                audio.playError();
                return;
            }

            const meldsInfo = this.bot.findAllPossibleMelds(selectedTiles);
            
            const meldTileIds = new Set(meldsInfo.melds.flat().map(t => t.id));
            const meldLeftovers = selectedTiles.filter(t => !meldTileIds.has(t.id));
            if (meldLeftovers.length > 0) {
                this.addLog("Seçtiğiniz taşlar arasında per oluşturmayan fazla taş(lar) var. Lütfen sadece perleri seçin.", "system");
                audio.playError();
                return;
            }

            const mySeat = this.getMySeatIndex();
            const result = this.game.openMelds(mySeat, meldsInfo.melds);
            
            if (result.success) {
                audio.playWin();
                this.selectedTileIds.clear();
                this.clearRackOfTiles(meldsInfo.melds.flat());
                this.renderBoard();
                this.addLog(`Elinizi açtınız! Toplam per puanı: ${result.sum}`, "player-action");
            } else {
                audio.playError();
                this.addLog(`El açma engellendi: ${result.reason}`, "system");
            }
        });

        this.btnOpenPairs.addEventListener('click', () => {
            if (!this.isMyTurn()) {
                this.addLog("Sıra sizde değil!", "system");
                audio.playError();
                return;
            }
            if (!this.game.drawnThisTurn) {
                this.addLog("Önce yerden veya desteden taş çekmelisiniz!", "system");
                audio.playError();
                return;
            }

            const myPlayer = this.getMyPlayer();
            const selectedTiles = [];
            this.selectedTileIds.forEach(id => {
                const tile = myPlayer.hand.find(t => t.id === id);
                if (tile) selectedTiles.push(tile);
            });

            if (selectedTiles.length === 0) {
                this.addLog("Lütfen açmak istediğiniz çiftleri ıstakanızdan seçin veya 'Çiftleri Diz' butonuna basın.", "system");
                audio.playError();
                return;
            }

            const pairs = this.findOptimalPairs(selectedTiles);

            const result = this.game.openPairs(0, pairs);

            if (result.success) {
                audio.playWin();
                this.selectedTileIds.clear();
                this.clearRackOfTiles(pairs.flat());
                this.renderBoard();
                this.addLog(`Çift açtınız! (${pairs.length} Çift)`, "player-action");
            } else {
                audio.playError();
                this.addLog(`Çift açma engellendi: ${result.reason}`, "system");
            }
        });

        this.btnShowIndicator.addEventListener('click', () => {
            const result = this.game.showIndicator(0);
            if (result.success) {
                audio.playWin();
                this.addLog(`✨ Göstergeyi gösterdiniz (${result.tile.color}-${result.tile.number})! -101 puan kazandınız.`, "player-action");
                this.btnShowIndicator.style.display = 'none';
                this.renderBoard();
            } else {
                audio.playError();
                alert(result.reason);
            }
        });

        this.discardPile.addEventListener('dragover', (e) => {
            if (this.isMyTurn() && this.game.drawnThisTurn) {
                e.preventDefault();
                this.discardPile.classList.add('highlight');
            }
        });

        this.discardPile.addEventListener('dragleave', () => {
            this.discardPile.classList.remove('highlight');
        });

        this.discardPile.addEventListener('drop', (e) => {
            this.discardPile.classList.remove('highlight');
            if (!this.isMyTurn() || !this.game.drawnThisTurn) return;

            const mySeat = this.getMySeatIndex();
            const myPlayer = this.getMyPlayer();
            const tileId = e.dataTransfer.getData('text/plain');
            const tile = myPlayer.hand.find(t => t.id === tileId);
            
            if (tile) {
                const success = this.game.discardTile(mySeat, tileId);
                if (success) {
                    this.removeTileFromRackGrid(tileId);
                    this.checkIslekPenalty();
                    this.renderBoard();
                    audio.playDiscard();
                    this.addLog(`Yere ${tile.color}-${tile.number} attınız.`);
                    
                    if (this.game.status === 'round_end') {
                        this.showRoundOver();
                    } else {
                        this.triggerBotTurns();
                    }
                } else {
                    audio.playError();
                    this.addLog("Yerden çektiğiniz ıskarta taşı kullanmadan elinizi bitiremezsiniz! Önce açmalı veya işlemelisiniz.", "system");
                }
            }
        });

        const botSpeedSelect = document.getElementById('select-bot-speed');
        if (botSpeedSelect) {
            botSpeedSelect.addEventListener('change', (e) => {
                this.botSpeed = parseInt(e.target.value);
                audio.playClack(0.4, 1.2);
            });
        }
    }

    findOptimalPairs(tiles) {
        const pairs = [];
        const usedIds = new Set();
        
        // Filter out indicator tile if present (indicator cannot be used in pairs)
        const validTiles = tiles.filter(t => {
            if (!this.game.indicatorTile) return true;
            const isInd = !t.isFakeJoker && !t.isOkey && t.color === this.game.indicatorTile.color && t.number === this.game.indicatorTile.number;
            return !isInd;
        });

        // PASS 1: Pair exact matching natural twin tiles first (Same color, same number, neither is Okey)
        for (let i = 0; i < validTiles.length; i++) {
            const t1 = validTiles[i];
            if (usedIds.has(t1.id) || this.game.isWildcard(t1)) continue;

            for (let j = i + 1; j < validTiles.length; j++) {
                const t2 = validTiles[j];
                if (usedIds.has(t2.id) || this.game.isWildcard(t2)) continue;

                if (t1.color === t2.color && t1.number === t2.number) {
                    pairs.push([t1, t2]);
                    usedIds.add(t1.id);
                    usedIds.add(t2.id);
                    break;
                }
            }
        }

        // PASS 2: Pair remaining single natural tiles with Okey (Wildcard) tiles
        const remainingSingles = validTiles.filter(t => !usedIds.has(t.id) && !this.game.isWildcard(t));
        const remainingOkeys = validTiles.filter(t => !usedIds.has(t.id) && this.game.isWildcard(t));

        let okeyIdx = 0;
        for (const single of remainingSingles) {
            if (okeyIdx < remainingOkeys.length) {
                const okey = remainingOkeys[okeyIdx++];
                pairs.push([single, okey]);
                usedIds.add(single.id);
                usedIds.add(okey.id);
            }
        }

        // PASS 3: Pair any remaining Okeys with each other
        const leftoverOkeys = remainingOkeys.filter(t => !usedIds.has(t.id));
        for (let k = 0; k < leftoverOkeys.length - 1; k += 2) {
            pairs.push([leftoverOkeys[k], leftoverOkeys[k + 1]]);
            usedIds.add(leftoverOkeys[k].id);
            usedIds.add(leftoverOkeys[k + 1].id);
        }

        return pairs;
    }

    findAllProcessableTilesInHand() {
        const player0 = this.game.players[0];
        const hasOpened = player0.openedMelds.length > 0 || player0.openedInPairs;
        if (!hasOpened || this.game.turn !== 0 || !this.game.drawnThisTurn) {
            return [];
        }

        const processableList = [];

        // Check each tile in hand
        for (const tile of player0.hand) {
            let fits = false;
            for (let pIdx = 0; pIdx < 4; pIdx++) {
                const targetPlayer = this.game.players[pIdx];
                if (targetPlayer.openedInPairs) continue;

                for (let mIdx = 0; mIdx < targetPlayer.openedMelds.length; mIdx++) {
                    const targetMeld = targetPlayer.openedMelds[mIdx];
                    const fit = this.canTileFitInMeld(tile, targetMeld);
                    if (fit) {
                        processableList.push({
                            tile,
                            targetPlayerIdx: pIdx,
                            meldIdx: mIdx,
                            appendToStart: (fit.position === 'start')
                        });
                        fits = true;
                        break;
                    }
                }
                if (fits) break;
            }
        }

        return processableList;
    }

    canTileFitInMeld(tile, meld) {
        if (!meld || meld.length === 0) return null;

        // Try prepending to start
        const testStart = [tile, ...meld];
        const valStart = this.game.validateMeld(testStart);
        if (valStart.valid) return { position: 'start' };

        // Try appending to end
        const testEnd = [...meld, tile];
        const valEnd = this.game.validateMeld(testEnd);
        if (valEnd.valid) return { position: 'end' };

        return null;
    }

    handleProcessTileClick() {
        if (this.game.turn !== 0) {
            this.addLog("Sıra sizde değil!", "system");
            audio.playError();
            return;
        }
        if (!this.game.drawnThisTurn) {
            this.addLog("Önce yerden veya desteden taş çekmelisiniz!", "system");
            audio.playError();
            return;
        }

        const player0 = this.game.players[0];
        const hasOpened = player0.openedMelds.length > 0 || player0.openedInPairs;
        if (!hasOpened) {
            this.addLog("Taş işleyebilmek için önce kendi elinizi açmış olmalısınız!", "system");
            audio.playError();
            return;
        }

        // If user explicitly selected 1 tile, process that selected tile
        if (this.selectedTileIds.size === 1) {
            const tileId = Array.from(this.selectedTileIds)[0];
            const tile = player0.hand.find(t => t.id === tileId);
            if (!tile) return;

            let processed = false;
            for (let pIdx = 0; pIdx < 4; pIdx++) {
                const targetPlayer = this.game.players[pIdx];
                if (targetPlayer.openedInPairs) continue;

                for (let mIdx = 0; mIdx < targetPlayer.openedMelds.length; mIdx++) {
                    const targetMeld = targetPlayer.openedMelds[mIdx];
                    const fit = this.canTileFitInMeld(tile, targetMeld);

                    if (fit) {
                        const appendToStart = (fit.position === 'start');
                        const addResult = this.game.addTileToTable(0, tile.id, pIdx, mIdx, appendToStart);
                        
                        if (addResult.success) {
                            audio.playClack(0.5, 1.0);
                            this.selectedTileIds.clear();
                            this.removeTileFromRackGrid(tile.id);
                            this.renderBoard();
                            this.updateSelectionIndicators();
                            this.addLog(`Siz, ${targetPlayer.name} adlı oyuncunun serine ${tile.color}-${tile.number} taşını işlediniz.`, "player-action");
                            processed = true;
                            break;
                        }
                    }
                }
                if (processed) break;
            }

            if (!processed) {
                audio.playError();
                this.addLog("Seçtiğiniz taş masadaki hiçbir pere işlenemiyor!", "system");
            }
            return;
        }

        // Automatic 1-Click Auto-Processing for all processable tiles in hand!
        let processedCount = 0;
        let continueLoop = true;

        while (continueLoop) {
            continueLoop = false;
            const processableList = this.findAllProcessableTilesInHand();

            if (processableList.length > 0) {
                const item = processableList[0];
                const addResult = this.game.addTileToTable(0, item.tile.id, item.targetPlayerIdx, item.meldIdx, item.appendToStart);
                
                if (addResult.success) {
                    processedCount++;
                    const targetPlayerName = this.game.players[item.targetPlayerIdx].name;
                    this.removeTileFromRackGrid(item.tile.id);
                    this.addLog(`Siz, ${targetPlayerName} adlı oyuncunun serine ${item.tile.color}-${item.tile.number} taşını işlediniz.`, "player-action");
                    continueLoop = true;
                }
            }
        }

        if (processedCount > 0) {
            audio.playClack(0.5, 1.0);
            this.selectedTileIds.clear();
            this.renderBoard();
            this.updateSelectionIndicators();
            this.addLog(`Toplam ${processedCount} adet taş başarıyla masadaki perlere otomatik işlendi!`, "player-action");
        } else {
            audio.playError();
            this.addLog("Elinizde masadaki perlere işlenebilecek taş bulunamadı!", "system");
        }
    }

    triggerBotTurns() {
        if (this.game.status !== 'playing') return;

        const currentP = this.game.players[this.game.turn];
        if (!currentP || !currentP.isBot || currentP.isHuman) {
            this.renderBoard();
            return;
        }

        if (this.game.deck.length === 0 && !this.game.drawnThisTurn) {
            this.game.endRoundNull();
            this.renderBoard();
            this.showRoundOver();
            this.addLog("Deste bitti! El berabere tamamlandı.", "system");
            return;
        }

        const nextBotPlay = () => {
            const nowP = this.game.players[this.game.turn];
            if (this.isMyTurn() || !nowP || !nowP.isBot || nowP.isHuman || this.game.status !== 'playing') {
                if (this.game.status === 'round_end') {
                    this.showRoundOver();
                } else {
                    this.renderBoard();
                }
                return;
            }

            const currentBotIdx = this.game.turn;
            this.renderBoard();

            setTimeout(() => {
                let logs = [];
                try {
                    logs = this.bot.playTurn(currentBotIdx);
                } catch (e) {
                    console.error("Bot play exception:", e);
                    const bot = this.game.players[currentBotIdx];
                    if (bot.hand.length > 0) {
                        const tile = bot.hand[0];
                        bot.hand.splice(0, 1);
                        bot.discards.push(tile);
                    }
                    this.game.turn = (this.game.turn + 1) % 4;
                    this.game.drawnThisTurn = false;
                    this.game.discardTakenThisTurn = false;
                    logs = [`⚠️ [Failsafe] ${bot.name} hata aldı ve turu tamamlandı.`];
                }
                logs.forEach(msg => {
                    if (msg.includes("açtı")) {
                        audio.playWin();
                    } else if (msg.includes("attı")) {
                        audio.playDiscard();
                    } else {
                        audio.playClack(0.4, 0.9);
                    }
                    this.addLog(msg);
                });

                this.renderBoard();
                this.checkIslekPenalty();

                if (this.game.status === 'round_end') {
                    this.showRoundOver();
                } else {
                    nextBotPlay();
                }
            }, this.botSpeed);
        };

        nextBotPlay();
    }

    renderBoard() {
        this.roundIndicator.textContent = `El: ${this.game.round} / ${this.game.maxRounds}`;
        this.deckCountView.textContent = `Deste: ${this.game.deck.length}`;

        const headerUserChips = document.getElementById('header-user-chips');
        if (headerUserChips) {
            headerUserChips.textContent = `${this.game.players[0].chips} Çip`;
        }

        const potIndicator = document.getElementById('pot-indicator');
        if (potIndicator) {
            potIndicator.textContent = `Çanak: ${this.game.roundPot} Çip`;
        }

        const teamABadge = document.getElementById('team-a-score-badge');
        const teamBBadge = document.getElementById('team-b-score-badge');
        if (teamABadge && teamBBadge) {
            const displayStyle = this.game.partnerMode ? 'inline-flex' : 'none';
            teamABadge.style.display = displayStyle;
            teamBBadge.style.display = displayStyle;
        }

        // Show/Hide Indicator Button
        const humanPlayer = this.game.players[0];
        if (this.game.turn === 0 && !this.game.drawnThisTurn && humanPlayer.canShowIndicator && this.game.indicatorTile) {
            const indicator = this.game.indicatorTile;
            const hasIndicator = humanPlayer.hand.some(t => !t.isFakeJoker && !t.isOkey && t.color === indicator.color && t.number === indicator.number);
            if (hasIndicator) {
                this.btnShowIndicator.style.display = 'inline-block';
            } else {
                this.btnShowIndicator.style.display = 'none';
            }
        } else {
            this.btnShowIndicator.style.display = 'none';
        }

        // Calculate and display hand total
        const handSum = this.game.players[0].hand.reduce((sum, tile) => sum + tile.number, 0);
        document.getElementById('hand-total-badge').textContent = `Eldeki Toplam: ${handSum}`;

        if (this.game.indicatorTile) {
            this.indicatorTileView.className = `mini-tile tile-${this.game.indicatorTile.color}`;
            this.indicatorTileView.querySelector('.tile-val').textContent = this.game.indicatorTile.number;
        } else {
            this.indicatorTileView.className = `mini-tile`;
            this.indicatorTileView.querySelector('.tile-val').textContent = '?';
        }

        if (this.game.okeyTile) {
            this.okeyTileView.className = `mini-tile wildcard tile-${this.game.okeyTile.color}`;
            this.okeyTileView.querySelector('.tile-val').textContent = this.game.okeyTile.number;
        } else {
            this.okeyTileView.className = `mini-tile wildcard`;
            this.okeyTileView.querySelector('.tile-val').textContent = '?';
        }

        const thresholdValEl = document.getElementById('threshold-val');
        if (thresholdValEl) {
            thresholdValEl.textContent = this.game.progressiveMode ? this.game.currentOpenThreshold : "101";
        }

        this.renderScoreboard();
        this.renderTableMelds();
        this.renderDiscardPile();
        this.renderRack();
        this.updateSelectionIndicators();
    }

    checkIslekPenalty() {
        if (this.game.lastIslekDiscarder !== null) {
            const playerIdx = this.game.lastIslekDiscarder;
            const player = this.game.players[playerIdx];
            const tile = this.game.lastIslekTile;
            
            const name = playerIdx === 0 ? "Siz" : player.name;
            const action = playerIdx === 0 ? "attınız" : "attı";
            this.addLog(`⚠️ CEZA! ${name} yere işlek olan ${tile.color}-${tile.number} taşını ${action}! +101 ceza puanı yazıldı.`, "penalty-alert");
            audio.playError();
            
            this.game.lastIslekDiscarder = null;
            this.game.lastIslekTile = null;
        }
    }

    renderScoreboard() {
        this.game.players.forEach((player, idx) => {
            const area = document.getElementById(`table-area-${idx}`);
            if (area) {
                if (idx === this.game.turn) {
                    area.classList.add('active-turn');
                } else {
                    area.classList.remove('active-turn');
                }
            }

            const meldsScroll = document.getElementById(`player-melds-${idx}`);
            if (meldsScroll && meldsScroll.parentElement) {
                if (idx === this.game.turn) {
                    meldsScroll.parentElement.classList.add('active-column');
                } else {
                    meldsScroll.parentElement.classList.remove('active-column');
                }
            }

            const scoreEl = document.getElementById(`player-score-${idx}`);
            if (scoreEl) {
                scoreEl.textContent = `${player.score} P | ${player.chips} Çip`;
                if (player.score === Math.min(...this.game.players.map(p => p.score))) {
                    scoreEl.classList.add('winning');
                } else {
                    scoreEl.classList.remove('winning');
                }
            }

            const nameEl = document.querySelector(`#table-area-${idx} .name`);
            if (nameEl) {
                let displayName = player.name || (idx === 0 ? "Siz" : (idx === 1 ? "Metin" : (idx === 2 ? "Canan" : "Oya")));
                if (this.game.partnerMode) {
                    const partnerIdx = (idx + 2) % 4;
                    const partnerName = this.game.players[partnerIdx].name || (partnerIdx === 0 ? "Siz" : (partnerIdx === 1 ? "Metin" : (partnerIdx === 2 ? "Canan" : "Oya")));
                    displayName = `${displayName} (Eş: ${partnerName})`;
                }
                nameEl.textContent = displayName + (player.hand.length > 0 ? ` (${player.hand.length} Taş)` : '');
            }
        });

        const teamAScore = this.game.players[0].score + this.game.players[2].score;
        const teamBScore = this.game.players[1].score + this.game.players[3].score;

        const teamAValEl = document.getElementById('team-a-score-val');
        if (teamAValEl) teamAValEl.textContent = `${teamAScore} Puan`;

        const teamBValEl = document.getElementById('team-b-score-val');
        if (teamBValEl) teamBValEl.textContent = `${teamBScore} Puan`;
    }

    renderTableMelds() {
        for (let p = 0; p < 4; p++) {
            const container = document.getElementById(`player-melds-${p}`);
            const statusIndicator = document.getElementById(`player-status-${p}`);
            const player = this.game.players[p];
            
            container.innerHTML = '';

            if (player.openedInPairs) {
                const pairsCount = player.openedMelds.length;
                statusIndicator.textContent = `${pairsCount} Çift`;
                statusIndicator.style.background = "rgba(244, 162, 97, 0.2)";
                statusIndicator.style.color = "var(--tile-yellow)";
            } else if (player.openedMelds.length > 0) {
                statusIndicator.textContent = `${player.initialOpeningSum || 0} Puan`;
                statusIndicator.style.background = "rgba(0, 230, 118, 0.2)";
                statusIndicator.style.color = "var(--primary)";
            } else {
                statusIndicator.textContent = "Kapalı";
                statusIndicator.style.background = "rgba(255, 255, 255, 0.05)";
                statusIndicator.style.color = "var(--text-muted)";
            }

            if (player.openedMelds.length === 0) {
                const msg = document.createElement('div');
                msg.className = 'empty-table-msg';
                msg.textContent = p === 0 ? 'Henüz açmadınız. Perlerinizi seçip "Elin Aç" deyin.' : 'Henüz açmadı';
                container.appendChild(msg);
            } else {
                player.openedMelds.forEach((meld, mIdx) => {
                    const block = document.createElement('div');
                    block.className = 'meld-block';
                    
                    block.addEventListener('dragover', (e) => {
                        if (this.game.turn === 0 && this.game.players[0].openedMelds.length > 0) {
                            e.preventDefault();
                            block.classList.add('drag-highlight');
                        }
                    });
                    
                    block.addEventListener('dragleave', () => {
                        block.classList.remove('drag-highlight');
                    });
                    
                    block.addEventListener('drop', (e) => {
                        block.classList.remove('drag-highlight');
                        if (this.game.turn !== 0) return;
                        
                        const tileId = e.dataTransfer.getData('text/plain');
                        const source = e.dataTransfer.getData('source');
                        if (source === 'rack') {
                            const tile = this.game.players[0].hand.find(t => t.id === tileId);
                            if (tile) {
                                this.selectedTileIds.clear();
                                this.selectedTileIds.add(tileId);
                                this.handleTableMeldClick(p, mIdx, tile);
                            }
                        }
                    });

                    meld.forEach(tile => {
                        const tileEl = document.createElement('div');
                        tileEl.className = `tile-3d tile-${tile.color} ${tile.isOkey ? 'wildcard' : ''} ${tile.isFakeJoker ? 'fake-joker' : ''}`;
                        tileEl.innerHTML = this.getTileHTML(tile);
                        
                        tileEl.addEventListener('click', () => {
                            this.handleTableMeldClick(p, mIdx, tile);
                        });

                        block.appendChild(tileEl);
                    });
                    container.appendChild(block);
                });
            }
        }
    }

    renderLobbySeats(seats) {
        const grid = document.getElementById('lobby-seats-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const teamLabels = ["Takım A (Eş 1)", "Takım B (Eş 1)", "Takım A (Eş 2 - Ortağınız)", "Takım B (Eş 2)"];

        seats.forEach((seat, idx) => {
            const card = document.createElement('div');
            card.className = 'seat-card';
            const isMySeat = (idx === this.multiplayer.mySeatIndex);

            card.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                border: 1.5px solid ${isMySeat ? 'var(--primary-color, #00e676)' : 'rgba(255, 255, 255, 0.1)'};
                border-radius: 12px;
                padding: 12px 14px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                position: relative;
            `;

            const teamBadge = (idx === 0 || idx === 2) 
                ? `<span style="background: rgba(33, 150, 243, 0.2); color: #90caf9; border: 1px solid rgba(33, 150, 243, 0.4); font-size: 11px; padding: 2px 6px; border-radius: 6px; font-weight: 700;">${teamLabels[idx]}</span>`
                : `<span style="background: rgba(233, 30, 99, 0.2); color: #f48fb1; border: 1px solid rgba(233, 30, 99, 0.4); font-size: 11px; padding: 2px 6px; border-radius: 6px; font-weight: 700;">${teamLabels[idx]}</span>`;

            card.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 600;">Koltuk ${idx + 1}</span>
                    ${teamBadge}
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                        ${seat.isBot ? '🤖' : '👤'}
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: ${isMySeat ? '#00e676' : '#fff'};">
                            ${seat.name} ${isMySeat ? '(Siz)' : ''}
                        </h4>
                        <span style="font-size: 11px; color: rgba(255,255,255,0.5);">${seat.isBot ? 'Bot Yapay Zeka' : 'Gerçek Oyuncu'}</span>
                    </div>
                </div>
                ${!isMySeat ? `<button class="btn btn-sm btn-secondary btn-swap-seat" data-seat="${idx}" style="margin-top: 6px; font-size: 11px; padding: 4px 8px; width: 100%;">Bu Koltuğa Geç (Eş Ol)</button>` : '<span style="font-size: 11px; color: #a5d6a7; font-weight: 700; text-align: center; margin-top: 6px;">Oturduğunuz Koltuk</span>'}
            `;

            grid.appendChild(card);
        });

        document.querySelectorAll('.btn-swap-seat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.dataset.seat);
                this.multiplayer.swapSeat(targetIdx);
                audio.playClack(0.4, 1.2);
            });
        });
    }

    handleTableMeldClick(targetPlayerIdx, meldIdx, targetTile) {
        if (this.game.turn !== 0 || this.selectedTileIds.size !== 1) return;
        
        const selectedTileId = Array.from(this.selectedTileIds)[0];
        const tile = this.game.players[0].hand.find(t => t.id === selectedTileId);
        if (!tile) return;

        // Try retrieving Okey first
        const okeyResult = this.game.tryRetrieveOkey(0, tile.id, targetPlayerIdx, meldIdx);
        if (okeyResult.success) {
            audio.playClack(0.5, 1.4);
            this.selectedTileIds.clear();
            this.removeTileFromRackGrid(tile.id);
            this.addTileToFirstEmptySlot(okeyResult.okeyTile);
            this.renderBoard();
            this.addLog(okeyResult.message, "player-action");
            return;
        }

        let result = this.game.addTileToTable(0, tile.id, targetPlayerIdx, meldIdx, true);
        if (result.success) {
            audio.playClack(0.5, 1.0);
            this.selectedTileIds.clear();
            this.removeTileFromRackGrid(tile.id);
            this.renderBoard();
            this.addLog(`Siz, ${this.game.players[targetPlayerIdx].name} adlı oyuncunun serine taş işlediniz.`, "player-action");
            return;
        }

        result = this.game.addTileToTable(0, tile.id, targetPlayerIdx, meldIdx, false);
        if (result.success) {
            audio.playClack(0.5, 1.0);
            this.selectedTileIds.clear();
            this.removeTileFromRackGrid(tile.id);
            this.renderBoard();
            this.addLog(`Siz, ${this.game.players[targetPlayerIdx].name} adlı oyuncunun serine taş işlediniz.`, "player-action");
            return;
        }

        audio.playError();
        this.addLog("Seçili taş bu pere işlenemez veya Okey çalınamaz!", "system");
    }

    renderDiscardPile() {
        // 1. Render Left Discard Pile (Bana Atılan Taş - Player 3)
        if (this.leftDiscardContainer) {
            this.leftDiscardContainer.innerHTML = '';
            const leftDiscards = this.game.players[3].discards;
            if (leftDiscards.length > 0) {
                const tile = leftDiscards[leftDiscards.length - 1];
                if (this.leftDiscardPlaceholder) this.leftDiscardPlaceholder.style.display = 'none';
                
                const tileEl = document.createElement('div');
                tileEl.className = `tile-3d tile-${tile.color} ${tile.isOkey ? 'wildcard' : ''} ${tile.isFakeJoker ? 'fake-joker' : ''}`;
                tileEl.innerHTML = this.getTileHTML(tile);
                
                if (this.game.turn === 0 && !this.game.drawnThisTurn) {
                    tileEl.setAttribute('draggable', 'true');
                    tileEl.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', tile.id);
                        e.dataTransfer.setData('source', 'discard');
                    });
                }
                this.leftDiscardContainer.appendChild(tileEl);
            } else {
                if (this.leftDiscardPlaceholder) this.leftDiscardPlaceholder.style.display = 'flex';
            }
        }

        // 2. Render Right Discard Pile (Benim Attığım - Player 0)
        if (this.activeDiscardContainer) {
            this.activeDiscardContainer.innerHTML = '';
            const myDiscards = this.game.players[0].discards;
            if (myDiscards.length > 0) {
                const tile = myDiscards[myDiscards.length - 1];
                if (this.discardPlaceholder) this.discardPlaceholder.style.display = 'none';
                
                const tileEl = document.createElement('div');
                tileEl.className = `tile-3d tile-${tile.color} ${tile.isOkey ? 'wildcard' : ''} ${tile.isFakeJoker ? 'fake-joker' : ''}`;
                tileEl.innerHTML = this.getTileHTML(tile);
                this.activeDiscardContainer.appendChild(tileEl);
            } else {
                if (this.discardPlaceholder) this.discardPlaceholder.style.display = 'flex';
            }
        }
    }

    reconcileRackWithHand() {
        if (!this.game || !this.game.players || !this.game.players[0]) return;
        const hand = this.game.players[0].hand;
        const handTileIds = new Set(hand.map(t => t.id));

        // 1. Clear grid slots whose tiles are no longer in player's hand
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                if (this.rackGrid[r][c] && !handTileIds.has(this.rackGrid[r][c].id)) {
                    this.rackGrid[r][c] = null;
                }
            }
        }

        // 2. Collect current grid tile IDs
        const gridTileIds = new Set();
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                if (this.rackGrid[r][c]) {
                    gridTileIds.add(this.rackGrid[r][c].id);
                }
            }
        }

        // 3. Find any hand tiles missing from grid and place them in first available slots
        const missingHandTiles = hand.filter(t => !gridTileIds.has(t.id));
        missingHandTiles.forEach(tile => {
            this.addTileToFirstEmptySlot(tile);
        });
    }

    renderRack() {
        this.reconcileRackWithHand();
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                const slot = document.querySelector(`.rack-slot[data-row="${r}"][data-col="${c}"]`);
                if (!slot) continue;
                slot.innerHTML = '';
                
                const tile = this.rackGrid[r][c];
                if (tile) {
                    const tileEl = document.createElement('div');
                    tileEl.className = `tile-3d tile-${tile.color} ${tile.isOkey ? 'wildcard' : ''} ${tile.isFakeJoker ? 'fake-joker' : ''} ${this.selectedTileIds.has(tile.id) ? 'selected' : ''}`;
                    tileEl.innerHTML = this.getTileHTML(tile);
                    tileEl.setAttribute('draggable', 'true');
                    tileEl.dataset.id = tile.id;
                    
                    tileEl.addEventListener('dragstart', (e) => this.onDragStart(e, r, c));
                    tileEl.addEventListener('dragend', () => this.onDragEnd());
                    
                    tileEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleTileSelection(tile.id);
                    });

                    slot.appendChild(tileEl);
                }
            }
        }
    }

    toggleTileSelection(tileId) {
        if (this.selectedTileIds.has(tileId)) {
            this.selectedTileIds.delete(tileId);
        } else {
            this.selectedTileIds.add(tileId);
        }
        audio.playClack(0.3, 1.1);
        this.renderRack();
        this.updateSelectionIndicators();
    }

    getDraftedMelds() {
        const selectedCoords = [];
        
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 20; c++) {
                const tile = this.rackGrid[r][c];
                if (tile && this.selectedTileIds.has(tile.id)) {
                    selectedCoords.push({ r, c, tile });
                }
            }
        }

        selectedCoords.sort((a, b) => a.r === b.r ? a.c - b.c : a.r - b.r);

        const melds = [];
        let currentMeld = [];

        for (let i = 0; i < selectedCoords.length; i++) {
            const coord = selectedCoords[i];
            
            if (currentMeld.length === 0) {
                currentMeld.push(coord);
            } else {
                const last = currentMeld[currentMeld.length - 1];
                if (coord.r === last.r && coord.c === last.c + 1) {
                    currentMeld.push(coord);
                } else {
                    melds.push(currentMeld.map(c => c.tile));
                    currentMeld = [coord];
                }
            }
        }

        if (currentMeld.length > 0) {
            melds.push(currentMeld.map(c => c.tile));
        }

        return melds;
    }

    updateSelectionIndicators() {
        const myPlayer = this.getMyPlayer();
        const selectedTiles = [];
        this.selectedTileIds.forEach(id => {
            const tile = myPlayer.hand.find(t => t.id === id);
            if (tile) selectedTiles.push(tile);
        });

        const selectedBadge = document.getElementById('selected-total-badge');
        const dynamicBadge = document.getElementById('dynamic-status-badge');
        const hasOpenedBefore = myPlayer.openedMelds.length > 0 || myPlayer.openedInPairs;
        const isMyTurn = this.isMyTurn();
        const canActThisTurn = isMyTurn && this.game.drawnThisTurn;

        if (selectedTiles.length > 0) {
            this.selectedSumIndicator.style.display = 'inline-block';

            // 1. Find best melds from selected tiles
            const meldsInfo = this.bot.findAllPossibleMelds(selectedTiles);
            const validGroupsCount = meldsInfo.melds.length;
            const totalSum = meldsInfo.totalSum;
            
            const meldTileIds = new Set(meldsInfo.melds.flat().map(t => t.id));
            const meldLeftovers = selectedTiles.filter(t => !meldTileIds.has(t.id));
            const hasMeldLeftovers = meldLeftovers.length > 0;

            // 2. Find pairs from selected tiles using 2-Pass Optimal Pair Matching
            const pairs = this.findOptimalPairs(selectedTiles);
            const hasPairLeftovers = selectedTiles.length !== pairs.length * 2;

            // Determine mode: Pair mode is active when ALL selected tiles form pairs without leftovers
            const isPairMode = (pairs.length > 0 && !hasPairLeftovers);

            if (isPairMode) {
                const pairsCount = pairs.length;
                this.selectedSumIndicator.textContent = `Seçili: ${pairsCount} Çift`;
                
                const openedInMelds = player0.openedMelds.length > 0 && !player0.openedInPairs;

                if (openedInMelds) {
                    dynamicBadge.textContent = "Seri açtığınız için çift açamazsınız!";
                    dynamicBadge.className = 'badge-stat invalid';
                    this.btnOpenPairs.disabled = true;
                } else if (!hasOpenedBefore) {
                    dynamicBadge.textContent = `Çift Sayısı: ${pairsCount} / 5 Çift`;
                    if (pairsCount >= 5 && !hasPairLeftovers) {
                        dynamicBadge.className = 'badge-stat valid';
                        this.btnOpenPairs.disabled = !canActThisTurn;
                    } else {
                        dynamicBadge.className = 'badge-stat invalid';
                        this.btnOpenPairs.disabled = true;
                    }
                } else {
                    dynamicBadge.textContent = `Çift Sayısı: ${pairsCount} Çift`;
                    if (!hasPairLeftovers) {
                        dynamicBadge.className = 'badge-stat valid';
                        this.btnOpenPairs.disabled = !canActThisTurn;
                    } else {
                        dynamicBadge.className = 'badge-stat invalid';
                        this.btnOpenPairs.disabled = true;
                    }
                }
                this.btnOpenMelds.disabled = true; // ALWAYS disable Elin Aç in Pair Mode
            } else {
                // Meld Mode
                const openedInPairs = player0.openedInPairs;
                const required = this.game.getRequiredOpenThreshold(0);
                this.selectedSumIndicator.textContent = `Seçili: ${totalSum} Puan`;
                
                const canAddNormal = !hasMeldLeftovers && validGroupsCount > 0;
                const canOpenNormal = canAddNormal && (hasOpenedBefore || totalSum >= required);

                if (openedInPairs) {
                    dynamicBadge.textContent = "Çift açtığınız için per açamazsınız!";
                    dynamicBadge.className = 'badge-stat invalid';
                    this.btnOpenMelds.disabled = true;
                } else if (!hasOpenedBefore) {
                    if (hasMeldLeftovers) {
                        dynamicBadge.textContent = `Per Toplamı: ${totalSum} / ${required} Puan (Geçersiz Taş var)`;
                        dynamicBadge.className = 'badge-stat invalid';
                        this.btnOpenMelds.disabled = true;
                    } else {
                        dynamicBadge.textContent = `Per Toplamı: ${totalSum} / ${required} Puan`;
                        if (canOpenNormal) {
                            dynamicBadge.className = 'badge-stat valid';
                            this.btnOpenMelds.disabled = !canActThisTurn;
                        } else {
                            dynamicBadge.className = 'badge-stat invalid';
                            this.btnOpenMelds.disabled = true;
                        }
                    }
                } else {
                    if (hasMeldLeftovers) {
                        dynamicBadge.textContent = `Per Toplamı: ${totalSum} Puan (Geçersiz Taş var)`;
                        dynamicBadge.className = 'badge-stat invalid';
                        this.btnOpenMelds.disabled = true;
                    } else {
                        dynamicBadge.textContent = `Per Toplamı: ${totalSum} Puan`;
                        if (canAddNormal) {
                            dynamicBadge.className = 'badge-stat valid';
                            this.btnOpenMelds.disabled = !canActThisTurn;
                        } else {
                            dynamicBadge.className = 'badge-stat invalid';
                            this.btnOpenMelds.disabled = true;
                        }
                    }
                }
                this.btnOpenPairs.disabled = true; // ALWAYS disable Çift Aç in Meld Mode
            }
        } else {
            this.selectedSumIndicator.style.display = 'none';
            dynamicBadge.textContent = 'Seçim Yapın (Per veya Çift)';
            dynamicBadge.className = 'badge-stat';
            this.btnOpenMelds.disabled = true;
            this.btnOpenPairs.disabled = true;
        }

        if (this.btnProcessTile) {
            const processableList = this.findAllProcessableTilesInHand();
            this.btnProcessTile.disabled = (!canActThisTurn || (processableList.length === 0 && this.selectedTileIds.size !== 1));
        }
    }

    syncRackFromHand() {
        this.rackGrid = [
            Array(24).fill(null),
            Array(24).fill(null)
        ];

        const hand = this.game.players[0].hand;
        let index = 0;
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                if (index < hand.length) {
                    this.rackGrid[r][c] = hand[index++];
                } else {
                    break;
                }
            }
        }
    }

    sortRackGroups() {
        const hand = this.game.players[0].hand;
        const meldsInfo = this.bot.findAllPossibleMelds(hand);
        
        const meldTileIds = new Set(meldsInfo.melds.flat().map(t => t.id));
        const leftovers = hand.filter(t => !meldTileIds.has(t.id));

        this.rackGrid = [
            Array(24).fill(null),
            Array(24).fill(null)
        ];

        let r = 0, c = 0;
        
        const placeTile = (tile) => {
            if (c >= 24) {
                r++;
                c = 0;
            }
            if (r >= 2) {
                r = 0;
                c = 0;
                while (r < 2 && this.rackGrid[r][c] !== null) {
                    c++;
                    if (c >= 24) {
                        r++;
                        c = 0;
                    }
                }
            }
            if (r < 2) {
                this.rackGrid[r][c] = tile;
                c++;
            }
        };

        meldsInfo.melds.forEach(meld => {
            meld.forEach(tile => placeTile(tile));
            if (c < 24) c++;
        });

        if (c < 24) c++;
        leftovers.forEach(tile => placeTile(tile));

        // Auto-select all tiles that form valid melds
        this.selectedTileIds.clear();
        meldsInfo.melds.forEach(meld => {
            meld.forEach(tile => {
                this.selectedTileIds.add(tile.id);
            });
        });

        this.renderRack();
        this.updateSelectionIndicators();
    }

    sortRackPairs() {
        const hand = this.game.players[0].hand;
        const pairs = this.findOptimalPairs(hand);
        const usedTileIds = new Set(pairs.flat().map(t => t.id));
        const leftovers = hand.filter(t => !usedTileIds.has(t.id));

        this.rackGrid = [
            Array(24).fill(null),
            Array(24).fill(null)
        ];

        let r = 0, c = 0;
        const placeTile = (tile) => {
            if (c >= 24) {
                r++;
                c = 0;
            }
            if (r >= 2) {
                r = 0;
                c = 0;
                while (r < 2 && this.rackGrid[r][c] !== null) {
                    c++;
                    if (c >= 24) {
                        r++;
                        c = 0;
                    }
                }
            }
            if (r < 2) {
                this.rackGrid[r][c] = tile;
                c++;
            }
        };

        pairs.forEach(pair => {
            placeTile(pair[0]);
            placeTile(pair[1]);
            if (c < 24) c++;
        });

        if (c < 24) c++;
        leftovers.forEach(tile => placeTile(tile));

        // Auto-select all tiles that form valid pairs
        this.selectedTileIds.clear();
        pairs.forEach(pair => {
            pair.forEach(tile => {
                this.selectedTileIds.add(tile.id);
            });
        });

        this.renderRack();
        this.updateSelectionIndicators();
    }

    addTileToFirstEmptySlot(tile) {
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                if (this.rackGrid[r][c] === null) {
                    this.rackGrid[r][c] = tile;
                    return;
                }
            }
        }
    }

    onDragStart(e, row, col) {
        this.dragSource = { row, col };
        this.draggedTileElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.setData('source', 'rack');
    }

    onDragEnd() {
        if (this.draggedTileElement) {
            this.draggedTileElement.classList.remove('dragging');
            this.draggedTileElement = null;
        }
        this.dragSource = null;
    }

    onDragOver(e, slot) {
        e.preventDefault();
        slot.classList.add('drag-over');
    }

    onDragLeave(slot) {
        slot.classList.remove('drag-over');
    }

    onDrop(e, slot) {
        slot.classList.remove('drag-over');
        const tileId = e.dataTransfer.getData('text/plain');
        const source = e.dataTransfer.getData('source');
        
        const targetRow = parseInt(slot.dataset.row);
        const targetCol = parseInt(slot.dataset.col);

        if (source === 'discard') {
            if (this.game.turn !== 0 || this.game.drawnThisTurn) return;
            
            const prevPlayerIdx = 3;
            const prevDiscards = this.game.players[prevPlayerIdx].discards;
            if (prevDiscards.length === 0) return;
            const potentialTile = prevDiscards[prevDiscards.length - 1];

            const canUse = this.bot.evaluateDiscardUse(0, potentialTile);
            if (!canUse) {
                audio.playError();
                this.addLog("Yerdeki taşı sadece elinizi açmak veya taş işlemek için çekebilirsiniz!", "system");
                return;
            }

            const tile = this.game.drawFromDiscard(0);
            if (tile) {
                audio.playClack(0.5, 1.1);
                if (this.rackGrid[targetRow][targetCol]) {
                    this.addTileToFirstEmptySlot(tile);
                } else {
                    this.rackGrid[targetRow][targetCol] = tile;
                }
                this.renderBoard();
                this.addLog(`Yerdeki ${tile.color}-${tile.number} taşını çektiniz.`);
            }
            return;
        }

        if (this.dragSource) {
            const { row, col } = this.dragSource;
            const sourceTile = this.rackGrid[row][col];
            const targetTile = this.rackGrid[targetRow][targetCol];

            if (row === targetRow && col === targetCol) return;

            this.rackGrid[row][col] = targetTile;
            this.rackGrid[targetRow][targetCol] = sourceTile;
            
            audio.playClack(0.3, 1.0);
            this.renderRack();
            this.updateSelectionIndicators();
        }
    }

    removeTileFromRackGrid(tileId) {
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                if (this.rackGrid[r][c] && this.rackGrid[r][c].id === tileId) {
                    this.rackGrid[r][c] = null;
                    return;
                }
            }
        }
    }

    clearRackOfTiles(tilesList) {
        const ids = new Set(tilesList.map(t => t.id));
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 24; c++) {
                if (this.rackGrid[r][c] && ids.has(this.rackGrid[r][c].id)) {
                    this.rackGrid[r][c] = null;
                }
            }
        }
    }

    addLog(msg, type = "player-action") {
        const p = document.createElement('p');
        p.className = `log-item ${type}`;
        p.textContent = msg;
        this.logsFeed.appendChild(p);
        this.logsFeed.scrollTop = this.logsFeed.scrollHeight;
    }

    showRoundOver() {
        const winnerIdx = this.game.players.findIndex(p => p.hand.length === 0);
        const winner = this.game.players[winnerIdx >= 0 ? winnerIdx : 0];
        
        if (winnerIdx >= 0) {
            if (this.game.partnerMode) {
                const teamName = (winnerIdx === 0 || winnerIdx === 2) ? "Siz & Canan (Takım A)" : "Metin & Oya (Takım B)";
                document.getElementById('round-winner-msg').textContent = `${winner.name} el açarak kazandı! Takımı ${teamName} çanağı paylaştı (kişi başı +${winner.lastWonChips} Çip)!`;
            } else {
                document.getElementById('round-winner-msg').textContent = `${winner.name} el açarak kazandı ve +${winner.lastWonChips} Çip aldı!`;
            }
        } else {
            document.getElementById('round-winner-msg').textContent = `El berabere bitti (deste tükendi). Çanak bir sonraki ele devrediyor (${this.game.rolledOverPot} Çip)!`;
        }
        
        const list = document.getElementById('round-scores-list');
        list.innerHTML = '';

        this.game.players.forEach(player => {
            const row = document.createElement('div');
            row.className = 'score-table-row';

            const name = document.createElement('span');
            name.className = 'player-name';
            name.textContent = player.name;

            const handSum = document.createElement('span');
            handSum.textContent = player.lastHandSum !== undefined ? player.lastHandSum : '-';

            const islekCeza = document.createElement('span');
            islekCeza.className = 'islek-ceza';
            const totalCeza = (player.lastIslekPenalty || 0) + (player.lastDiscardDrawPenalty || 0);
            islekCeza.textContent = totalCeza > 0 ? `+${totalCeza}` : '0';

            const thisRoundTotal = document.createElement('span');
            thisRoundTotal.className = 'this-round-total';
            thisRoundTotal.textContent = player.lastRoundTotal > 0 ? `+${player.lastRoundTotal}` : player.lastRoundTotal;

            const total = document.createElement('span');
            total.className = 'score-total';
            const chipDiff = (player.lastWonChips || 0) - this.game.entryBet;
            const chipDiffStr = chipDiff >= 0 ? `+${chipDiff}` : `${chipDiff}`;
            total.innerHTML = `<span style="font-weight: 700;">${player.score} P</span><br><small style="color: ${chipDiff >= 0 ? '#00e676' : '#ff5252'}; font-size: 10px; font-weight: 600; font-family: Outfit, sans-serif;">${chipDiffStr} Çip</small>`;

            row.appendChild(name);
            row.appendChild(handSum);
            row.appendChild(islekCeza);
            row.appendChild(thisRoundTotal);
            row.appendChild(total);
            list.appendChild(row);
        });

        if (this.game.partnerMode) {
            const teamASum = (this.game.players[0].lastRoundTotal || 0) + (this.game.players[2].lastRoundTotal || 0);
            const teamBSum = (this.game.players[1].lastRoundTotal || 0) + (this.game.players[3].lastRoundTotal || 0);
            const teamATotal = this.game.players[0].score + this.game.players[2].score;
            const teamBTotal = this.game.players[1].score + this.game.players[3].score;

            const teamDivider = document.createElement('div');
            teamDivider.className = 'team-score-divider';
            teamDivider.innerHTML = '<hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.15); margin: 12px 0;">';
            list.appendChild(teamDivider);

            const teamRow = document.createElement('div');
            teamRow.className = 'team-score-summary';
            teamRow.style.display = 'flex';
            teamRow.style.justifyContent = 'space-between';
            teamRow.style.padding = '8px 12px';
            teamRow.style.fontSize = '12px';
            teamRow.style.fontFamily = 'Outfit, sans-serif';
            
            const teamAInfo = document.createElement('div');
            teamAInfo.innerHTML = `<strong>Siz & Canan (Takım A):</strong> Bu El: <span style="color: var(--primary);">${teamASum > 0 ? '+' : ''}${teamASum}</span> | Toplam: <strong>${teamATotal} Puan</strong>`;
            
            const teamBInfo = document.createElement('div');
            teamBInfo.innerHTML = `<strong>Metin & Oya (Takım B):</strong> Bu El: <span style="color: var(--tile-yellow);">${teamBSum > 0 ? '+' : ''}${teamBSum}</span> | Toplam: <strong>${teamBTotal} Puan</strong>`;
            
            teamRow.appendChild(teamAInfo);
            teamRow.appendChild(teamBInfo);
            list.appendChild(teamRow);
        }

        this.modalRoundOver.classList.add('active');
    }

    showGameOver() {
        const list = document.getElementById('final-scores-list');
        list.innerHTML = '';

        if (this.game.partnerMode) {
            const teamATotal = this.game.players[0].score + this.game.players[2].score;
            const teamBTotal = this.game.players[1].score + this.game.players[3].score;
            
            let winMsg = "";
            if (teamATotal < teamBTotal) {
                winMsg = `🎉 Siz & Canan (Takım A) oyunu ${teamATotal} ceza puanıyla kazandınız!`;
            } else if (teamBTotal < teamATotal) {
                winMsg = `😔 Metin & Oya (Takım B) oyunu ${teamBTotal} ceza puanıyla kazandı!`;
            } else {
                winMsg = `🤝 Oyun berabere bitti! (İki takım da ${teamATotal} ceza puanında)`;
            }
            document.getElementById('game-winner-msg').textContent = winMsg;

            const itemA = document.createElement('div');
            itemA.className = `final-score-item ${teamATotal <= teamBTotal ? 'winner' : ''}`;
            itemA.innerHTML = `
                <span class="name">Siz & Canan (Takım A)</span>
                <span class="score">${teamATotal} Ceza | Siz: ${this.game.players[0].chips} / Canan: ${this.game.players[2].chips} Çip</span>
            `;
            list.appendChild(itemA);

            const itemB = document.createElement('div');
            itemB.className = `final-score-item ${teamBTotal <= teamATotal ? 'winner' : ''}`;
            itemB.innerHTML = `
                <span class="name">Metin & Oya (Takım B)</span>
                <span class="score">${teamBTotal} Ceza | Metin: ${this.game.players[1].chips} / Oya: ${this.game.players[3].chips} Çip</span>
            `;
            list.appendChild(itemB);
        } else {
            const scores = this.game.players.map(p => p.score);
            const minScore = Math.min(...scores);
            const winner = this.game.players[scores.indexOf(minScore)];

            document.getElementById('game-winner-msg').textContent = `${winner.name} oyunu ${minScore} ceza puanıyla kazandı!`;

            this.game.players.forEach(player => {
                const item = document.createElement('div');
                item.className = `final-score-item ${player === winner ? 'winner' : ''}`;
                
                const name = document.createElement('span');
                name.className = 'name';
                name.textContent = player.name;

                const score = document.createElement('span');
                score.className = 'score';
                score.textContent = `${player.score} Ceza | ${player.chips} Çip`;

                item.appendChild(name);
                item.appendChild(score);
                list.appendChild(item);
            });
        }

        this.modalGameOver.classList.add('active');
    }

    checkDailyReward() {
        const today = new Date().toDateString();
        const lastClaim = localStorage.getItem('okey_last_daily_reward');
        if (lastClaim !== today) {
            localStorage.setItem('okey_last_daily_reward', today);
            const humanPlayer = this.game.players[0];
            humanPlayer.chips += 500;
            try {
                localStorage.setItem('okey_player_chips', humanPlayer.chips);
            } catch (e) {}
            
            this.renderScoreboard();
            this.showDailyRewardToast(500);
        }
    }

    showDailyRewardToast(amount) {
        const toast = document.createElement('div');
        toast.className = 'daily-reward-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">🎁</span>
                <div class="toast-text">
                    <h4>Günlük Hediye Çip!</h4>
                    <p>Bugünkü +${amount} hediye çipiniz hesabınıza eklendi.</p>
                </div>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }
}

let ui;
function startApp() {
    if (!ui) {
        ui = new OkeyUI();
        window.ui = ui;
        ui.init();
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startApp();
} else {
    window.addEventListener('DOMContentLoaded', startApp);
}
window.startApp = startApp;
