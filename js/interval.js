class IntervalTimer {
    constructor() {
        this.workTime = 5 * 60 * 1000; // 5 minutes in ms
        this.restTime = 1 * 60 * 1000; // 1 minute in ms
        this.rounds = 5;
        this.currentRound = 1;
        this.isWorkPhase = true;
        this.remainingTime = this.workTime;
        this.timerInterval = null;
        this.isRunning = false;
        this.soundEnabled = true;
        this.onCompleteCallback = null;
    }

    setSettings(workMinutes, restMinutes, rounds) {
        this.workTime = workMinutes * 60 * 1000;
        this.restTime = restMinutes * 60 * 1000;
        this.rounds = rounds;
        this.reset();
        this.updateSettingsDisplay();
    }

    start() {
        if (!this.isRunning && this.currentRound <= this.rounds) {
            const startTime = Date.now();
            const endTime = startTime + this.remainingTime;
            
            this.timerInterval = setInterval(() => {
                this.remainingTime = endTime - Date.now();
                
                if (this.remainingTime <= 0) {
                    this.nextPhase();
                    return;
                }
                
                this.updateDisplay();
            }, 10);
            
            this.isRunning = true;
            document.getElementById('int-startBtn').textContent = 'Pause';
            if (this.soundEnabled) document.getElementById('startSound').play();
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            document.getElementById('int-startBtn').textContent = 'Resume';
        }
    }

    stop() {
        this.pause();
        this.reset();
        if (this.soundEnabled) document.getElementById('stopSound').play();
    }

    nextPhase() {
        clearInterval(this.timerInterval);
        
        if (this.isWorkPhase) {
            // Transition to rest phase
            this.isWorkPhase = false;
            this.remainingTime = this.restTime;
            document.getElementById('phase-display').textContent = 'REST';
            document.getElementById('phase-display').style.color = '#4cc9f0';
        } else {
            // Transition to next work phase
            this.currentRound++;
            this.isWorkPhase = true;
            this.remainingTime = this.workTime;
            document.getElementById('phase-display').textContent = 'WORK';
            document.getElementById('phase-display').style.color = '#f72585';
        }
        
        if (this.currentRound > this.rounds) {
            this.complete();
            return;
        }
        
        this.updateRoundDisplay();
        this.start();
        if (this.soundEnabled) document.getElementById('beepSound').play();
    }

    complete() {
        this.isRunning = false;
        document.getElementById('int-startBtn').textContent = 'Start';
        document.getElementById('interval-view').classList.add('flash');
        setTimeout(() => {
            document.getElementById('interval-view').classList.remove('flash');
        }, 1000);
        if (this.soundEnabled) document.getElementById('beepSound').play();
        if (this.onCompleteCallback) this.onCompleteCallback();
    }

    reset() {
        this.pause();
        this.currentRound = 1;
        this.isWorkPhase = true;
        this.remainingTime = this.workTime;
        this.updateRoundDisplay();
        this.updateDisplay();
        document.getElementById('phase-display').textContent = 'WORK';
        document.getElementById('phase-display').style.color = '#f72585';
    }

    updateDisplay() {
        const totalSeconds = Math.ceil(this.remainingTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('interval-time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateRoundDisplay() {
        document.getElementById('current-round').textContent = this.currentRound;
        document.getElementById('total-rounds').textContent = this.rounds;
    }

    updateSettingsDisplay() {
        document.getElementById('work-minutes').value = this.workTime / 60000;
        document.getElementById('rest-minutes').value = this.restTime / 60000;
        document.getElementById('rounds').value = this.rounds;
    }

    toggleSound(enabled) {
        this.soundEnabled = enabled;
    }

    onComplete(callback) {
        this.onCompleteCallback = callback;
    }
}

const intervalTimer = new IntervalTimer();

// Initialize interval timer controls
document.addEventListener('DOMContentLoaded', () => {
    // Start/Pause button
    document.getElementById('int-startBtn').addEventListener('click', () => {
        if (intervalTimer.isRunning) {
            intervalTimer.pause();
        } else {
            const workMinutes = parseInt(document.getElementById('work-minutes').value) || 5;
            const restMinutes = parseInt(document.getElementById('rest-minutes').value) || 1;
            const rounds = parseInt(document.getElementById('rounds').value) || 5;
            
            intervalTimer.setSettings(workMinutes, restMinutes, rounds);
            intervalTimer.start();
        }
    });
    
    // Stop button
    document.getElementById('int-stopBtn').addEventListener('click', () => {
        intervalTimer.stop();
    });
    
    // Input validation
    document.querySelectorAll('.interval-settings input').forEach(input => {
        input.addEventListener('change', () => {
            let value = parseInt(input.value) || 1;
            
            if (input.id === 'rounds') {
                value = Math.min(20, Math.max(1, value));
            } else {
                value = Math.min(60, Math.max(1, value));
            }
            
            input.value = value;
        });
    });
    
    // Set initial display
    intervalTimer.updateSettingsDisplay();
    intervalTimer.updateRoundDisplay();
    intervalTimer.updateDisplay();
});