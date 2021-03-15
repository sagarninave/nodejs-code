const dotenv = require('dotenv');
dotenv.config();
const port =  process.env.port || 8000;
const http = require("http");
const app = require('./app'); 
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`server running on port http://localhost:${port}`)
});