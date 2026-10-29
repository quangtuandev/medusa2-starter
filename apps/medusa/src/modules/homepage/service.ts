import { MedusaService } from '@medusajs/framework/utils';
import { BestSellerSection, HeroBanner } from './models';

class HomepageModuleService extends MedusaService({
  HeroBanner,
  BestSellerSection,
}) {}

export default HomepageModuleService;
