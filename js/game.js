import { identities, identityDialogues, dialogues } from './data.js';
import { ParticleSystem, AudioManager } from './effects.js';

class Game {
    constructor() {
        this.state = {
            currentIdentity: null,
            currentNode: null,
            inventory: [],
            health: 100,
            sanity: 100,
            history: []
        };
        
        this.elements = {
            titleScreen: document.getElementById('title-screen'),
            identityScreen: document.getElementById('identity-screen'),
            gameContainer: document.getElementById('game-container'),
            identityList: document.getElementById('identity-list'),
            identityDesc: document.getElementById('identity-description'),
            identityTitle: document.getElementById('identity-title'),
            confirmBtn: document.getElementById('confirm-identity'),
            reselectBtn: document.getElementById('reselect-identity'),
            introText: document.getElementById('intro-text'),
            dialogueText: document.getElementById('dialogue-text'),
            choicesArea: document.getElementById('choices-area'),
            healthDisplay: document.getElementById('health-display'),
            sanityDisplay: document.getElementById('sanity-display'),
            inventoryDisplay: document.getElementById('inventory-display'),
            settingsModal: document.getElementById('settings-modal'),
            bgmSlider: document.getElementById('bgm-volume'),
            sfxSlider: document.getElementById('sfx-volume')
        };

        // Audio context (placeholder for user to add files)
        this.audio = {
            bgm: new Audio(),
            sfx: new Audio(),
            manager: new AudioManager(),
            bgmVolume: 0.5,
            sfxVolume: 0.5
        };
        this.audio.bgm.loop = true;
        this.bgmUrl = "assets/audio/BGM.mp3"; 
        
        this.particles = new ParticleSystem();

        this.typewriterTimeout = null;
        this.init();
    }

