import express from "express";
import router from "./routes/url.js";
import connectToMongoDB from "./connect.js";

const app = express();
const PORT = 5000;



app.use(express.json());

app.use('/url', router);

app.listen(PORT, () => {
    console.log(`Server started at https://localhost:${PORT}`);
});

