const express = require('express');
const next = require('next');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');
const hpp = require('hpp');
const xss = require('xss-clean');

// environmental variables 
dotenv.config({ path: `${__dirname}/../.env.local` });

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();


app
  .prepare()
  .then(() => {
    const server = express();

    // show api request info in development
    if (dev) server.use(morgan("combined"));

    // compress response
    server.use(compression());

    // // security 
    server.use(hpp())
    server.use(xss());

    // body parser, cookie parser, urlencoding
    server.use(express.json());
    server.use(cookieParser());
    server.use(express.urlencoded({ extended: true, limit: "10kb" }));

    // api routes
    const routes = ["translate"];

    // handle api requests
    routes.forEach((route) =>
      server.use(`/api/v1/${route}`, require(`${__dirname}/api/v1/routes/${route}`))
    ); 

    // 404 response for api
    server.all(/^\/api\/v1/, (req, res) =>  res.status(404).json({ status: 'failed', message: 'resource not found' }));

    // handle nextJs requests
    server.all("*", (req, res) => handle(req, res));

    //   define port
    const PORT = process.env.PORT || 3000;

    //  start server
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`app running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("shutting down server on error");
    console.log(err);
    process.exit(1);
  });