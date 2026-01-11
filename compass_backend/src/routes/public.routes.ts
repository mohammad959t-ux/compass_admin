import { Router } from "express";

import { createLead } from "../controllers/public/leads.controller.js";
import { listPackages, getPackageBySlug } from "../controllers/public/packages.controller.js";
import { listProjects, getProjectBySlug } from "../controllers/public/projects.controller.js";
import { listApprovedReviews } from "../controllers/public/reviews.controller.js";
import { listServiceCategoryCovers } from "../controllers/public/serviceCategories.controller.js";
import { listServices, getServiceBySlug } from "../controllers/public/services.controller.js";
import { validate } from "../middlewares/validate.js";
import { createLeadSchema } from "../validations/lead.schema.js";

const router = Router();

router.get("/services", listServices);
router.get("/services/:slug", getServiceBySlug);
router.get("/projects", listProjects);
router.get("/projects/:slug", getProjectBySlug);
router.get("/packages", listPackages);
router.get("/packages/:slug", getPackageBySlug);
router.get("/reviews", listApprovedReviews);
router.get("/service-categories", listServiceCategoryCovers);
router.post("/leads", validate(createLeadSchema), createLead);

export default router;
