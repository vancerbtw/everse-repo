import express from "express";
import next from "next";
import bodyParser from "body-parser";


const app = express();
const dev = process.env.NODE_ENV === "development";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

nextApp.prepare().then(async () => {
    app.get('*', (req, res) => {
        return handle(req, res);
    });

    app.listen(process.env.PORT || 3001, () => {
        console.log(`Listening on localhost:${process.env.PORT || 3001}`)
    });
});
