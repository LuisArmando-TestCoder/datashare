const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const entries = {};

router.get('/newer-entries/:amount', (req, res) => {
    const { amount } = req.params;
    const newerEntries = Object.keys(entries)
        .map(key => ({ title: key, entry: entries[key] }))
        .splice(0, amount);
    res.json({ success: true, data: newerEntries });
});

router.get('/entry/:title', (req, res) => {
    const { title } = req.params;
    res.json({ success: true, data: entries[title] });
});

router.post('/entry', (req, res) => {
    const { title, entry } = req.body;
    if (entries[title]) return res.json({ success: false, message: 'There is an entry with that title already' });
    entries[title] = entry;
    return res.json({ success: true, message: `${title} has been successfully added to entries` });
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.use(express.urlencoded({ extended: false }));
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);