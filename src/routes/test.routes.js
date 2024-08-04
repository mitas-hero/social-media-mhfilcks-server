import { Router } from "express";
import { test } from "../controllers/test.controller.js";

export const testRouter = Router()

testRouter.route("/test").get(test)