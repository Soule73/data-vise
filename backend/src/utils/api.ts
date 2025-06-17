import { ApiResponse } from "@/types/api";
import { Response } from "express";

export function handleServiceResult<T>(
  res: Response,
  result: ApiResponse<T>,
  successStatus = 200
) {
  if ("error" in result) return res.status(result.status || 400).json(result);
  return res.status(successStatus).json({ data: result.data });
}
