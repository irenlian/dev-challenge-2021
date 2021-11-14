import Router from 'koa-router';
import { status } from '../controllers/statusController';

const router: Router = new Router();
router.get('/api/v1/status', status);

export default router;
