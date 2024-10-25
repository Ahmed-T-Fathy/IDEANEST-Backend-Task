import { Request } from 'express';

export function checkQuery(req: Request): ICheckQuery {
  let page: number = req.query?.page ? +req.query.page : 1;
  let limit: number = req.query.limit ? +req.query.limit : 100;
  let skip: number = 0;
  let filterBy: QueryObject = {};
  let sortBy: SortObject = {};

  if (typeof req.query?.sortBy === 'string') {
    req.query.sortBy.split(',').forEach((field) => {
      const direction = field.startsWith('-') ? -1 : 1; // Use numbers for Mongoose
      const fieldName = field.startsWith('-') ? field.slice(1) : field;
      sortBy[fieldName] = direction;
    });
  }

  if (req.query?.page) {
    skip = (page - 1) * limit;
  }

  return { page, limit, skip, filterBy, sortBy };
}

interface ICheckQuery {
  page: number;
  limit: number;
  skip: number;
  filterBy: QueryObject;
  sortBy: SortObject;
}

type QueryObject = {
  [key: string]:
    | { $regex: string | undefined; $options: string }
    | number
    | string;
};

type SortObject = {
  [key: string]: 1 | -1;
};
