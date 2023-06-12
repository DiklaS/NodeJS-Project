const morgan = require('morgan');
const chalk = require('chalk');

const logger = morgan((tokens, req, res) => {
    let logArray = [
        tokens.date(req, res, 'clf'),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens["response-time"](req, res),
        "ms"
    ];
    if (res.statusCode >= 400) {
        console.log(chalk.redBright(logArray.join(" ")));
    } else {
        console.log(chalk.greenBright(logArray.join(" ")));
    }
});

module.exports = logger;
