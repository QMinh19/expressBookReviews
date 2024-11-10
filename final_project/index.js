const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.headers['authorization']; 
    if (!token) {
      return res.status(403).json({ message: "Access Denied, No Token Provided" });
    }
    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
  
    jwt.verify(tokenWithoutBearer, 'your_jwt_secret', (err, user) => {  // Replace 'your_jwt_secret' with your actual secret
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }
      
      // Attach user information to the request object
      req.user = user;
      next();  // Proceed to the next middleware or route handler
    });
  });
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
