let map;
let userMarker;
let stationMarkersGroup;
let routingLine;
let activeUserLoc = { lat: 9.5805097, lng: 76.537262 };
let selectedStation = null;
let activeVehicle = null;
let telemetryInterval = null;

// Icons
const customPlugIcon = L.divIcon({
    html: '<i class="fa-solid fa-charging-station text-primary fs-4 bg-white p-2 border border-primary rounded-circle shadow-lg" style="color: #2563EB !important; border-color: #2563EB !important;"></i>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    className: 'custom-station-icon'
});

const userLocIcon = L.divIcon({
    html: '<i class="fa-solid fa-location-arrow text-success fs-5 bg-white p-2 border border-success rounded-circle shadow-lg pulseGlow" style="color: #22C55E !important; border-color: #22C55E !important;"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    className: 'custom-user-icon'
});

// Setup map
function initMap() {
    map = L.map('map', {
        center: [activeUserLoc.lat, activeUserLoc.lng],
        zoom: 14,
        zoomControl: true
    });

    // Light Matter tile layer (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB'
    }).addTo(map);

    stationMarkersGroup = L.layerGroup().addTo(map);

    // Place user location marker
    userMarker = L.marker([activeUserLoc.lat, activeUserLoc.lng], { icon: userLocIcon }).addTo(map);
    $("#tbLoc").val(JSON.stringify(activeUserLoc));

    // Map click picks location
    map.on('click', function (e) {
        activeUserLoc = e.latlng;
        userMarker.setLatLng(activeUserLoc);
        $("#tbLoc").val(JSON.stringify(activeUserLoc));
        
        // Redraw route if station selected
        if (selectedStation) {
            drawRoute(selectedStation);
        }
    });
}

// Locate button click
$("#btnLocate").click(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            activeUserLoc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setView([activeUserLoc.lat, activeUserLoc.lng], 14);
            userMarker.setLatLng(activeUserLoc);
            $("#tbLoc").val(JSON.stringify(activeUserLoc));
            if (selectedStation) drawRoute(selectedStation);
        }, function () {
            ShowInfoBox('Location Service', 'Could not fetch GPS. Used default location.');
        });
    }
});

// Load user garage/vehicles
function loadVehicles() {
    $.post("/api/alluservehicles").done(function (resp) {
        if (resp.code === 0 && resp.data.length > 0) {
            let html = "";
            resp.data.forEach(v => {
                html += `<option value="${v.vehicle_id}" data-range="${v.vehicle_range}">${v.company} ${v.model} (${v.vehicle_colour})</option>`;
            });
            $("#ddVehicles").html(html);
            // set active vehicle range
            const selectedOpt = $("#ddVehicles option:selected");
            activeVehicle = {
                id: $("#ddVehicles").val(),
                range: parseFloat(selectedOpt.data('range')) || 300
            };
        } else {
            $("#ddVehicles").html('<option value="-1">No vehicles in garage. Add one first!</option>');
        }
    });
}

// ddVehicles change
$("#ddVehicles").change(function () {
    const selectedOpt = $("#ddVehicles option:selected");
    activeVehicle = {
        id: $(this).val(),
        range: parseFloat(selectedOpt.data('range')) || 300
    };
    $("#btnSearch").click();
});

// Load userName
function loadUserName() {
    $.post("/api/getusername").done(function (resp) {
        if (resp.code === 0) {
            $("#lblUserName").text(resp.data);
        }
    });
}

