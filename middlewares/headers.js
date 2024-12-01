const corsHeaders = (req, res, next) => {
  console.log(`CORS Middleware: ${req.method} request to ${req.url}`);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
      return res.sendStatus(200);
  }

  next();
};

module.exports = corsHeaders;
