import {
  createCategory,
  getCategories,
} from "@/modules/category/category.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getCategories();
}

export async function POST(req: Request) {
  return createCategory(req);
}