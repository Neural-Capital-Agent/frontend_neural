// src/components/PageContainer.jsx
export default function PageContainer({ children }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-6 pb-10">
      {children}
    </div>
  );
}
