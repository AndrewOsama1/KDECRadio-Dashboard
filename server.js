const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const initRouter = require('./routes');
const { db } = require('./models/db.model');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const storage = require('./utils/storage');
const expressLayouts = require('express-ejs-layouts')

/** config aws and enviorment variables */
process.env?.NODE_ENV != 'production' && config();

db.sequelize.sync({ alter: false, force: false })

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_URLS.split(' ')

const corsOptionsDelegate = (req, callback) => {
    if (allowedOrigins.indexOf(req.header('Origin')) !== -1)
        callback(null, { ...{ origin: true }, credentials: true })
    else
        callback(null, { ...{ origin: false }, credentials: true })
}

/** config express app */
app.set('view engine', 'ejs');
app.set("views", "views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(cors(corsOptionsDelegate));
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", storage.domain],
                "media-src": ["'self'", storage.domain],
                "script-src": [
                    "'self'",
                    'https://ajax.googleapis.com/ajax/libs/jquery/',
                    'https://www.gstatic.com/firebasejs/',
                    'https://s-usc1b-nss-2136.firebaseio.com',
                    'https://churchapp-3e0d9-default-rtdb.firebaseio.com'
                ],
                "connect-src": ["'self'", 'wss://s-usc1b-nss-2136.firebaseio.com'],
                "frame-src": ["'self'", "https://s-usc1b-nss-2136.firebaseio.com"]
            }
        }
    })
);

app.use(initRouter);

const handleServerListenEvent = () => console.log(`Server is running`);
const handleServerErrorEvent = err => console.error(`Failed to run server at error: \n${err}`);

app.listen(PORT, handleServerListenEvent).on("error", handleServerErrorEvent);
