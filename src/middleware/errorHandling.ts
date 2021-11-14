import Koa from 'koa';

export default async (ctx: Koa.Context, next: Function): Promise<void> => {
    try {
        await next();
    } catch (error) {
        const { statusCode, message = 'Unknown error' } = error || {};
        const code = statusCode || error.status || 500;

        ctx.status = code;
        try {
            JSON.parse(message);
            ctx.type = 'json';
            ctx.body = message;
        } catch {
            ctx.body = {
                message,
                status: code,
            };
        }

        if (code >= 500) {
            console.log(`Error trying to call ${ctx.request.url}`);
            console.log(`Caught Error: ${message}`);
        } else {
            console.log(`Error trying to call ${ctx.request.url}`);
            console.log(`Caught Error: ${message}`);
        }
    }
};
