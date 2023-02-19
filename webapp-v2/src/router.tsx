import { createBrowserRouter } from 'react-router-dom';

import routes from './routes';

const router = createBrowserRouter(routes, {
  basename: import.meta.env.VITE_APP_BASE_PATH
});

export default router;
