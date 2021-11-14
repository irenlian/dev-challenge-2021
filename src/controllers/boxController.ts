import Koa from 'koa';

export const simpleBoxController = async (ctx: Koa.Context) => {
    ctx.status = 200;
    ctx.body = 'simpleBoxController';
};
