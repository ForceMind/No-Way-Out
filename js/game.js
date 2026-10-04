import { identities, storyData } from './data.js';
import { ParticleSystem, AudioManager } from './effects.js';
import { writeJSON, readVolume, saveSlot, loadSlot, listSlots } from './core/save-store.js';
import { createState, transition } from './core/engine.js';
import { checkCondition } from './core/conditions.js';
import { readEndings, collectEnding } from './ui/endings.js';
import { Typewriter } from './ui/typewriter.js';
import { readPreferences, savePreferences } from './ui/preferences.js';

class Game {
    constructor() {
        this.state = createState();
        this.transitioning = false;
        
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

        this.writer = new Typewriter();
        this.preferences = readPreferences(undefined, matchMedia("(prefers-reduced-motion: reduce)").matches).value;
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
        try {
            if (!this.audio.manager.context) this.audio.manager.init();
            const ctx = this.audio.manager.context;
            if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
            return ctx;
        } catch { return null; }
    }

    playClickSFX() {
        const ctx = this.ensureAudioContext();
        if (!ctx || Number(this.audio.sfxVolume) === 0) return;
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
        if (!ctx || Number(this.audio.sfxVolume) === 0) return;
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
        
        const volume = readVolume();
        this.audio.bgmVolume = volume.value.bgm;
        this.audio.sfxVolume = volume.value.sfx;
        if(this.elements.bgmSlider) this.elements.bgmSlider.value = volume.value.bgm;
        if(this.elements.sfxSlider) this.elements.sfxSlider.value = volume.value.sfx;
        if (!volume.ok) this.showNotification('音量设置无法读取，本次使用默认音量');
        this.applyPreferences();
        document.getElementById('continue-btn').hidden = !loadSlot('auto', storyData, {migrate:false}).ok;
    }

