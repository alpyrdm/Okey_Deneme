// ==========================================
// OKEY 101 MULTIPLAYER NETWORK MANAGER
// Supports PeerJS P2P Room Creation & Joining
// ==========================================

class MultiplayerManager {
    constructor() {
        this.peer = null;
        this.connections = []; // For Host
        this.hostConnection = null; // For Client
        this.isHost = false;
        this.roomCode = null;
        this.mySeatIndex = 0;
        this.seats = [
            { id: null, name: 'Siz', isBot: false },
            { id: null, name: 'Bot 1', isBot: true },
            { id: null, name: 'Bot 2', isBot: true },
            { id: null, name: 'Bot 3', isBot: true }
        ];
        this.onActionReceived = null;
        this.onRoomStateChanged = null;
    }

    generateRoomCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `OKEY-${code}`;
    }

    loadPeerJsScript() {
        if (typeof Peer !== 'undefined') return Promise.resolve(true);
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => {
                console.warn("PeerJS CDN could not be loaded. Operating in Local/Bot mode.");
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    async initHost(roomCode = null, playerName = "Siz") {
        await this.loadPeerJsScript();
        return new Promise((resolve) => {
            this.isHost = true;
            this.roomCode = roomCode || this.generateRoomCode();
            this.seats[0] = { id: 'host', name: playerName, isBot: false };
            this.mySeatIndex = 0;

            const peerId = `okey101-${this.roomCode}`;
            
            if (typeof Peer === 'undefined') {
                console.warn("PeerJS script is not loaded. Operating in Local/Bot mode.");
                resolve({ success: true, roomCode: this.roomCode, localOnly: true });
                return;
            }

            try {
                this.peer = new Peer(peerId, { debug: 1 });

                this.peer.on('open', (id) => {
                    console.log("Room created with Peer ID:", id);
                    resolve({ success: true, roomCode: this.roomCode });
                });

                this.peer.on('connection', (conn) => {
                    this.handleIncomingConnection(conn);
                });

                this.peer.on('error', (err) => {
                    console.error("PeerJS Error:", err);
                    resolve({ success: true, roomCode: this.roomCode, localOnly: true });
                });
            } catch (e) {
                console.error("PeerJS initialization exception:", e);
                resolve({ success: true, roomCode: this.roomCode, localOnly: true });
            }
        });
    }

    handleIncomingConnection(conn) {
        const emptySeatIdx = this.seats.findIndex(s => s.isBot);
        if (emptySeatIdx === -1) {
            conn.send({ type: 'ROOM_FULL' });
            setTimeout(() => conn.close(), 500);
            return;
        }

        conn.on('open', () => {
            this.connections.push(conn);
            conn.on('data', (data) => this.handleHostReceivedData(conn, data));
            conn.on('close', () => this.handleClientDisconnect(conn));
        });
    }

    handleHostReceivedData(conn, data) {
        if (data.type === 'JOIN_REQUEST') {
            const emptySeatIdx = this.seats.findIndex(s => s.isBot);
            if (emptySeatIdx !== -1) {
                this.seats[emptySeatIdx] = { id: conn.peer, name: data.playerName || `Oyuncu ${emptySeatIdx + 1}`, isBot: false };
                conn.seatIndex = emptySeatIdx;

                conn.send({
                    type: 'JOIN_ACCEPT',
                    seatIndex: emptySeatIdx,
                    roomCode: this.roomCode,
                    seats: this.seats
                });

                this.broadcast({
                    type: 'ROOM_STATE_UPDATE',
                    seats: this.seats
                });

                if (this.onRoomStateChanged) {
                    this.onRoomStateChanged(this.seats);
                }
            }
        } else if (data.type === 'REQUEST_SEAT_SWAP') {
            const currentSeat = conn.seatIndex;
            const newSeat = data.newSeatIndex;
            if (currentSeat !== undefined && newSeat !== undefined) {
                const temp = this.seats[currentSeat];
                this.seats[currentSeat] = this.seats[newSeat];
                this.seats[newSeat] = temp;
                conn.seatIndex = newSeat;

                this.broadcast({
                    type: 'ROOM_STATE_UPDATE',
                    seats: this.seats
                });

                if (this.onRoomStateChanged) {
                    this.onRoomStateChanged(this.seats);
                }
            }
        } else if (data.type === 'ACTION') {
            if (this.onActionReceived) {
                this.onActionReceived(data.action);
            }
            this.broadcast(data, conn);
        }
    }

    swapSeat(targetSeatIdx) {
        if (targetSeatIdx < 0 || targetSeatIdx >= 4) return false;
        if (targetSeatIdx === this.mySeatIndex) return true;

        const temp = this.seats[this.mySeatIndex];
        this.seats[this.mySeatIndex] = this.seats[targetSeatIdx];
        this.seats[targetSeatIdx] = temp;

        this.mySeatIndex = targetSeatIdx;

        const updateData = {
            type: 'ROOM_STATE_UPDATE',
            seats: this.seats
        };

        if (this.isHost) {
            this.broadcast(updateData);
        } else if (this.hostConnection && this.hostConnection.open) {
            this.hostConnection.send({
                type: 'REQUEST_SEAT_SWAP',
                newSeatIndex: targetSeatIdx
            });
        }

        if (this.onRoomStateChanged) {
            this.onRoomStateChanged(this.seats);
        }

        return true;
    }

    handleClientDisconnect(conn) {
        const seatIdx = conn.seatIndex;
        if (seatIdx !== undefined && seatIdx !== -1) {
            this.seats[seatIdx] = { id: null, name: `Bot ${seatIdx}`, isBot: true };
            this.broadcast({
                type: 'ROOM_STATE_UPDATE',
                seats: this.seats
            });
            if (this.onRoomStateChanged) {
                this.onRoomStateChanged(this.seats);
            }
        }
    }

    normalizeRoomCode(code) {
        if (!code) return '';
        let clean = code.toUpperCase().trim().replace(/^#/, '');
        if (!clean.startsWith('OKEY-')) {
            clean = `OKEY-${clean}`;
        }
        return clean;
    }

    async joinRoom(roomCode, playerName = "Oyuncu") {
        await this.loadPeerJsScript();
        return new Promise((resolve) => {
            this.isHost = false;
            this.roomCode = this.normalizeRoomCode(roomCode);
            const hostPeerId = `okey101-${this.roomCode}`;

            if (typeof Peer === 'undefined') {
                resolve({ success: false, reason: "PeerJS kütüphanesi yüklenemedi." });
                return;
            }

            try {
                this.peer = new Peer({ debug: 1 });

                this.peer.on('open', () => {
                    this.hostConnection = this.peer.connect(hostPeerId);

                    this.hostConnection.on('open', () => {
                        this.hostConnection.send({
                            type: 'JOIN_REQUEST',
                            playerName: playerName
                        });
                    });

                    this.hostConnection.on('data', (data) => {
                        if (data.type === 'START_GAME') {
                            if (this.onStartGameReceived) {
                                this.onStartGameReceived(data);
                            }
                        } else if (data.type === 'JOIN_ACCEPT') {
                            this.mySeatIndex = data.seatIndex;
                            this.seats = data.seats;
                            resolve({ success: true, roomCode: this.roomCode, seatIndex: this.mySeatIndex });
                        } else if (data.type === 'ROOM_FULL') {
                            resolve({ success: false, reason: "Oda dolu! (En fazla 4 oyuncu katılabilir)" });
                        } else if (data.type === 'ROOM_STATE_UPDATE') {
                            this.seats = data.seats;
                            if (this.onRoomStateChanged) {
                                this.onRoomStateChanged(this.seats);
                            }
                        } else if (data.type === 'ACTION') {
                            if (this.onActionReceived) {
                                this.onActionReceived(data.action);
                            }
                        }
                    });

                    this.hostConnection.on('error', () => {
                        resolve({ success: false, reason: "Odaya bağlanılamadı. Oda kodunu kontrol edin." });
                    });
                });

                this.peer.on('error', () => {
                    resolve({ success: false, reason: "Oda bulunamadı veya ev sahibi oyundan çıktı." });
                });
            } catch (e) {
                resolve({ success: false, reason: e.message });
            }
        });
    }

    broadcast(data, excludeConn = null) {
        this.connections.forEach(conn => {
            if (conn !== excludeConn && conn.open) {
                conn.send(data);
            }
        });
    }

    sendAction(action) {
        if (this.isHost) {
            this.broadcast({ type: 'ACTION', action: action });
        } else if (this.hostConnection && this.hostConnection.open) {
            this.hostConnection.send({ type: 'ACTION', action: action });
        }
    }

    getShareableLink() {
        if (!this.roomCode) return window.location.origin + window.location.pathname;
        return `${window.location.origin}${window.location.pathname}?room=${this.roomCode}`;
    }
}

window.MultiplayerManager = MultiplayerManager;
