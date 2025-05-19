const express = require('express'); 
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const webRoutes = require('./routes/queueRoutes');
app.use('/', webRoutes);

const apiRoutes = require('./routes/apiQueueRoutes');
app.use('/api', apiRoutes);
app.listen(3000, () => console.log('Сервер запущено на порту 3000'));