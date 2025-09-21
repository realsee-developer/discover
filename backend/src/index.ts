// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: any) {
    // 1) 确保 Public 角色可读取 home-page 与 global
    try {
      const roleSvc = strapi.service('plugin::users-permissions.role');
      const publicRole = await roleSvc.findOne(1);
      const perms = publicRole?.permissions || {};
      perms['api::home-page'] = perms['api::home-page'] || { controllers: { 'home-page': { find: { enabled: true } } } };
      perms['api::home-page'].controllers = perms['api::home-page'].controllers || {};
      perms['api::home-page'].controllers['home-page'] = perms['api::home-page'].controllers['home-page'] || {};
      perms['api::home-page'].controllers['home-page'].find = { enabled: true };

      perms['api::global'] = perms['api::global'] || { controllers: { global: { find: { enabled: true } } } };
      perms['api::global'].controllers = perms['api::global'].controllers || {};
      perms['api::global'].controllers['global'] = perms['api::global'].controllers['global'] || {};
      perms['api::global'].controllers['global'].find = { enabled: true };
      await roleSvc.updateRole(1, { permissions: perms });
    } catch (e) {
      strapi.log.warn('Failed to ensure public role permission for home-page/global');
    }

    // 2) 确保 Home Page 至少有一条数据
    try {
      const existing = await strapi.entityService.findMany('api::home-page.home-page', { limit: 1 });
      if (!existing || existing.length === 0) {
        await strapi.entityService.create('api::home-page.home-page', {
          data: {
            title: 'Home Page',
            description: 'Initial Home Page content',
            blocks: [],
            publishedAt: new Date().toISOString(),
          },
        });
      }
    } catch (e) {
      strapi.log.warn('Failed to seed initial Home Page');
    }

    // 3) 确保 Global 单例存在
    try {
      const existingGlobal = await strapi.entityService.findMany('api::global.global', { limit: 1, populate: { header: true, footer: true } });
      if (!existingGlobal || existingGlobal.length === 0) {
        await strapi.entityService.create('api::global.global', {
          data: {
            title: 'Discover',
            description: 'Discover App',
            header: {
              logoText: { href: '/', label: 'Discover', isExternal: false },
              ctaButton: { href: '/', label: 'Get Started', isExternal: false },
            },
            footer: {
              logoText: { href: '/', label: 'Discover', isExternal: false },
              text: 'Thanks for visiting.',
              socialLink: [
                { href: 'https://github.com/', label: 'GitHub', isExternal: true }
              ]
            },
            publishedAt: new Date().toISOString(),
          },
        });
      }
    } catch (e) {
      strapi.log.warn('Failed to seed initial Global');
    }
  },
};
