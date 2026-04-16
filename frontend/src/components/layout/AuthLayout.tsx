interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[#000000] px-4 pt-[20vh] text-white">
      <div className="flex w-full max-w-[380px] flex-col gap-6">{children}</div>
    </div>
  );
}
