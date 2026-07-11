var bodyParser = require('body-parser');
const express = require("express"); 
const cors = require('cors');
const cookieParser = require("cookie-parser");
const admRoute = require('./routes/admin');
const userRoute = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express(); 
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended : true })); // to support URL-encoded bodies

app.use(express.static('assets'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.redirect('/user/index');
});

app.use('/admin', admRoute);
app.use('/user', userRoute);
app.use('/api', apiRouter);

// Start the real-time background charging simulator
const simulator = require('./controllers/simulator');
simulator.startSimulatorLoop();

app.listen(PORT, () => {
    console.log(`ChargeQuest webapp running at http://localhost:${PORT}/`);
});