    playBGM() {
        // 确保音量是数字且在有效范围内
        let vol = parseFloat(this.audio.bgmVolume);
        if (isNaN(vol)) vol = 0.5;
        this.audio.bgm.volume = Math.max(0, Math.min(1, vol));

        // 检查路径是否正确设置
        if (!this.audio.bgm.src || !this.audio.bgm.src.includes("assets/audio/BGM.mp3")) {
            this.audio.bgm.src = this.bgmUrl;
            this.audio.bgm.load(); // 强制重新加载
        }

        // 尝试播放，并捕获错误
        const playPromise = this.audio.bgm.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 播放成功
                console.log("BGM playing successfully");
            }).catch(error => {
                console.warn("BGM play failed:", error);
                // 如果是因为没有用户交互导致的失败（NotAllowedError），
                // 我们不需要做太多处理，因为下次点击会再次尝试。
                // 但如果是文件找不到（404），可能需要提示。
                if (error.name === 'NotSupportedError' || error.message.includes('404')) {
                    console.error("Audio file not found or format not supported.");
                }
            });
        }
    }

    ensureAudioContext() {
        if (!this.audio.manager.context) {
            this.audio.manager.init();
        }
        if (this.audio.manager.context.state === 'suspended') {
            this.audio.manager.context.resume();
        }
        return this.audio.manager.context;
    }

    playClickSFX() {
        const ctx = this.ensureAudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(this.audio.sfxVolume * 0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    }

    playTypingSFX() {
        // Very short, high pitched click for typing
        const ctx = this.ensureAudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle'; // Sharper sound
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
        
        gain.gain.setValueAtTime(this.audio.sfxVolume * 0.1, ctx.currentTime); // Lower volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
    }

    init() {
        this.setupEventListeners();
        this.renderIdentityList();
        this.showScreen('title');
        
        const savedVol = localStorage.getItem('nw_volume');
        if (savedVol) {
            const vol = JSON.parse(savedVol);
            this.audio.bgmVolume = vol.bgm;
            this.audio.sfxVolume = vol.sfx;
            if(this.elements.bgmSlider) this.elements.bgmSlider.value = vol.bgm;
            if(this.elements.sfxSlider) this.elements.sfxSlider.value = vol.sfx;
        }
    }

    setupEventListeners() {
        // 全局点击事件，用于尽早激活 AudioContext，减少音效延迟
        const unlockAudio = () => {
            const ctx = this.ensureAudioContext();
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    console.log("AudioContext resumed successfully");
                    // 移除监听器，避免重复调用
                    document.removeEventListener('click', unlockAudio);
                    document.removeEventListener('touchstart', unlockAudio);
                });
            }
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);

        document.getElementById('start-btn').addEventListener('click', () => {
            this.playClickSFX();
            this.playBGM();
            this.showScreen('identity');
        });

        // Settings & Save/Load
        const settingsBtnTitle = document.getElementById('settings-btn-title');
        if(settingsBtnTitle) settingsBtnTitle.addEventListener('click', () => this.toggleSettings(true));
        
        const settingsBtnGame = document.getElementById('settings-btn-game');
        if(settingsBtnGame) settingsBtnGame.addEventListener('click', () => this.toggleSettings(true));
        
        const closeSettings = document.getElementById('close-settings');
        if(closeSettings) closeSettings.addEventListener('click', () => this.toggleSettings(false));
        
        const saveBtn = document.getElementById('save-btn');
        if(saveBtn) saveBtn.addEventListener('click', () => {
            this.playClickSFX();
            this.saveGame();
        });
        
        const loadBtnTitle = document.getElementById('load-btn-title');
        if(loadBtnTitle) loadBtnTitle.addEventListener('click', () => {
            this.playClickSFX();
            this.loadGame();
        });

        if(this.elements.bgmSlider) {
            this.elements.bgmSlider.addEventListener('input', (e) => {
                this.audio.bgmVolume = e.target.value;
                this.audio.bgm.volume = this.audio.bgmVolume;
                localStorage.setItem('nw_volume', JSON.stringify({bgm: this.audio.bgmVolume, sfx: this.audio.sfxVolume}));
            });
        }

        if(this.elements.sfxSlider) {
            this.elements.sfxSlider.addEventListener('input', (e) => {
                this.audio.sfxVolume = e.target.value;
                localStorage.setItem('nw_volume', JSON.stringify({bgm: this.audio.bgmVolume, sfx: this.audio.sfxVolume}));
            });
        }
        
        this.elements.confirmBtn.addEventListener('click', () => {
            if (this.state.currentIdentity) {
                this.playClickSFX();
                this.startGame();
            }
        });

        this.elements.reselectBtn.addEventListener('click', () => {
            this.playClickSFX();
            this.resetIdentitySelection()
        });
    }

    toggleSettings(show) {
        if(this.elements.settingsModal) {
            this.elements.settingsModal.style.display = show ? 'flex' : 'none';
            this.playClickSFX();
        }
    }

    saveGame() {
        const saveData = {
            state: this.state,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('nw_save', JSON.stringify(saveData));
        alert('游戏已保存');
    }

    loadGame() {
        const saveStr = localStorage.getItem('nw_save');
        if (!saveStr) {
            alert('没有找到存档');
            return;
        }
        const saveData = JSON.parse(saveStr);
        this.state = saveData.state;
        
        this.showScreen('game');
        this.updateStatus();
        this.playBGM();
        
        const identityData = dialogues[this.state.currentIdentity];
        if (identityData && identityData[this.state.currentNode]) {
            this.renderNode(identityData[this.state.currentNode]);
        }
    }

    renderIdentityList() {
        this.elements.identityList.innerHTML = '';
        identities.forEach(id => {
            const btn = document.createElement('button');
            btn.textContent = id;
            btn.classList.add('identity-btn');
            btn.addEventListener('click', () => this.selectIdentity(id));
            this.elements.identityList.appendChild(btn);
        });
    }

    selectIdentity(id) {
        this.state.currentIdentity = id;
        this.elements.identityTitle.textContent = "当前身份：" + id;
        this.elements.identityDesc.textContent = identityDialogues[id];
        this.elements.introText.style.display = 'none';
        
        // 隐藏列表，显示确认按钮
        Array.from(this.elements.identityList.children).forEach(btn => btn.style.display = 'none');
        this.elements.confirmBtn.style.display = 'inline-block';
        this.elements.reselectBtn.style.display = 'inline-block';
    }

    resetIdentitySelection() {
        this.state.currentIdentity = null;
        this.elements.identityTitle.textContent = "选择你的身份";
        this.elements.identityDesc.textContent = '';
        this.elements.introText.style.display = 'block';
        
        Array.from(this.elements.identityList.children).forEach(btn => btn.style.display = 'inline-block');
        this.elements.confirmBtn.style.display = 'none';
        this.elements.reselectBtn.style.display = 'none';
    }

    startGame() {
        this.state.inventory = [];
        this.state.health = 100;
        this.state.sanity = 100;
        this.state.history = [];
        this.updateStatus();
        this.showScreen('game');
        this.playNode('start');
    }

    playNode(nodeKey) {
        const identityData = dialogues[this.state.currentIdentity] || dialogues['市民'];
        const node = identityData[nodeKey];

        if (!node) {
            console.error(`Node ${nodeKey} not found for identity ${this.state.currentIdentity}`);
            return;
        }

        this.state.currentNode = node;
        
        // 清空选项
        this.elements.choicesArea.innerHTML = '';
        
        // 打字机效果显示文本
        this.typewriter(node.text, () => {
            this.renderChoices(node.choices);
        });
    }

    typewriter(text, callback) {
        const element = this.elements.dialogueText;
        element.textContent = '';
        element.classList.add('cursor');
        
        let i = 0;
        if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                // Play sound every other character to avoid too much noise, or every character if slow enough
                if (i % 2 === 0) this.playTypingSFX(); 
                i++;
                this.typewriterTimeout = setTimeout(type, 30); // 打字速度
            } else {
                element.classList.remove('cursor');
                if (callback) callback();
            }
        };
        type();
    }

    renderChoices(choices) {
        if (!choices || choices.length === 0) {
            // 结局或无选项，提供返回主菜单按钮
            const btn = document.createElement('button');
            btn.textContent = "返回主菜单";
            btn.classList.add('choice-btn', 'fade-in');
            btn.addEventListener('click', () => location.reload());
            this.elements.choicesArea.appendChild(btn);
            return;
        }

        choices.forEach(choice => {
            // 检查条件
            if (choice.condition) {
                if (choice.condition.hasItem && !this.state.inventory.includes(choice.condition.hasItem)) {
                    return; // 不满足条件，不显示
                }
                // 可以添加更多条件检查，如 health > 50 等
            }

            const btn = document.createElement('button');
            btn.textContent = choice.text;
            btn.classList.add('choice-btn', 'fade-in');
            btn.addEventListener('click', () => this.handleChoice(choice));
            this.elements.choicesArea.appendChild(btn);
        });
    }

    handleChoice(choice) {
        this.playClickSFX(); // Add sound to choices
        if (choice.effect) {
            if (choice.effect.addItem) {
                this.addItem(choice.effect.addItem);
            }
            if (choice.effect.removeItem) {
                this.removeItem(choice.effect.removeItem);
            }
            if (choice.effect.changeHealth) {
                this.changeHealth(choice.effect.changeHealth);
            }
            if (choice.effect.health) {
                this.changeHealth(choice.effect.health);
            }
            if (choice.effect.sanity) {
                this.changeSanity(choice.effect.sanity);
            }
        }

        this.playNode(choice.next);
    }

    addItem(item) {
        if (!this.state.inventory.includes(item)) {
            this.state.inventory.push(item);
            this.updateStatus();
            this.showNotification(`获得物品：${item}`);
        }
    }

    removeItem(item) {
        const index = this.state.inventory.indexOf(item);
        if (index > -1) {
            this.state.inventory.splice(index, 1);
            this.updateStatus();
            this.showNotification(`失去物品：${item}`);
        }
    }

    changeHealth(amount) {
        this.state.health += amount;
        if (this.state.health > 100) this.state.health = 100;
        if (this.state.health < 0) this.state.health = 0;
        this.updateStatus();
        if (amount < 0) this.showNotification(`生命值减少 ${Math.abs(amount)}`);
        else this.showNotification(`生命值增加 ${amount}`);
    }

    changeSanity(amount) {
        this.state.sanity += amount;
        if (this.state.sanity > 100) this.state.sanity = 100;
        if (this.state.sanity < 0) this.state.sanity = 0;
        this.updateStatus();
        if (amount < 0) this.showNotification(`理智减少 ${Math.abs(amount)}`);
        else this.showNotification(`理智增加 ${amount}`);
    }

    updateStatus() {
        this.elements.healthDisplay.textContent = `生命：${this.state.health}`;
        if (this.elements.sanityDisplay) {
            this.elements.sanityDisplay.textContent = `理智：${this.state.sanity}`;
        }
        this.elements.inventoryDisplay.innerHTML = '';
        this.state.inventory.forEach(item => {
            const span = document.createElement('span');
            span.textContent = item;
            span.classList.add('item-tag');
            this.elements.inventoryDisplay.appendChild(span);
        });
    }

    showNotification(msg) {
        // 简单的通知实现，可以扩展
        console.log(msg); 
        // 可以在界面上显示一个临时的浮层
        const note = document.createElement('div');
        note.textContent = msg;
        note.style.position = 'absolute';
        note.style.top = '10px';
        note.style.right = '10px';
        note.style.background = '#333';
        note.style.padding = '10px';
        note.style.border = '1px solid #fff';
        note.style.animation = 'fadeIn 0.5s, fadeOut 0.5s 2.5s forwards';
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 3000);
    }

    showScreen(screenName) {
        this.elements.titleScreen.style.display = 'none';
        this.elements.identityScreen.style.display = 'none';
        this.elements.gameContainer.style.display = 'none';

        if (screenName === 'title') this.elements.titleScreen.style.display = 'block';
        else if (screenName === 'identity') this.elements.identityScreen.style.display = 'flex';
        else if (screenName === 'game') this.elements.gameContainer.style.display = 'flex';
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
