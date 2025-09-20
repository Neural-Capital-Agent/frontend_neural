import React from 'react';
import MacroInfo from '../components/MacroInfo';
import PageContainer from '../components/PageContainer';

const MacroInfoPage = () => {
  return (
    <PageContainer>
      <div className="space-y-6">
        <MacroInfo />
      </div>
    </PageContainer>
  );
};

export default MacroInfoPage;