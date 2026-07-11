// Chart.js instances
let demandChart;
let statusChart;

function initCharts() {
    // 1. Grid Demand Line Chart
    const demandCtx = document.getElementById('demandChart').getContext('2d');
    demandChart = new Chart(demandCtx, {
        type: 'line',
        data: {
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [
                {
                    label: 'Solar Charging Output (kWh)',
                    data: [12, 35, 68, 80, 72, 45, 10, 0],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Grid Consumption (kWh)',
                    data: [25, 48, 55, 60, 58, 70, 92, 64],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#0F172A' }
                }
            },
            scales: {
                x: {
                    grid: { color: '#E2E8F0' },
                    ticks: { color: '#475569' }
                },
                y: {
                    grid: { color: '#E2E8F0' },
                    ticks: { color: '#475569' }
                }
            }
        }
    });

    // 2. Port Status Distribution
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'Occupied', 'Reserved', 'Offline'],
            datasets: [{
                data: [4, 3, 2, 1],
                backgroundColor: ['#22C55E', '#F97316', '#FACC15', '#94A3B8'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#0F172A' }
                }
            }
        }
    });
}

function fetchStats() {
    // Query list of stations
    $.post("/api/allcs").done(function (resp) {
        if (resp.code === 0 && Array.isArray(resp.data)) {
            $("#valStations").text(resp.data.length);
            
            // Deduce some values for port distribution chart
            let available = 0, occupied = 0, reserved = 0, offline = 0;
            resp.data.forEach((s, idx) => {
                // Mock port states deterministically based on index for rendering
                if (idx % 3 === 0) available += 2;
                else if (idx % 3 === 1) { occupied += 1; reserved += 1; }
                else { available += 1; offline += 1; }
            });

            if (statusChart) {
                statusChart.data.datasets[0].data = [available, occupied, reserved, offline];
                statusChart.update();
            }
        }
    });

    // Query active session metrics or mock dashboard updates
    setInterval(() => {
        // Mock fluctuations in Grid load and revenue
        const load = 150 + Math.round(Math.random() * 40);
        $("#valLoad").text(`${load} kW`);
        
        const currentRev = 12480 + Math.round(Math.random() * 120);
        $("#valRevenue").text(`₹${currentRev.toLocaleString()}`);
    }, 4000);
}

// Fetch user count
function fetchUsersCount() {
    // Retrieve users list by reading backend or using fallback
    // The admin index view parameters contain 'resp' message
    // We can count users count
    $.get("/admin/users").done(function (html) {
        // Parse user list table length from returned html
        const tempDiv = $('<div>').append($.parseHTML(html));
        const count = tempDiv.find('#tblUserList tbody tr').length;
        if (count > 0) {
            $("#valUsers").text(count);
        } else {
            $("#valUsers").text("2"); // Fallback seed count
        }
    });
}

$(document).ready(function () {
    initCharts();
    fetchStats();
    fetchUsersCount();
});
