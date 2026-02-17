import type { Response } from "express";

export interface IApiResponse<T> {
  data: T | [];
  message: string;
  statusCode: number;
  errors: string[];
}

export const genericResponse = <T>(
  data: T,
  message: string,
  statusCode: number,
  errors: string[]
): IApiResponse<T> => {
  return {
    data,
    message,
    statusCode,
    errors
  };
};

export function genericResponseControllerUtil(data: IApiResponse<unknown>, res: Response) {
  if (!data.data) {
    data.data = [];
  }

  if (!data.errors) {
    data.errors = [];
  }

  if (!data.message) {
    data.message = "";
  }

  res.status(data.statusCode).send(data);
}