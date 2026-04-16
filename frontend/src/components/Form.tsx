interface FormProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Form({ header, children, footer }: FormProps) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[#000000] px-4 pt-[20vh] text-white">
      <div className="flex w-full max-w-[380px] flex-col gap-6">
        {header && <div>{header}</div>}
        <div className="flex flex-col gap-4">{children}</div>
        {footer && <div>{footer}</div>}
      </div>
    </div>
  );
}
