import type { UploadSlot } from "@/generated/prisma/client";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getErrorMessage } from "@/shared/utils/error-message";
import { getSessionUserId } from "@/lib/session/get-session-user";
import { StudioService } from "@/server/services/studio.service";

const SLOT_MAP: Record<string, UploadSlot> = {
  userPhoto: "USER_PHOTO",
  dress: "DRESS",
  bottoms: "BOTTOMS",
  shoes: "SHOES",
  accessories: "ACCESSORIES",
};

export async function GET() {
  try {
    const userId = await getSessionUserId();
    const studio = StudioService.create();
    const uploads = await studio.listUploads(userId);
    return apiSuccess({ uploads });
  } catch (error) {
    return apiError(getErrorMessage(error, "Failed to list uploads"), 500);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    const formData = await request.formData();
    const file = formData.get("file");
    const slotKey = formData.get("slot");

    if (!(file instanceof File) || typeof slotKey !== "string") {
      return apiError("Missing file or slot");
    }

    const slot = SLOT_MAP[slotKey];
    if (!slot && slotKey !== "auto") return apiError("Invalid slot");

    const buffer = Buffer.from(await file.arrayBuffer());
    const studio = StudioService.create();

    if (slotKey === "auto") {
      const upload = await studio.uploadGarmentWithAi(
        userId,
        buffer,
        file.type || "image/jpeg",
      );
      return apiSuccess({ upload });
    }

    const upload = await studio.uploadImage(
      userId,
      slot,
      buffer,
      file.type || "image/jpeg",
    );

    return apiSuccess({ upload });
  } catch (error) {
    return apiError(getErrorMessage(error, "Upload failed"), 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getSessionUserId();
    const { searchParams } = new URL(request.url);
    const slotKey = searchParams.get("slot");
    if (!slotKey) return apiError("Missing slot");

    const slot = SLOT_MAP[slotKey];
    if (!slot) return apiError("Invalid slot");

    const studio = StudioService.create();
    await studio.removeUpload(userId, slot);
    return apiSuccess({ removed: true });
  } catch (error) {
    return apiError(getErrorMessage(error, "Delete failed"), 500);
  }
}
