import { Router } from "express";
import multer from "multer";

import {
  createService,
  deleteService,
  listServices,
  updateService
} from "../controllers/admin/services.controller.js";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject
} from "../controllers/admin/projects.controller.js";
import {
  createPackage,
  deletePackage,
  listPackages,
  updatePackage
} from "../controllers/admin/packages.controller.js";
import { createOrder, deleteOrder, listOrders, updateOrder } from "../controllers/admin/orders.controller.js";
import {
  createPayment,
  deletePayment,
  listPayments,
  updatePayment
} from "../controllers/admin/payments.controller.js";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense
} from "../controllers/admin/expenses.controller.js";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
  updateCalendarEvent
} from "../controllers/admin/calendar.controller.js";
import { createReviewLink, deleteReview, listReviews, updateReview } from "../controllers/admin/reviews.controller.js";
import { deleteLead, listLeads, updateLead } from "../controllers/admin/leads.controller.js";
import { analyticsSnapshot } from "../controllers/admin/analytics.controller.js";
import { fetchSettings, updateSettings } from "../controllers/admin/settings.controller.js";
import { uploadFile } from "../controllers/admin/uploads.controller.js";
import { authCookieJwt } from "../middlewares/authCookieJwt.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import {
  createServiceSchema,
  updateServiceSchema
} from "../validations/service.schema.js";
import { createProjectSchema, updateProjectSchema } from "../validations/project.schema.js";
import { createPackageSchema, updatePackageSchema } from "../validations/package.schema.js";
import { createOrderSchema, updateOrderSchema } from "../validations/order.schema.js";
import { createPaymentSchema, updatePaymentSchema } from "../validations/payment.schema.js";
import { createExpenseSchema, updateExpenseSchema } from "../validations/expense.schema.js";
import { createCalendarSchema, updateCalendarSchema } from "../validations/calendar.schema.js";
import { updateReviewSchema } from "../validations/review.schema.js";
import { updateLeadSchema } from "../validations/lead.schema.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authCookieJwt);

router.get("/admin/services", listServices);
router.post("/admin/services", validate(createServiceSchema), createService);
router.patch("/admin/services/:id", validate(updateServiceSchema), updateService);
router.delete("/admin/services/:id", deleteService);

router.get("/admin/projects", listProjects);
router.post("/admin/projects", validate(createProjectSchema), createProject);
router.patch("/admin/projects/:id", validate(updateProjectSchema), updateProject);
router.delete("/admin/projects/:id", deleteProject);

router.get("/admin/packages", listPackages);
router.post("/admin/packages", validate(createPackageSchema), createPackage);
router.patch("/admin/packages/:id", validate(updatePackageSchema), updatePackage);
router.delete("/admin/packages/:id", deletePackage);

router.get("/admin/orders", listOrders);
router.post("/admin/orders", validate(createOrderSchema), createOrder);
router.patch("/admin/orders/:id", validate(updateOrderSchema), updateOrder);
router.delete("/admin/orders/:id", deleteOrder);

router.get("/admin/payments", listPayments);
router.post("/admin/payments", validate(createPaymentSchema), createPayment);
router.patch("/admin/payments/:id", validate(updatePaymentSchema), updatePayment);
router.delete("/admin/payments/:id", deletePayment);

router.get("/admin/expenses", listExpenses);
router.post("/admin/expenses", validate(createExpenseSchema), createExpense);
router.patch("/admin/expenses/:id", validate(updateExpenseSchema), updateExpense);
router.delete("/admin/expenses/:id", deleteExpense);

router.get("/admin/calendar", listCalendarEvents);
router.post("/admin/calendar", validate(createCalendarSchema), createCalendarEvent);
router.patch("/admin/calendar/:id", validate(updateCalendarSchema), updateCalendarEvent);
router.delete("/admin/calendar/:id", deleteCalendarEvent);

router.get("/admin/reviews", listReviews);
router.patch("/admin/reviews/:id", validate(updateReviewSchema), updateReview);
router.delete("/admin/reviews/:id", deleteReview);
router.post("/admin/review-links", createReviewLink);

router.get("/admin/leads", listLeads);
router.patch("/admin/leads/:id", validate(updateLeadSchema), updateLead);
router.delete("/admin/leads/:id", deleteLead);

router.get("/admin/analytics", rbac(["admin"]), analyticsSnapshot);
router.get("/admin/settings", rbac(["admin"]), fetchSettings);
router.patch("/admin/settings", rbac(["admin"]), updateSettings);

router.post("/admin/uploads", upload.single("file"), uploadFile);

export default router;
