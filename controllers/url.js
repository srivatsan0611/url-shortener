import { nanoid } from "nanoid";
import URL from "../models/url.js";


generateNewShortURL = async (req, res) => {

    const body = req.body;
    if (!body) {
        return res.status(400).json({success: true, message: "Bad Request"});
    }
    const shortID = nanoid(6);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: []
    });

    return res.status(200).json({shortId: shortID});
}

export default generateNewShortURL;