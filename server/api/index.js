const { app, server } = require('../index');

// Этот обработчик маршрута необходим для серверных функций Vercel
app.get('/', (req, res) => {
    res.send('OK');
});

// Экспорт `server`, а не `app`, важен для работы Socket.IO
module.exports = server;