// Search and recommendations
$("#btnSearch").click(function () {
    const vid = $("#ddVehicles").val();
    const loc = $("#tbLoc").val();

    if (vid === "-1" || !vid) {
        $("#recommendationsList").html(`
            <div class="glass-card text-center p-4" style="background: rgba(37, 99, 235, 0.05) !important; border: 1.5px dashed var(--accent-blue) !important; border-radius: 16px;">
                <div class="mb-3">
                    <i class="fa-solid fa-car text-primary" style="font-size: 3rem; color: var(--accent-blue) !important; filter: drop-shadow(0 4px 10px rgba(37,99,235,0.25));"></i>
                </div>
                <h5 class="text-primary fw-bold" style="color: var(--accent-blue) !important;">Welcome to ChargeQuest!</h5>
                <p class="text-muted small mb-3">To find compatible charging terminals, get personalized smart matching scores, and plan trips, please register your EV vehicle first.</p>
                <a href="/user/vehicles" class="btn btn-primary btn-sm w-100">
                    <i class="fa-solid fa-plus me-1"></i> Add Your Vehicle
                </a>
            </div>
        `);
        return;
    }

    $("#recommendationsList").html('<div class="text-center py-4"><i class="fa-solid fa-circle-notch fa-spin fs-3 text-success"></i><p class="mt-2 text-muted">Calculating optimal recommendation scores...</p></div>');

    $.post("/api/search", { vid, loc }).done(function (resp) {
        if (resp.code === 0) {
            const stations = resp.data;
            $("#lblCount").text(`${stations.length} found`);
            
            // Clear old markers
            stationMarkersGroup.clearLayers();

            if (stations.length === 0) {
                $("#recommendationsList").html('<div class="text-center py-4 text-muted"><p>No compatible stations found within 15 km.</p></div>');
                return;
            }

            let listHtml = "";
            stations.forEach((s, idx) => {
                // Add marker to map
                const marker = L.marker([s.chargingstation_lat, s.chargingstation_lng], { icon: customPlugIcon })
                    .bindPopup(`<b>${s.chargingstation_name}</b><br/>Rating: ⭐${s.rating}<br/>Available: ${s.portsSummary.available}/${s.portsSummary.totalPorts}`)
                    .addTo(stationMarkersGroup);

                // Attach click handler on marker
                marker.on('click', function () {
                    focusStation(s);
                });

                // Recommendation Item UI
                const scoreColor = s.recommendationScore >= 80 ? 'bg-success' : (s.recommendationScore >= 50 ? 'bg-warning text-dark' : 'bg-secondary');
                const topMatchClass = idx === 0 ? 'top-match' : '';

                listHtml += `
                    <div class="recommendation-item glass-card p-3 ${topMatchClass} cursor-pointer" onclick="window.focusStationById(${s.chargingstation_id})">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="mb-0 text-white">${s.chargingstation_name}</h6>
                            <span class="score-badge ${scoreColor}">${s.recommendationScore}% Match</span>
                        </div>
                        <div class="row g-2 text-muted small mb-2">
                            <div class="col-6"><i class="fa-solid fa-location-dot me-1"></i> ${s.distance.toFixed(1)} km away</div>
                            <div class="col-6"><i class="fa-solid fa-bolt me-1"></i> ${s.portsSummary.maxPowerKw} kW max</div>
                            <div class="col-6"><i class="fa-solid fa-indian-rupee-sign me-1"></i> ₹${s.priceKwh.toFixed(1)}/kWh</div>
                            <div class="col-6"><i class="fa-solid fa-star me-1 text-warning"></i> ${s.rating} (${s.portsSummary.available} free)</div>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-secondary btn-sm flex-fill p-1" style="font-size:0.75rem;" onclick="event.stopPropagation(); window.showRoutePlanner(${s.chargingstation_id})"><i class="fa-solid fa-route me-1"></i> Route</button>
                            <button class="btn btn-primary btn-sm flex-fill p-1" style="font-size:0.75rem;" onclick="event.stopPropagation(); window.showBooking(${s.chargingstation_id})"><i class="fa-solid fa-calendar-check me-1"></i> Book</button>
                        </div>
                    </div>
                `;
            });

            $("#recommendationsList").html(listHtml);
            window.allLoadedStations = stations;

            if (stations.length > 0) {
                focusStation(stations[0]);
            }
        } else {
            $("#recommendationsList").html(`<div class="text-center py-4 text-danger"><p>Error: ${resp.message}</p></div>`);
        }
    });
});

// Focus Station
function focusStation(station) {
    selectedStation = station;
    map.setView([station.chargingstation_lat, station.chargingstation_lng], 15);
    drawRoute(station);
}

