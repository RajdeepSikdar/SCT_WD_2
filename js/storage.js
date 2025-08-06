class StopwatchStorage {
    static saveState(stopwatch) {
        const state = {
            elapsedTime: stopwatch.elapsedTime,
            isRunning: stopwatch.isRunning,
            laps: stopwatch.laps,
            timestamp: stopwatch.isRunning ? Date.now() : null
        };
        localStorage.setItem('neonStopwatchState', JSON.stringify(state));
    }

    static loadState(stopwatch) {
        const savedState = localStorage.getItem('neonStopwatchState');
        if (savedState) {
            const state = JSON.parse(savedState);
            
            if (state.isRunning && state.timestamp) {
                const additionalTime = Date.now() - state.timestamp;
                state.elapsedTime += additionalTime;
            }
            
            stopwatch.elapsedTime = state.elapsedTime || 0;
            stopwatch.laps = state.laps || [];
            
            stopwatch.updateDisplay();
            stopwatch.updateLapsDisplay();
            
            if (state.isRunning) {
                document.getElementById('startBtn').classList.add('pulse-animation');
            }
        }
    }
}

// Auto-save every second and before unload
setInterval(() => StopwatchStorage.saveState(stopwatch), 1000);
window.addEventListener('beforeunload', () => StopwatchStorage.saveState(stopwatch));