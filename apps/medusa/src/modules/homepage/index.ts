import { Module } from '@medusajs/framework/utils';
import HomepageModuleService from './service';

export const HOMEPAGE_MODULE = 'homepageModuleService';

export default Module(HOMEPAGE_MODULE, {
  service: HomepageModuleService,
});
