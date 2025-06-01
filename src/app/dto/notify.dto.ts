import { PageParams } from './paging.dto';

export interface NotifyFilter extends PageParams {
  type?: string;
}