import express from "express";
import router from "./routes/url.js";
import connectToMongoDB from "./connect.js";
import URL from "./models/url.js";

const app = express();
const PORT = 5000;



app.use(express.json());

app.use('/url', router);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId }
        , {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );
    res.redirect(entry.redirectURL);

});

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server started at http://localhost:${PORT}`);
});

