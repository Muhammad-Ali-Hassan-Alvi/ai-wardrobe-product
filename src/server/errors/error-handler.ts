import { NextResponse } from "next/server";
import { isAppError } from "./app-error";

export function handleApiError(error: unknown) {
  if (isAppError(error)) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode },
    );
  }

  console.error("[API Error]", error);

  return NextResponse.json(
    {
      error: {
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      },
    },
    { status: 500 },
  );
}