window.focusStationById = function (id) {
    if (window.allLoadedStations) {
        const s = window.allLoadedStations.find(x => x.chargingstation_id == id);
        if (s) focusStation(s);
    }
};

// Draw route polyline using real road-based OSRM routing
function drawRoute(station) {
    if (routingLine) map.removeLayer(routingLine);

    const startLat = activeUserLoc.lat;
    const startLng = activeUserLoc.lng;
    const endLat = station.chargingstation_lat;
    const endLng = station.chargingstation_lng;

    // Call the free OSRM Driving Routing API (returns shortest street route path)
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates; // Array of [lng, lat]
                const pathCoords = coordinates.map(coord => [coord[1], coord[0]]); // Convert to [lat, lng]

                routingLine = L.polyline(pathCoords, {
                    color: '#2563EB', // Electric Blue
                    weight: 6,
                    opacity: 0.85,
                    lineJoin: 'round'
                }).addTo(map);

                // Auto fit bounds to display entire path cleanly
                map.fitBounds(routingLine.getBounds(), { padding: [50, 50] });

                // Update Route Planner sidebar with real road distance & duration
                if (route.distance) {
                    const roadDistKm = route.distance / 1000;
                    const roadTimeMins = Math.round(route.duration / 60);

                    $("#routeDist").text(`${roadDistKm.toFixed(1)} km`);
                    $("#routeTime").text(`${roadTimeMins} mins`);

                    const range = activeVehicle ? activeVehicle.range : 300;
                    const consPercent = Math.round((roadDistKm / range) * 100);
                    $("#routeConsumption").text(`${consPercent}%`);
                }
            } else {
                drawSimulatedFallbackRoute(station);
            }
        })
        .catch(err => {
            console.error('OSRM API Error, using fallback routing:', err);
            drawSimulatedFallbackRoute(station);
        });
}

function drawSimulatedFallbackRoute(station) {
    const midpoint = {
        lat: (activeUserLoc.lat + station.chargingstation_lat) / 2 + (Math.random() - 0.5) * 0.003,
        lng: (activeUserLoc.lng + station.chargingstation_lng) / 2 + (Math.random() - 0.5) * 0.003
    };

    routingLine = L.polyline([
        [activeUserLoc.lat, activeUserLoc.lng],
        [midpoint.lat, midpoint.lng],
        [station.chargingstation_lat, station.chargingstation_lng]
    ], {
        color: '#2563EB',
        weight: 5,
        opacity: 0.8,
        dashArray: '5, 10'
    }).addTo(map);

    map.fitBounds(routingLine.getBounds(), { padding: [50, 50] });
}

// Show Route planner details
window.showRoutePlanner = function (id) {
    const s = window.allLoadedStations.find(x => x.chargingstation_id == id);
    if (!s) return;
    
    selectedStation = s;
    drawRoute(s);

    $("#routePlannerCard").removeClass('d-none');
    $("#routeEnd").val(s.chargingstation_name);
    $("#routeDist").text(`${s.distance.toFixed(1)} km`);
    
    // Estimate: average speed 40km/h => time = distance / 40 * 60 minutes
    const timeMins = Math.round((s.distance / 40) * 60);
    $("#routeTime").text(`${timeMins} mins`);

    // Battery consumption estimation
    const range = activeVehicle ? activeVehicle.range : 300;
    const consPercent = Math.round((s.distance / range) * 100);
    $("#routeConsumption").text(`${consPercent}%`);

    // Weather impact simulation
    const randWeather = Math.random();
    if (randWeather > 0.6) {
        $("#routeWeather").html('<span class="text-warning">High temp (36°C): range -3%</span>');
    } else {
        $("#routeWeather").html('<span class="text-success">Normal Range (30°C)</span>');
    }
};

$("#btnCloseRoutePlanner").click(function () {
    $("#routePlannerCard").addClass('d-none');
    if (routingLine) map.removeLayer(routingLine);
});

