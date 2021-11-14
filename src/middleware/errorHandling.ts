import Koa from 'koa';
import { get } from 'lodash';

export default async (ctx: Koa.Context, next: Function): Promise<void> => {
    try {
        await next();
    } catch (error) {
        if (error.status === 401) {
            console.log(`Error trying to call ${ctx.request.url}`);
            console.log('401 Unauthorized');
            ctx.status = 401;
            ctx.body = {
                message: error.originalError ? error.originalError.message : error.message,
                status: 401,
            };

            return;
        }

        if (error && error.response) {
            const { status, data } = error.response;

            ctx.status = status || 503;
            ctx.body = {
                message: data,
                status: status || 503,
            };

            console.error(`Error trying to call ${ctx.request.url}`);
            return;
        }

        if (error) {
            const code = error.statusCode || error.status || 500;
            const message = get(error, 'message', 'Unknown error');

            ctx.status = code;
            ctx.body = {
                message,
                status: code,
            };

            if (code >= 500) {
                console.log(`Error trying to call ${ctx.request.url}`);
                console.log(`Caught Error: ${message}`);
            } else {
                console.log(`Error trying to call ${ctx.request.url}`);
                console.log(`Caught Error: ${message}`);
            }
        }
    }
};
