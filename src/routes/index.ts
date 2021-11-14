import Koa from 'koa';
import status from './status';
import box from './box';

export default (app: Koa) => {
    app.use(status.routes());
    app.use(box.routes());
};
