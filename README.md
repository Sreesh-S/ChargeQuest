# ChargeQuest 🚗⚡

**ChargeQuest** is a feature-rich charging station finder web application designed to help electric vehicle (EV) users locate, manage, and simulate charging sessions.

🔗 **Live URL:** [https://chargequest-j4v4.onrender.com](https://chargequest-j4v4.onrender.com)

---

### Project Description
**ChargeQuest** is built on a model-view-controller (MVC) architecture using Node.js, Express.js, MySQL, and the Pug template engine. The project provides an end-to-end simulation of an EV charging network, designed for both electric vehicle owners and network administrators.

For drivers, the application offers a secure, user-friendly interface to register accounts, log in, and record their electric vehicles. Once logged in, users can search a comprehensive database of charging stations, check port availability, filter by compatible connector types, and initiate simulated charging sessions for their vehicles.

The core highlight of ChargeQuest is its integrated real-time background charging simulator. Once a user starts a charging session, the backend runs a simulator loop that ticks every few seconds, calculating and dynamically updating key metrics: battery charge percentage, changing voltages, current in amperes, active power delivery (kW), total energy transferred (kWh), and the accumulated tariff cost. To make the ecosystem feel alive, the simulator also runs grid background activity, randomly changing the occupancy and operational status of other network stations, mimicking real-world usage patterns.

For administrative users, the project includes a protected management portal. Administrators have full visibility and control over the platform, with dedicated dashboards to monitor registered users, manage charging stations, inspect individual ports, and modify supported connector types.

---

### Key Features
* 👤 **User Management**: Authentication (via JWT/bcrypt) and user vehicle profile management.
* 📍 **Station Finder**: Discover nearby charging stations, compatible ports, and connector types.
* ⚙️ **Admin Dashboard**: Full portal for administrators to manage stations, ports, connector types, and users.
* ⚡ **Live Session Simulator**: A background simulator loop that models real-time EV charging parameters (current percentage, target charge, battery voltage, active power in kW, energy delivered, and accumulated costs).
* 📡 **Dynamic Grid Activity**: Simulates real-time station availability across the network.

---

### Tech Stack
* **Backend**: Node.js, Express.js
* **Database**: MySQL (relational schema for stations, ports, vehicles, and user accounts)
* **Frontend**: Pug Templating Engine, CSS
