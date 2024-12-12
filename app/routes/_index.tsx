import type { MetaFunction } from '@remix-run/node';
import CanvasWrapper from '~/components/CanvasWrapper';
import Toolbar from '~/components/Toolbar';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  return (
    <div className='bg-gray-50'>
      <div className='min-h-screen max-w-7xl mx-auto pt-24 px-12 flex gap-8'>
        <Toolbar />
        <CanvasWrapper />
        <div className='p-2 bg-gray-50'>Settings</div>
      </div>
    </div>
  );
}
