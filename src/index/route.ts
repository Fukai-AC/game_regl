import * as React from 'react';
import { RouteProps } from 'react-router-dom';
import * as Loadable from 'react-loadable';
import { Loading } from './routes/loading';

let _loadable = (load_func:any) => {
  return Loadable({
    loader: () => load_func,
    loading: Loading,
  });
};

export let routes:RouteProps[] = [
  {
    path: '/gl',
    exact: true,
    component: _loadable(import('./routes/gl')),
  },
  {
    path: '/gl/transition',
    component: _loadable(import('./routes/gl/transition')),
  },
  {
    path: '/ide',
    component: _loadable(import('./routes/ide')),
  },
  {
    path: '/t',
    component: _loadable(import('./routes/template')),
  },
  {
    component: _loadable(import('./routes/404')),
  },
];