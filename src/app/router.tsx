import { createBrowserRouter } from 'react-router';
import Layout from '@/components/layout/Layout';
import { paths } from '@/config/paths';
import Main from '@/routes/Main';
import NotFound from '@/routes/NotFound';

// 라우트 정의

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <Main /> },
        {
          path: paths.group,
          lazy: async () => ({ Component: (await import('@/routes/Group')).default }),
        },
        {
          path: paths.repo,
          lazy: async () => ({ Component: (await import('@/routes/Repo')).default }),
        },
        {
          path: paths.post,
          lazy: async () => ({ Component: (await import('@/routes/Post')).default }),
        },
        {
          path: paths.search,
          lazy: async () => ({ Component: (await import('@/routes/Search')).default }),
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') },
);
