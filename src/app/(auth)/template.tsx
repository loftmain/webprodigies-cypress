import React, { Suspense } from "react";

interface TemplateProps {
  children: React.ReactNode;
}

const Template = ({ children }: TemplateProps) => {
  return (
    <div className="h-screen p-6 flex justify-center">
      {/* useSearchParams() should be wrapped in a suspense boundary at page "/signup". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
      <Suspense>{children}</Suspense>
    </div>
  );
};

export default Template;
