const mysql = require('mysql2/promise');
const dbconfig = require('../models/dbconfig');
const cportModel = require('../models/cports');

// In-memory active charging sessions
// Keyed by userId
const activeSessions = new Map();

// Session structure:
// {
//   userId,
//   vehicleId,
//   portId,
//   stationId,
//   startPercent: 10,
//   currentPercent: 10,
//   targetPercent: 100,
//   voltage: 380,
//   currentAmps: 0,
//   powerKw: 50, // based on port/charger type
//   energyDelivered: 0,
//   elapsedSeconds: 0,
//   totalDurationSeconds: 1800, // 30 minutes
//   tariffRate: 15, // INR per kWh
//   accumulatedCost: 0,
//   startTime: Date.now()
// }

// Start a simulated charging session
function startSession(userId, vehicleId, portId, startPercent = 10, targetPercent = 100) {
    if (activeSessions.has(userId)) {
        return activeSessions.get(userId);
    }

    // Default power rating based on mock descriptions (e.g. 50kW)
    const powerKw = 50;
    const tariffRate = 12.5; // INR per kWh
    
    // Estimate total time based on 50kW charger charging a 40kWh battery from 10% to 100%
    // Charging required = 90% of 40kWh = 36kWh
    // Time = 36kWh / 50kW = 0.72 hours = 43 minutes (~2580 seconds)
    // To make simulation fun and fast, we scale time: 1 real second = 1% battery charge
    const totalDurationSeconds = (targetPercent - startPercent);

    const session = {
        userId,
        vehicleId,
        portId,
        startPercent: parseInt(startPercent) || 10,
        currentPercent: parseInt(startPercent) || 10,
        targetPercent: parseInt(targetPercent) || 100,
        voltage: 390 + Math.random() * 20, // 390V - 410V
        currentAmps: 120 + Math.random() * 10, // 120A - 130A
        powerKw,
        energyDelivered: 0,
        elapsedSeconds: 0,
        totalDurationSeconds,
        tariffRate,
        accumulatedCost: 0,
        startTime: Date.now()
    };

    activeSessions.set(userId, session);

    // Update port status to Occupied in the database
    cportModel.updateStatus(portId, 'Occupied').catch(err => {
        console.error('Failed to set port to Occupied in simulator:', err);
    });

    return session;
}

// Stop session
async function stopSession(userId) {
    const session = activeSessions.get(userId);
    if (!session) return null;

    activeSessions.delete(userId);

    // Update port status back to Active (Available) in database
    await cportModel.updateStatus(session.portId, 'Active').catch(err => {
        console.error('Failed to reset port to Active in simulator:', err);
    });

    return session;
}

// Get active session
function getSession(userId) {
    return activeSessions.get(userId);
}

// Tick all active sessions (runs every 3 seconds)
function tickSessions() {
    for (const [userId, session] of activeSessions.entries()) {
        session.elapsedSeconds += 3;
        
        // Scale: 1 tick (3 seconds) adds ~2% of charge
        const chargeRatePerTick = 2;
        session.currentPercent = Math.min(session.targetPercent, session.currentPercent + chargeRatePerTick);

        // Calculate energy delivered: Power (kW) * Hours
        // 3 seconds is 3/3600 of an hour
        const energyAdded = (session.powerKw * 3) / 3600;
        session.energyDelivered += energyAdded;
        session.accumulatedCost = session.energyDelivered * session.tariffRate;

        // Fluctuating voltage and current
        session.voltage = Math.round((395 + Math.random() * 10) * 10) / 10;
        session.currentAmps = Math.round((session.powerKw * 1000 / session.voltage) * 10) / 10;

        // If completed target charge, auto stop or hold
        if (session.currentPercent >= session.targetPercent) {
            // keep session but stop adding battery
            session.currentAmps = 0;
            session.voltage = 0;
        }
    }
}

// Randomly simulate other chargers in the database changing states
async function simulateGridActivity() {
    try {
        const dbcfg = new dbconfig();
        const connection = await mysql.createConnection({
            user: dbcfg.user,
            password: dbcfg.password,
            database: dbcfg.schema,
            host: dbcfg.host
        });

        // Get all ports
        const [ports] = await connection.query("SELECT * FROM tbl_chargingports;");
        if (ports.length === 0) {
            await connection.end();
            return;
        }

        // Active session ports should not be randomized
        const busyPortIds = Array.from(activeSessions.values()).map(s => s.portId);

        // Pick 1 random port to change status (if not busy with user session)
        const eligiblePorts = ports.filter(p => !busyPortIds.includes(p.chargingport_id));
        if (eligiblePorts.length > 0) {
            const randomPort = eligiblePorts[Math.floor(Math.random() * eligiblePorts.length)];
            const statuses = ['Active', 'Active', 'Inactive', 'Occupied', 'Reserved'];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            await connection.execute("UPDATE `tbl_chargingports` SET `chargingport_status` = ? WHERE `chargingport_id` = ?;", [newStatus, randomPort.chargingport_id]);
        }

        await connection.end();
    } catch (err) {
        console.error('Simulator grid activity error:', err);
    }
}

// Initialize simulator loop
function startSimulatorLoop() {
    setInterval(() => {
        tickSessions();
    }, 3000);

    setInterval(() => {
        simulateGridActivity();
    }, 10000); // randomize grid status every 10 seconds
}

module.exports = {
    startSession,
    stopSession,
    getSession,
    startSimulatorLoop
};
