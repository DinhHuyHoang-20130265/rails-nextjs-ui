import { Suspense } from 'react';
import UserEdit from '@/components/UserEdit';
import LoadingSpinner from '@/components/LoadingSpinner';

const EditPage = () => {
  return (
      <div className="w-full h-full bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Suspense fallback={<LoadingSpinner />}>
            <UserEdit />
          </Suspense>
        </div>
      </div>
  );
};

export default EditPage;