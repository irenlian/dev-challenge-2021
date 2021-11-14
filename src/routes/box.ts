import Router from 'koa-router';
import { simpleBoxController } from '../controllers/boxController';
import validate from '../middleware/validate';
import { boxSchema } from '../schemas/boxSchema';

const router: Router = new Router();
router.post('/api/simple_box', validate(boxSchema), simpleBoxController);

export default router;
