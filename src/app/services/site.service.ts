import { injectable } from 'tsyringe';
import { Site } from '../models';

@injectable()
class SiteService {
  constructor() {
  }

  async getAll() {
    return Site.findAll();
  }
}

export default SiteService;