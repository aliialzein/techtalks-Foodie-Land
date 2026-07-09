import type { NextRequest } from "next/server";

import logger from "@/util/logger";
import { handleError, jsonResponse } from "@/util/errors";

import { CategoryService } from "./category.service";

import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

export async function getCategories() {
  try {
    logger.info("GET /categories");

    const data = await CategoryService.getAll();

    return jsonResponse(data, 200);
  } catch (error) {
    logger.error(error);

    return handleError(error);
  }
}

export async function getCategory(id: string) {
  try {
    logger.info("GET /categories/%s", id);

    const parsedId = categoryIdSchema.parse(id);

    const data = await CategoryService.getById(parsedId);

    return jsonResponse(data, 200);
  } catch (error) {
    logger.error(error);

    return handleError(error);
  }
}

export async function createCategory(
  req: NextRequest | Request,
) {
  try {
    logger.info("POST /categories");

    const body: unknown = await req.json();

    const payload = createCategorySchema.parse(body);

    const data = await CategoryService.create(payload);

    return jsonResponse(data, 201);
  } catch (error) {
    logger.error(error);

    return handleError(error);
  }
}

export async function updateCategory(
  req: NextRequest | Request,
  id: string,
) {
  try {
    logger.info("PATCH /categories/%s", id);

    const parsedId = categoryIdSchema.parse(id);

    const body: unknown = await req.json();

    const payload = updateCategorySchema.parse(body);

    const data = await CategoryService.update(
      parsedId,
      payload,
    );

    return jsonResponse(data, 200);
  } catch (error) {
    logger.error(error);

    return handleError(error);
  }
}

export async function deleteCategory(id: string) {
  try {
    logger.info("DELETE /categories/%s", id);

    const parsedId = categoryIdSchema.parse(id);

    await CategoryService.delete(parsedId);

    return jsonResponse(
      {
        message: "Deleted",
      },
      200,
    );
  } catch (error) {
    logger.error(error);

    return handleError(error);
  }
}