import { PORT } from './config';
import app from './app';

app.listen(PORT);
console.log(`Started on port ${PORT}`)
