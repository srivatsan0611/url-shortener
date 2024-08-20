import express from "express";
import generateNewShortURL from "../controllers/url.js";


const router = express.Router();

router.post('/', generateNewShortURL);

export default router;
