document.addEventListener('DOMContentLoaded', () => {
    // Mode switching functionality
    const modeButtons = document.querySelectorAll('.mode-btn');
    const timerViews = document.querySelectorAll('.timer-view');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            
            // Update active button
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show correct view
            timerViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${mode}-view`) {
                    view.classList.add('active');
                }
            });
            
            // Reset all timers when switching modes
            stopwatch.reset();
            countdown.reset();
            intervalTimer.stop();
        });
    });

    // Stopwatch controls
    document.getElementById('startBtn').addEventListener('click', () => {
        if (!stopwatch.isRunning) {
            stopwatch.start();
            document.getElementById('startBtn').textContent = 'Pause';
        } else {
            stopwatch.pause();
            document.getElementById('startBtn').textContent = 'Resume';
        }
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
        stopwatch.pause();
        document.getElementById('startBtn').textContent = 'Resume';
    });

    document.getElementById('lapBtn').addEventListener('click', () => {
        stopwatch.lap();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        stopwatch.reset();
        document.getElementById('startBtn').textContent = 'Start';
    });

    // Initialize with stopwatch view active
    document.querySelector('.mode-btn[data-mode="stopwatch"]').click();
});