// Simulated Navigation Start
$("#btnSimulateRoute").click(function () {
    ShowInfoBox('Route Simulation', 'Navigating to ' + selectedStation.chargingstation_name + '... Simulated vehicle is moving!');
    $("#routePlannerCard").addClass('d-none');
    // Simulated arrival: center user location on the station after a quick interval
    setTimeout(() => {
        activeUserLoc = {
            lat: selectedStation.chargingstation_lat,
            lng: selectedStation.chargingstation_lng
        };
        userMarker.setLatLng(activeUserLoc);
        map.setView([activeUserLoc.lat, activeUserLoc.lng], 15);
        if (routingLine) map.removeLayer(routingLine);
        ShowInfoBox('Destination Reached', 'You have arrived at ' + selectedStation.chargingstation_name + '! Scan QR on the charger port to begin charging.');
        
        // Automatically open booking/telemetry options
        window.showBooking(selectedStation.chargingstation_id);
    }, 4000);
});

// Wallet System
function loadWallet() {
    $.post("/api/getwallet").done(function (resp) {
        if (resp.code === 0) {
            $("#lblWalletBalance").text(`₹${resp.data.balance.toFixed(2)}`);
            
            let txHtml = "";
            if (resp.data.transactions.length > 0) {
                resp.data.transactions.reverse().forEach(tx => {
                    const color = tx.type === 'Deposit' ? 'text-success' : 'text-danger';
                    const sign = tx.type === 'Deposit' ? '+' : '-';
                    txHtml += `
                        <div class="d-flex justify-content-between align-items-center py-1 border-bottom border-secondary" style="font-size:0.75rem;">
                            <div>
                                <div class="text-white">${tx.desc}</div>
                                <div class="text-muted" style="font-size:0.65rem;">${tx.date}</div>
                            </div>
                            <span class="fw-bold ${color}">${sign}₹${tx.amount.toFixed(1)}</span>
                        </div>
                    `;
                });
            } else {
                txHtml = '<div class="text-muted text-center py-2">No transactions</div>';
            }
            $("#walletTransactionsList").html(txHtml);
        }
    });
}

$("#btnRechargeWallet").click(function () {
    const amount = parseFloat($("#tbRechargeAmount").val());
    if (isNaN(amount) || amount <= 0) {
        ShowErrorBox('Invalid Input', 'Please enter a valid deposit amount.');
        return;
    }

    $.post("/api/rechargewallet", { amount }).done(function (resp) {
        if (resp.code === 0) {
            ShowInfoBox('Wallet Recharged', `Successfully deposited ₹${amount}!`);
            loadWallet();
        } else {
            ShowErrorBox('Recharge Failed', resp.message);
        }
    });
});

// Slot Booking
window.showBooking = function (id) {
    const s = window.allLoadedStations.find(x => x.chargingstation_id == id);
    if (!s) return;

    selectedStation = s;
    $("#bookingCard").removeClass('d-none');
    $("#bookingStationInfo").text(s.chargingstation_name);

    // Populate connector ports select
    let portsHtml = "";
    s.ports.forEach(p => {
        portsHtml += `<option value="${p.chargingport_id}">${p.chargingport_name} (${p.chargingport_status})</option>`;
    });
    $("#ddBookingPorts").html(portsHtml);
};

$("#btnCloseBooking").click(function () {
    $("#bookingCard").addClass('d-none');
});

$("#btnConfirmBooking").click(function () {
    const portId = $("#ddBookingPorts").val();
    const portName = $("#ddBookingPorts option:selected").text();
    const dateTime = $("#tbBookingTime").val();

    if (!dateTime) {
        ShowErrorBox('Booking Error', 'Please select a booking date and time.');
        return;
    }

    $.post("/api/addbooking", {
        portId,
        stationName: selectedStation.chargingstation_name,
        portName,
        dateTime
    }).done(function (resp) {
        if (resp.code === 0) {
            ShowInfoBox('Reservation Confirmed', 'Slot booked successfully! Confirm QR when you arrive.');
            $("#bookingCard").addClass('d-none');
            loadBookings();
            
            // Mock dynamic grid update
            $("#btnSearch").click();
        } else {
            ShowErrorBox('Booking Failed', resp.message);
        }
    });
});

