import { Exclude } from 'class-transformer';
import { Request } from 'express';
import { Interface } from 'readline';
import { Url } from 'url';

export class APIresponse {
  public links: LinksType = {};
  @Exclude() // This will prevent 'req' from being serialized
  public req: Request;
  constructor(
    public data: any[],
    public page: number,
    public limit: number,
    public pageCount: number,
    public totalCount: number,
    req: Request,
  ) {
    this.links = {};
    const appUrl = new URL(
      req.originalUrl,
      `${req.protocol}://${req.get('host')}`,
    );
    this.addSelfLink(appUrl);
    if (page >= 1 && page < pageCount) this.addNextLink(appUrl);
    if (page > 1 && page <= pageCount) this.addPrevLink(appUrl);
  }
  addSelfLink(appUrl: URL) {
    if (this.page > 0) appUrl.searchParams.set('page', `${this.page}`);
    if (this.limit > 0) appUrl.searchParams.set('limit', `${this.limit}`);
    this.links.self = appUrl.href;
  }

  addNextLink(appUrl: URL) {
    const afterPage = this.page + 1;
    appUrl.searchParams.set('page', `${afterPage}`);
    this.links.next = appUrl.href;
    appUrl.searchParams.set('page', `${this.pageCount}`);
    this.links.last = appUrl.href;
  }

  addPrevLink(appUrl: URL) {
    const prevPage = this.page - 1;
    appUrl.searchParams.set('page', `${prevPage}`);
    this.links.prev = appUrl.href;
    appUrl.searchParams.set('page', `${1}`);
    this.links.first = appUrl.href;
  }
}

interface LinksType {
  self?: String;
  first?: String;
  last?: String;
  next?: String;
  prev?: String;
}
