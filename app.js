require('./config/dotenv');
require('./config/mongoose');
const Server = require('./models/Server');

const server = new Server();
server.listen();
