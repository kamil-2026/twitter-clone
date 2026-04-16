import { Link } from 'react-router-dom';
import { Feather, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[72px] flex-col items-center p-2 md:w-[275px] md:items-start md:p-4">
      <div className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-3 p-3">
          <svg viewBox="0 0 24 24" className="size-8 fill-[#1DA1F2]" aria-hidden="true">
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
          </svg>
          <span className="hidden text-2xl font-bold md:block">Twitter Clone</span>
        </Link>
        <nav className="flex flex-col gap-2">
          <Link
            to="/"
            className="flex size-[52px] items-center justify-center rounded-full transition duration-200 hover:bg-white/10 md:size-auto md:justify-start md:gap-4 md:px-3 md:py-3"
          >
            <Home size={28} />
            <span className="hidden text-xl md:block">Home</span>
          </Link>
          <Link
            to="/profile"
            className="flex size-[52px] items-center justify-center rounded-full transition duration-200 hover:bg-white/10 md:size-auto md:justify-start md:gap-4 md:px-3 md:py-3"
          >
            <User size={28} />
            <span className="hidden text-xl md:block">Profile</span>
          </Link>
        </nav>
        <Button className="mt-4 hidden w-full cursor-pointer md:flex">Tweet</Button>
        <Button className="mt-4 flex size-[52px] cursor-pointer items-center justify-center rounded-full md:hidden">
          <Feather size={24} />
        </Button>
      </div>
    </aside>
  );
}
