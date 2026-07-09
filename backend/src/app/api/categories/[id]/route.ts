import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "@/modules/category/category.controller";

export const dynamic = "force-dynamic";

type CategoryRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: Request,
  ctx: CategoryRouteContext,
) {
  const { id } = await ctx.params;

  return getCategory(id);
}

export async function PATCH(
  req: Request,
  ctx: CategoryRouteContext,
) {
  const { id } = await ctx.params;

  return updateCategory(req, id);
}

export async function DELETE(
  _req: Request,
  ctx: CategoryRouteContext,
) {
  const { id } = await ctx.params;

  return deleteCategory(id);
}