class CountdownTimer {
    constructor() {
        this.targetTime = 0;
        this.remainingTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.soundEnabled = true;
    }

    setTime(hours, minutes, seconds) {
        this.targetTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        this.remainingTime = this.targetTime;
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning && this.remainingTime > 0) {
            const startTime = Date.now();
            const endTime = startTime + this.remainingTime;
            
            this.timerInterval = setInterval(() => {
                this.remainingTime = endTime - Date.now();
                
                if (this.remainingTime <= 0) {
                    this.remainingTime = 0;
                    this.complete();
                }
                
                this.updateDisplay();
            }, 10);
            
            this.isRunning = true;
            if (this.soundEnabled) document.getElementById('startSound').play();
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
        }
    }

    reset() {
        this.pause();
        this.remainingTime = this.targetTime;
        this.updateDisplay();
        if (this.soundEnabled) document.getElementById('stopSound').play();
    }

    complete() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        if (this.soundEnabled) document.getElementById('beepSound').play();
        document.getElementById('cd-startBtn').textContent = 'Start';
        document.getElementById('countdown-view').classList.add('flash');
        setTimeout(() => {
            document.getElementById('countdown-view').classList.remove('flash');
        }, 1000);
    }

    updateDisplay() {
        const totalSeconds = Math.ceil(this.remainingTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('cd-hours').value = hours.toString().padStart(2, '0');
        document.getElementById('cd-minutes').value = minutes.toString().padStart(2, '0');
        document.getElementById('cd-seconds').value = seconds.toString().padStart(2, '0');
    }

    toggleSound(enabled) {
        this.soundEnabled = enabled;
    }
}

const countdown = new CountdownTimer();

// Initialize countdown controls
document.addEventListener('DOMContentLoaded', () => {
    // Set initial time to 5 minutes
    countdown.setTime(0, 5, 0);
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            countdown.setTime(0, minutes, 0);
            countdown.reset();
        });
    });
    
    // Start button
    document.getElementById('cd-startBtn').addEventListener('click', () => {
        if (countdown.isRunning) {
            countdown.pause();
            document.getElementById('cd-startBtn').textContent = 'Start';
        } else {
            const hours = parseInt(document.getElementById('cd-hours').value) || 0;
            const minutes = parseInt(document.getElementById('cd-minutes').value) || 0;
            const seconds = parseInt(document.getElementById('cd-seconds').value) || 0;
            
            countdown.setTime(hours, minutes, seconds);
            countdown.start();
            document.getElementById('cd-startBtn').textContent = 'Pause';
        }
    });
    
    // Reset button
    document.getElementById('cd-resetBtn').addEventListener('click', () => {
        countdown.reset();
        document.getElementById('cd-startBtn').textContent = 'Start';
    });
    
    // Input validation
    document.querySelectorAll('.time-input input').forEach(input => {
        input.addEventListener('change', () => {
            let value = parseInt(input.value) || 0;
            
            if (input.id === 'cd-hours') {
                value = Math.min(23, Math.max(0, value));
            } else {
                value = Math.min(59, Math.max(0, value));
            }
            
            input.value = value.toString().padStart(2, '0');
        });
    });
});