import { Router } from "express"; // Import router from express.

const router: Router = Router(); // Assign router method.

/**
 *
 * ROUTE
 *
 * */

import { index } from "../controller/dataController";

// index route.
router.get("/", index);

export default router;
