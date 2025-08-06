class Analytics {
    constructor() {
        this.sessions = [];
        this.loadSessions();
    }

    addSession(session) {
        this.sessions.unshift(session);
        this.saveSessions();
    }

    getSessionStats() {
        if (this.sessions.length === 0) return null;
        
        const stats = {
            totalSessions: this.sessions.length,
            totalTime: 0,
            avgSessionTime: 0,
            fastestLap: Infinity,
            slowestLap: 0,
            lapCount: 0,
            sessionsByDay: {},
            sessionsByHour: Array(24).fill(0)
        };
        
        this.sessions.forEach(session => {
            stats.totalTime += session.totalTime;
            stats.lapCount += session.laps.length;
            
            if (session.laps.length > 0) {
                const sessionFastest = Math.min(...session.laps.map(lap => lap.duration));
                if (sessionFastest < stats.fastestLap) stats.fastestLap = sessionFastest;
                
                const sessionSlowest = Math.max(...session.laps.map(lap => lap.duration));
                if (sessionSlowest > stats.slowestLap) stats.slowestLap = sessionSlowest;
            }
            
            const date = new Date(session.timestamp);
            const day = date.toLocaleDateString();
            const hour = date.getHours();
            
            stats.sessionsByDay[day] = (stats.sessionsByDay[day] || 0) + 1;
            stats.sessionsByHour[hour]++;
        });
        
        stats.avgSessionTime = stats.totalTime / this.sessions.length;
        
        return stats;
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showSessionAnalytics(session) {
        document.getElementById('avg-lap').textContent = this.formatTime(session.avgLap);
        document.getElementById('fastest-lap').textContent = this.formatTime(session.fastestLap);
        document.getElementById('total-time').textContent = this.formatTime(session.totalTime);
        
        this.renderLapsChart(session.lapTimes);
    }

    renderLapsChart(lapTimes) {
        const ctx = document.getElementById('laps-chart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: lapTimes.map((_, i) => `Lap ${i + 1}`),
                datasets: [{
                    label: 'Lap Time (seconds)',
                    data: lapTimes.map(time => time / 1000),
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Seconds'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Lap Number'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const minutes = Math.floor(value / 60);
                                const seconds = Math.floor(value % 60);
                                const ms = Math.floor((value % 1) * 1000);
                                return `${minutes > 0 ? minutes + 'm ' : ''}${seconds}s ${ms}ms`;
                            }
                        }
                    }
                }
            }
        });
    }

    saveSessions() {
        localStorage.setItem('stopwatchSessions', JSON.stringify(this.sessions));
    }

    loadSessions() {
        const savedSessions = localStorage.getItem('stopwatchSessions');
        if (savedSessions) {
            this.sessions = JSON.parse(savedSessions);
        }
    }
}

const analytics = new Analytics();

// Initialize analytics modal
document.addEventListener('DOMContentLoaded', () => {
    const analyticsModal = document.getElementById('analytics-modal');
    
    document.getElementById('analyticsBtn').addEventListener('click', () => {
        const stats = stopwatch.getStats();
        if (stats) {
            analytics.showSessionAnalytics(stats);
        }
        analyticsModal.classList.add('active');
    });
    
    document.querySelector('#analytics-modal .modal-close').addEventListener('click', () => {
        analyticsModal.classList.remove('active');
    });
});