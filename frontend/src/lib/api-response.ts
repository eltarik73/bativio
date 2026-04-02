import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data, timestamp: new Date().toISOString() },
    { status }
  );
}

export function apiError(error: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(code ? { code } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
