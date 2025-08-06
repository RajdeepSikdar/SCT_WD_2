class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }, 10);
            this.isRunning = true;
            document.getElementById('startSound').play();
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            document.getElementById('stopSound').play();
        }
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapsDisplay();
    }

    lap() {
        if (this.isRunning) {
            const lapTime = this.getFormattedTime();
            this.laps.unshift({
                number: this.laps.length + 1,
                time: lapTime,
                total: this.elapsedTime
            });
            document.getElementById('lapSound').play();
            this.updateLapsDisplay();
        }
    }

    getFormattedTime() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);

        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(2, '0'),
            toString: function() {
                return `${this.hours}:${this.minutes}:${this.seconds}.${this.milliseconds}`;
            }
        };
    }

    updateDisplay() {
        const time = this.getFormattedTime();
        document.getElementById('hours').textContent = time.hours;
        document.getElementById('minutes').textContent = time.minutes;
        document.getElementById('seconds').textContent = time.seconds;
        document.getElementById('milliseconds').textContent = time.milliseconds;
    }

    updateLapsDisplay() {
        const lapsList = document.getElementById('lapsList');
        const lapCount = document.getElementById('lapCount');
        
        lapsList.innerHTML = '';
        lapCount.textContent = this.laps.length;
        
        this.laps.forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${lap.number}`;
            
            const lapTime = document.createElement('span');
            lapTime.className = 'lap-time';
            lapTime.textContent = lap.time.toString();
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTime);
            lapsList.appendChild(lapItem);
        });
    }
}

const stopwatch = new Stopwatch();