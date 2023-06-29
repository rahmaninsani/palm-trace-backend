import dotenv from "dotenv";
import web from "./applications/web.js";
import logger from "./applications/logging.js";

dotenv.config();

const APP_PORT = process.env.APP_PORT || 1001;

web.listen(APP_PORT, () => {
    logger.info(`Server is running on http://localhost:${APP_PORT}`);
});