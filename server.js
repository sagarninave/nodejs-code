const dotenv = require('dotenv');
dotenv.config();
const port =  process.env.PORT || 8000;
const http = require("http");
const app = require('./src/app'); 
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`server running on port http://localhost:${port}`)
});