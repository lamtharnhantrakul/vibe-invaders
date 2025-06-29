export class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;
        this.audioContext = null;
        this.backgroundMusic = null;
        this.backgroundMusicEnabled = true;
        this.backgroundMusicVolume = 0.2;
        this.initAudioContext();
        this.initSounds();
        this.initBackgroundMusic();
    }
    
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('AudioContext creation failed:', error);
        }
    }
    
    initBackgroundMusic() {
        // Create background music element
        this.backgroundMusic = new Audio();
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundMusicVolume;
        
        // Try to load a space-themed background music
        // Note: Due to CORS restrictions, we'll use a generated space ambient sound
        // In a real implementation, you would host your own audio file
        this.createSpaceAmbientMusic();
    }
    
    createSpaceAmbientMusic() {
        if (!this.audioContext) return;
        
        // Create a space ambient sound using Web Audio API
        const buffer = this.audioContext.createBuffer(2, 44100 * 20, 44100); // 20 seconds stereo for better looping
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / buffer.length;
                
                // Create multiple layers of ambient sounds
                const layer1 = Math.sin(2 * Math.PI * 80 * t) * 0.08; // Low drone
                const layer2 = Math.sin(2 * Math.PI * 160 * t + Math.sin(t * 8) * 0.3) * 0.04; // Modulated tone
                const layer3 = (Math.random() - 0.5) * 0.015; // Subtle noise
                const layer4 = Math.sin(2 * Math.PI * 240 * t + Math.sin(t * 6) * 1.5) * 0.025; // Higher tone
                const layer5 = Math.sin(2 * Math.PI * 320 * t + Math.sin(t * 4) * 2) * 0.02; // Highest tone
                
                // Add some variation based on time with smooth transitions
                const envelope = 0.6 + 0.2 * Math.sin(t * 15) + 0.1 * Math.sin(t * 7);
                
                // Create a more space-like atmosphere
                const spaceAtmosphere = Math.sin(2 * Math.PI * 40 * t) * 0.02;
                
                data[i] = (layer1 + layer2 + layer3 + layer4 + layer5 + spaceAtmosphere) * envelope;
            }
        }
        
        // Store the buffer for later use
        this.backgroundMusicBuffer = buffer;
        console.log('Space ambient music created successfully');
    }
    
    startBackgroundMusic() {
        if (!this.backgroundMusicEnabled || !this.backgroundMusicBuffer) {
            console.log('Background music not started:', { enabled: this.backgroundMusicEnabled, buffer: !!this.backgroundMusicBuffer });
            return;
        }
        
        try {
            // Resume audio context if it's suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Create new audio source
            const source = this.audioContext.createBufferSource();
            source.buffer = this.backgroundMusicBuffer;
            source.loop = true;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = this.backgroundMusicVolume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
            
            this.backgroundMusicSource = source;
            this.backgroundMusicGain = gainNode;
            
            console.log('Background music started successfully');
        } catch (error) {
            console.warn('Background music start failed:', error);
        }
    }
    
    stopBackgroundMusic() {
        if (this.backgroundMusicSource) {
            try {
                this.backgroundMusicSource.stop();
                this.backgroundMusicSource = null;
                this.backgroundMusicGain = null;
            } catch (error) {
                console.warn('Background music stop failed:', error);
            }
        }
    }
    
    setBackgroundMusicVolume(volume) {
        this.backgroundMusicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusicGain) {
            this.backgroundMusicGain.gain.value = this.backgroundMusicVolume;
        }
    }
    
    toggleBackgroundMusic() {
        this.backgroundMusicEnabled = !this.backgroundMusicEnabled;
        console.log('Background music toggled:', this.backgroundMusicEnabled ? 'ON' : 'OFF');
        if (this.backgroundMusicEnabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }
    
    isBackgroundMusicPlaying() {
        return this.backgroundMusicEnabled && this.backgroundMusicSource !== null;
    }
    
    initSounds() {
        // Create simple sound effects using Web Audio API
        this.createSound('shoot', this.generateShootSound());
        this.createSound('explosion', this.generateExplosionSound());
        this.createSound('hit', this.generateHitSound());
        this.createSound('gameOver', this.generateGameOverSound());
        this.createSound('levelComplete', this.generateLevelCompleteSound());
        this.createSound('victory', this.generateVictorySound());
    }
    
    createSound(name, audioBuffer) {
        this.sounds[name] = audioBuffer;
    }
    
    playSound(name) {
        if (!this.enabled || !this.sounds[name] || !this.audioContext) return;
        
        try {
            // Resume audio context if it's suspended (browser requirement)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[name];
            gainNode.gain.value = this.volume;
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }
    
    generateShootSound() {
        if (!this.audioContext) return null;
        const buffer = this.audioContext.createBuffer(1, 44100 * 0.1, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / buffer.length;
            data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 10) * 0.3;
        }
        
        return buffer;
    }
    
    generateExplosionSound() {
        if (!this.audioContext) return null;
        const buffer = this.audioContext.createBuffer(1, 44100 * 0.3, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / buffer.length;
            const noise = (Math.random() - 0.5) * 2;
            data[i] = noise * Math.exp(-t * 5) * 0.5;
        }
        
        return buffer;
    }
    
    generateHitSound() {
        if (!this.audioContext) return null;
        const buffer = this.audioContext.createBuffer(1, 44100 * 0.2, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / buffer.length;
            data[i] = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 8) * 0.4;
        }
        
        return buffer;
    }
    
    generateGameOverSound() {
        if (!this.audioContext) return null;
        const buffer = this.audioContext.createBuffer(1, 44100 * 0.5, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / buffer.length;
            const frequency = 200 - t * 100;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3) * 0.3;
        }
        
        return buffer;
    }
    
    generateLevelCompleteSound() {
        if (!this.audioContext) return null;
        const buffer = this.audioContext.createBuffer(1, 44100 * 0.8, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / buffer.length;
            // Ascending arpeggio
            const frequency = 400 + Math.sin(t * 8) * 200;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2) * 0.4;
        }
        
        return buffer;
    }
    
    generateVictorySound() {
        if (!this.audioContext) return null;
        const buffer = this.audioContext.createBuffer(1, 44100 * 1.0, 44100);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / buffer.length;
            // Victory fanfare with multiple tones
            const frequency1 = 523.25 + t * 200; // C major scale
            const frequency2 = 659.25 + t * 150;
            const frequency3 = 783.99 + t * 100;
            data[i] = (Math.sin(2 * Math.PI * frequency1 * t) + 
                      Math.sin(2 * Math.PI * frequency2 * t) + 
                      Math.sin(2 * Math.PI * frequency3 * t)) * Math.exp(-t * 1.5) * 0.3;
        }
        
        return buffer;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    toggleSound() {
        this.enabled = !this.enabled;
    }
    
    isEnabled() {
        return this.enabled;
    }
} 