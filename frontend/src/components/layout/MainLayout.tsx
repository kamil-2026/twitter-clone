import Sidebar from '@/components/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-black text-white">
      <div className="flex w-full max-w-[1200px]">
        <Sidebar />
        <main className="min-h-screen w-full max-w-[600px] border-x border-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