    setupEventListeners() {
        document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('keydown', event => {
            if (event.key !== 'Tab') return;
            const controls = [...dialog.querySelectorAll('button:not(:disabled),input,select,[tabindex="0"]')].filter(control => control.getClientRects().length);
            const first=controls[0], last=controls.at(-1);
            if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
            else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
        }));
        // 全局点击事件，用于尽早激活 AudioContext，减少音效延迟
        const unlockAudio = () => { this.ensureAudioContext(); };
        document.addEventListener('click', unlockAudio, {once:true});
        document.addEventListener('touchstart', unlockAudio, {once:true});
        document.getElementById('endings-btn').addEventListener('click', () => {
            const list=document.getElementById('endings-list'); list.replaceChildren();
            const result=readEndings();
            if (!result.ok || !result.valid) list.textContent='收藏记录无法读取，原记录已保留。';
            else if (!result.value.length) list.textContent='尚未记录结局。';
            else for (const entry of result.value) { const p=document.createElement('p');p.textContent=entry.title;list.append(p); }
            document.getElementById('endings-modal').showModal();
        });
        document.getElementById('close-endings').addEventListener('click', () => document.getElementById('endings-modal').close());
        document.getElementById('continue-btn').addEventListener('click', () => this.loadGame('auto'));
        for (const id of ['saves-btn-title', 'saves-btn-game']) document.getElementById(id).addEventListener('click', () => this.openSaves());
        document.getElementById('close-saves').addEventListener('click', () => document.getElementById('save-modal').close());
        document.getElementById('history-btn').addEventListener('click', () => this.openHistory());
        document.getElementById('close-history').addEventListener('click', () => document.getElementById('history-modal').close());
        document.getElementById('skip-text').addEventListener('click', () => this.writer.skip());
        this.elements.dialogueText.addEventListener('click', () => this.writer.skip());
        document.addEventListener('keydown', event => {
            if (event.code === 'Space' && this.writer.finish && !document.querySelector('dialog[open]') && !['BUTTON','INPUT','SELECT','TEXTAREA'].includes(event.target.tagName)) {
                event.preventDefault(); this.writer.skip();
            }
        });
        for (const id of ['reading-speed','reading-size','reduced-motion']) document.getElementById(id).addEventListener('change', () => {
            this.preferences = {speed:Number(document.getElementById('reading-speed').value),fontSize:Number(document.getElementById('reading-size').value),reducedMotion:document.getElementById('reduced-motion').checked};
            this.applyPreferences();
            if (!savePreferences(this.preferences).ok) this.showNotification('设置无法保存，本次设置仍生效');
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            this.playClickSFX();
            this.playBGM();
            this.resetIdentitySelection();
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
                this.saveVolume();
            });
        }

        if(this.elements.sfxSlider) {
            this.elements.sfxSlider.addEventListener('input', (e) => {
                this.audio.sfxVolume = e.target.value;
                this.saveVolume();
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

    applyPreferences() {
        document.getElementById('reading-speed').value = this.preferences.speed;
        document.getElementById('reading-size').value = this.preferences.fontSize;
        document.getElementById('reduced-motion').checked = this.preferences.reducedMotion;
        document.documentElement.style.setProperty('--reading-size', `${this.preferences.fontSize}px`);
        document.body.classList.toggle('reduced-motion', this.preferences.reducedMotion);
        this.particles.setReducedMotion(this.preferences.reducedMotion);
    }

    toggleSettings(show) {
        if (show) this.elements.settingsModal.showModal();
        else this.elements.settingsModal.close();
        this.playClickSFX();
    }

    openHistory() {
        const list = document.getElementById('history-list');
        list.replaceChildren();
        if (!this.state.history.length) list.textContent = '还没有做出选择。';
        for (const entry of this.state.history) {
            const section = document.createElement('section');
            const passage = document.createElement('p'); passage.textContent = entry.nodeText;
            const action = document.createElement('p'); action.textContent = `你的选择：${entry.text}`; action.className = 'history-choice';
            section.append(passage, action); list.append(section);
        }
        document.getElementById('history-modal').showModal();
    }

    openSaves() {
        const list = document.getElementById('save-slots'); list.replaceChildren();
        for (const result of listSlots(storyData)) {
            const row = document.createElement('section'); row.className = 'save-slot';
            const label = result.slot === 'auto' ? '自动存档' : `手动存档 ${result.slot.slice(-1)}`;
            const info = document.createElement('p');
            const identity = result.ok ? identities.find(item => item.id === result.state.currentIdentity)?.name : '';
            info.textContent = `${label} · ${result.ok ? `${identity} · ${new Date(result.record.savedAt).toLocaleString()} · ${result.state.history.length} 次选择` : result.reason === 'missing' ? '空' : '无法读取，原记录已保留'}`;
            row.append(info);
            const load = document.createElement('button'); load.textContent = '读取'; load.disabled = !result.ok; load.dataset.slot = result.slot;
            load.addEventListener('click', () => {this.loadGame(result.slot); document.getElementById('save-modal').close();}); row.append(load);
            if (result.slot !== 'auto') {
                const save = document.createElement('button'); save.textContent = '保存到此处'; save.dataset.saveSlot = result.slot;
                save.disabled = !this.state.currentIdentity || !this.state.currentNode;
                save.addEventListener('click', () => {
                    if (result.reason !== 'missing' && !confirm('覆盖此存档？原记录将被替换。')) return;
                    this.saveGame(result.slot); this.openSavesRefresh();
                }); row.append(save);
            }
            list.append(row);
        }
        document.getElementById('save-modal').showModal();
    }

    openSavesRefresh() { document.getElementById('save-modal').close(); this.openSaves(); }

    saveGame(slot = 'manual-1') {
        const result = saveSlot(slot, this.state, storyData);
        alert(result.ok ? '游戏已保存' : '无法写入存档，请检查浏览器存储设置；当前游戏可继续');
    }

    autoSave() {
        const result = saveSlot('auto', this.state, storyData);
        if (!result.ok && !this.storageWarningShown) this.showNotification('自动存档无法保存，当前游戏仍可继续');
        this.storageWarningShown = !result.ok;
    }

    saveVolume() {
        const result = writeJSON('nw_volume', { bgm: this.audio.bgmVolume, sfx: this.audio.sfxVolume });
        if (!result.ok) this.showNotification('音量设置无法保存，本次设置仍然生效');
    }

    loadGame(slot = 'manual-1') {
        const decoded = loadSlot(slot, storyData);
        if (!decoded.ok) {
            const message = decoded.reason === 'missing' ? '没有找到存档'
                : ['invalid-json', 'storage-unavailable'].includes(decoded.reason) ? '存档无法读取，原记录已保留；你可以开始新游戏'
                : ['unsupported-version', 'unsupported-content'].includes(decoded.reason) ? '存档版本不兼容，原记录已保留'
                : '存档内容无效，原记录已保留；你可以开始新游戏';
            alert(message);
            return;
        }
        this.state = decoded.state;
        if (decoded.warning) this.showNotification('旧存档已读取，转换结果暂无法保存；原记录已保留');
        
        this.showScreen('game');
        this.updateStatus();
        this.playBGM();
        
        const identityData = storyData[this.state.currentIdentity];
        if (identityData && identityData[this.state.currentNode]) {
            this.renderNode(identityData[this.state.currentNode]);
        }
    }

    renderIdentityList() {
        this.elements.identityList.innerHTML = '';
        identities.forEach(idObj => {
            const btn = document.createElement('button');
            btn.textContent = idObj.name;
            btn.classList.add('identity-btn');
            btn.addEventListener('click', () => this.selectIdentity(idObj.id));
            this.elements.identityList.appendChild(btn);
        });
    }

    selectIdentity(id) {
        this.state.currentIdentity = id;
        const idObj = identities.find(i => i.id === id);
        this.elements.identityTitle.textContent = "当前身份：" + idObj.name;
        this.elements.identityDesc.textContent = idObj.desc;
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
        this.state = createState(this.state.currentIdentity);
        this.updateStatus();
        this.showScreen('game');
        this.playNode('start');
        this.autoSave();
    }

    playNode(nodeKey) {
        const identityData = storyData[this.state.currentIdentity];
        const node = identityData[nodeKey];

        if (!node) {
            console.error(`Node ${nodeKey} not found for identity ${this.state.currentIdentity}`);
            return;
        }

        this.state.currentNode = nodeKey; // Store key, not object, for saving
        this.renderHeading(node);
        
        // 清空选项
        this.elements.choicesArea.innerHTML = '';
        
        // 打字机效果显示文本
        this.typewriter(node.text, () => {
            this.transitioning = false;
            this.renderChoices(node.choices);
        });
    }

    // Helper to render node from object (used in loadGame)
    renderNode(node) {
         this.renderHeading(node);
         // 清空选项
         this.elements.choicesArea.innerHTML = '';
        
         // 打字机效果显示文本
         this.typewriter(node.text, () => {
             this.transitioning = false;
             this.renderChoices(node.choices);
         });
    }

    typewriter(text, callback) {
        const element = this.elements.dialogueText;
        const skip = document.getElementById('skip-text');
        skip.hidden = this.preferences.speed === 0;
        this.writer.start(text, {
            delay:this.preferences.reducedMotion ? 0 : this.preferences.speed,
            render:(value, active) => {element.textContent=value; element.classList.toggle('cursor', active);},
            tick:index => {if (index % 2 === 0) this.playTypingSFX();},
            complete:() => {skip.hidden=true; callback?.();}
        });
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

        const nodeKey = this.state.currentNode;
        choices.forEach((choice, choiceIndex) => {
            const condition = choice.strenuous && this.state.ruleset === 'survival-v1' && this.state.fatigue >= 80 ? {allowed:false,reason:'疲劳过高，请先休息'} : checkCondition(choice.condition, this.state);
            if (!condition.allowed && choice.visibility !== 'locked' && !choice.strenuous) return;

            const btn = document.createElement('button');
            btn.textContent = condition.allowed ? choice.text : `${choice.text}（${condition.reason}）`;
            btn.disabled = !condition.allowed;
            btn.classList.add('choice-btn', 'fade-in');
            btn.addEventListener('click', () => this.handleChoice({ nodeKey, choiceIndex }));
            this.elements.choicesArea.appendChild(btn);
        });
    }

    handleChoice(selection) {
        if (this.transitioning) return;
        const result = transition(this.state, selection, storyData);
        if (!result.ok) {
            this.showNotification(result.reason);
            return;
        }
        this.transitioning = true;
        this.playClickSFX();
        this.state = result.state;
        this.autoSave();
        this.updateStatus();
        for (const event of result.events) this.showNotification(event.message);
        this.playNode(this.state.currentNode);
    }

    renderHeading(node) {
        const ending = node.choices.length === 0;
        const identity = identities.find(item => item.id === this.state.currentIdentity)?.name;
        const heading = document.getElementById('chapter-heading');
        heading.replaceChildren();
        const title = document.createElement('h2');
        title.textContent = ending ? node.ending?.title ?? `${identity} · ${node.text.match(/（([^（）]*结局[^（）]*)）/)?.[1] ?? this.state.currentNode}` : `${identity}${node.chapter ? ` · ${node.chapter}` : ''}${node.location ? ` · ${node.location}` : ''}`;
        heading.append(title);
        if (ending) {
            const summary = document.createElement('p');
            summary.textContent = `经历 ${this.state.history.length} 次选择 · 生命 ${this.state.health} · 理智 ${this.state.sanity}${this.state.ruleset==='survival-v1' ? ` · 食物 ${this.state.resources.food} · 饮水 ${this.state.resources.water}` : ''}`;
            heading.append(summary);
            const last = this.state.history.slice(-3);
            for (const entry of last) {const p=document.createElement('p');p.textContent=`关键经历：${entry.text}`;heading.append(p);}
            if (!collectEnding({identity:this.state.currentIdentity,node:this.state.currentNode,title:title.textContent,at:Date.now()}).ok) this.showNotification('结局收藏无法保存，原记录已保留');
        }
    }

    updateStatus() {
        const survival=document.getElementById('survival-status');
        survival.hidden=this.state.ruleset !== 'survival-v1';
        if(!survival.hidden) survival.textContent=`第 ${this.state.clock.day} 天 · ${['清晨','午后','夜晚'][this.state.clock.period]} · 食物 ${this.state.resources.food} · 饮水 ${this.state.resources.water} · 饥饿 ${this.state.hunger} · 疲劳 ${this.state.fatigue}`;
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
        console.log(msg);
        const note = document.createElement('div'); note.textContent=msg;
        document.getElementById('notifications').append(note);
        setTimeout(() => note.remove(), 4000);
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