function loadBookings() {
    $.post("/api/getbookings").done(function (resp) {
        if (resp.code === 0) {
            let html = "";
            if (resp.data.length > 0) {
                resp.data.reverse().forEach(b => {
                    const statusClass = b.status === 'Booked' ? 'badge bg-success' : 'badge bg-secondary';
                    const cancelBtn = b.status === 'Booked' ? `<button class="btn btn-danger btn-sm py-0 px-2 mt-1" onclick="window.cancelBooking(${b.bookingId})">Cancel</button>` : '';
                    html += `
                        <div class="p-2 border border-secondary rounded" style="font-size:0.75rem; background:rgba(0,0,0,0.15);">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold text-white">${b.stationName}</span>
                                <span class="${statusClass}">${b.status}</span>
                            </div>
                            <div class="text-muted">${b.portName}</div>
                            <div class="text-muted" style="font-size:0.7rem;">Time: ${new Date(b.dateTime).toLocaleString()}</div>
                            <div class="d-flex justify-content-between align-items-center">
                                ${cancelBtn}
                                <button class="btn btn-success btn-sm py-0 px-2 mt-1" onclick="window.triggerQRCharge(${b.portId}, '${b.stationName}', '${b.portName}')">Start Charging</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                html = '<div class="text-muted small text-center py-2">No active reservations</div>';
            }
            $("#userBookingsList").html(html);
        }
    });
}

window.cancelBooking = function (bookingId) {
    $.post("/api/cancelbooking", { bookingId }).done(function (resp) {
        if (resp.code === 0) {
            ShowInfoBox('Reservation Cancelled', 'Your booking was cancelled.');
            loadBookings();
            $("#btnSearch").click();
        } else {
            ShowErrorBox('Cancellation Failed', resp.message);
        }
    });
};

// Start live charging sessions (with mock QR trigger)
window.triggerQRCharge = function (portId, stationName, portName) {
    ShowInfoBox('QR Confirmation', 'Charger plug communication initialized. Connecting to ' + portName + '...');
    
    // Simulate starting session
    $.post("/api/startsession", {
        vehicleId: activeVehicle ? activeVehicle.id : 1,
        portId,
        startPercent: 12 + Math.floor(Math.random() * 15), // Random initial battery %
        targetPercent: 100
    }).done(function (resp) {
        if (resp.code === 0) {
            $("#chargingTelemetryCard").removeClass('d-none');
            loadBookings();
            startTelemetryPolling();
            $("#btnSearch").click();
        } else {
            ShowErrorBox('Charging Error', resp.message);
        }
    });
};

function startTelemetryPolling() {
    if (telemetryInterval) clearInterval(telemetryInterval);
    
    telemetryInterval = setInterval(() => {
        $.post("/api/activesession").done(function (resp) {
            if (resp.code === 0 && resp.data) {
                const s = resp.data;
                $("#sessionBatteryPercent").text(`${s.currentPercent}%`);
                $("#sessionBatteryFill").css('width', `${s.currentPercent}%`);
                $("#sessionVoltage").text(`${s.voltage.toFixed(1)} V`);
                $("#sessionCurrent").text(`${s.currentAmps.toFixed(1)} A`);
                $("#sessionPower").text(`${s.powerKw} kW`);
                $("#sessionEnergy").text(`${s.energyDelivered.toFixed(3)} kWh`);
                $("#sessionCost").text(`₹${s.accumulatedCost.toFixed(2)}`);

                if (s.currentPercent >= s.targetPercent) {
                    clearInterval(telemetryInterval);
                    ShowInfoBox('Charging Complete', 'Your EV is fully charged! Auto shutdown completed.');
                }
            } else {
                clearInterval(telemetryInterval);
                $("#chargingTelemetryCard").addClass('d-none');
            }
        });
    }, 3000);
}

// Check active session on startup
function checkActiveSession() {
    $.post("/api/activesession").done(function (resp) {
        if (resp.code === 0 && resp.data) {
            $("#chargingTelemetryCard").removeClass('d-none');
            startTelemetryPolling();
        }
    });
}

$("#btnEmergencyStop").click(function () {
    $.post("/api/stopsession").done(function (resp) {
        if (resp.code === 0) {
            clearInterval(telemetryInterval);
            $("#chargingTelemetryCard").addClass('d-none');
            
            const r = resp.data;
            ShowInfoBox('Charging Summary', `Session stopped.<br/>Energy Delivered: ${r.session.energyDelivered.toFixed(2)} kWh<br/>Final Bill: ₹${r.finalCost.toFixed(2)}<br/>Deducted from wallet.`);
            
            loadWallet();
            loadBookings();
            $("#btnSearch").click();
        }
    });
});

// Chatbot widget toggles
$("#btnToggleChat").click(function () {
    $("#chatWidget").css('display', 'flex');
    $(this).hide();
});

$("#btnCloseChat").click(function () {
    $("#chatWidget").hide();
    $("#btnToggleChat").show();
});

$("#btnSendChat").click(function () {
    sendMessage();
});

$("#chatInput").keypress(function (e) {
    if (e.which === 13) sendMessage();
});

function sendMessage() {
    const text = $("#chatInput").val().trim();
    if (!text) return;

    $("#chatMessages").append(`<div class="chat-msg user">${text}</div>`);
    $("#chatInput").val("");
    $("#chatMessages").scrollTop($("#chatMessages")[0].scrollHeight);

    // AI logic response
    let response = "I'm sorry, I'm analyzing that query. Can you specify compatible connector standard (e.g. CCS2)?";
    const q = text.toLowerCase();
    
    if (q.includes("nearest") || q.includes("charger") || q.includes("station")) {
        response = "The Kottayam Town Fast Charger is compatible with your Tata Nexon EV Max (CCS2), located just 0.5km away with 2 available slots.";
    } else if (q.includes("compat") || q.includes("connector") || q.includes("nexon")) {
        response = "Your active Tata Nexon EV Max uses a **CCS2** connector standard for DC fast charging, and a **Type 2** connector for AC slow/moderate charging.";
    } else if (q.includes("cost") || q.includes("price") || q.includes("tariff")) {
        response = "Current electricity tariffs on ChargeQuest range between **₹10.5 and ₹16.0 per kWh** depending on the station and peak hours grid loads.";
    } else if (q.includes("battery") || q.includes("range") || q.includes("optimize")) {
        response = "🔋 **EV Battery Tips**: To preserve battery health, charge up to 80% daily, limit DC fast charging on hot days, and avoid letting state-of-charge drop below 10%.";
    } else if (q.includes("sos") || q.includes("emergency") || q.includes("help") || q.includes("low")) {
        response = "🚨 **Emergency Mode**: SOS contacts and roadside assistance (Toll-Free: 1800-419-8888) have been alerted. Navigating to the closest charger at Kottayam Town EV Fast Charger immediately!";
    }

    setTimeout(() => {
        $("#chatMessages").append(`<div class="chat-msg bot">${response}</div>`);
        $("#chatMessages").scrollTop($("#chatMessages")[0].scrollHeight);
    }, 600);
}

// Initialise everything
$(document).ready(function () {
    initMap();
    loadAllStations();
    loadUserName();
    loadVehicles();
    loadWallet();
    loadBookings();
    checkActiveSession();
    
    // Automatically trigger initial search
    setTimeout(() => {
        $("#btnSearch").click();
    }, 1000);
});

// Load all stations globally (used before vehicle selection)
function loadAllStations() {
    $.post("/api/allcs").done(function (resp) {
        if (resp.code === 0 && Array.isArray(resp.data)) {
            // Clear old markers
            stationMarkersGroup.clearLayers();
            
            resp.data.forEach(s => {
                const marker = L.marker([s.chargingstation_lat, s.chargingstation_lng], { icon: customPlugIcon })
                    .bindPopup(`<b>${s.chargingstation_name}</b><br/>Rating: ⭐${s.rating || 4.5}`)
                    .addTo(stationMarkersGroup);

                marker.on('click', function () {
                    focusStation(s);
                });
            });
            window.allLoadedStations = resp.data;
        }
    });
}