'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabaseSafe, isSupabaseConfigured } from '@/lib/supabase';
import { HeartIcon, CalendarIcon, GiftIcon, BagIcon, UserIcon } from '@/components';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const iconClass = 'w-5 h-5';

const navItems: NavItem[] = [
  { label: 'Início', href: '/inicio', icon: <HeartIcon className={iconClass} /> },
  { label: 'Calendário', href: '/calendario', icon: <CalendarIcon className={iconClass} /> },
  { label: 'Presentes', href: '/presentes', icon: <GiftIcon className={iconClass} /> },
  { label: 'Pedidos', href: '/pedidos', icon: <BagIcon className={iconClass} /> },
  { label: 'Contactos', href: '/contactos', icon: <UserIcon className={iconClass} /> },
  { label: 'Perfil', href: '/perfil', icon: <UserIcon className={iconClass} /> },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useSupabaseSafe();
  const isConfigured = isSupabaseConfigured();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-brand-off-white">
      {/* ── Dev mode banner ─────────────────────────────────────────────── */}
      {!isConfigured && (
        <div className="fixed inset-x-0 top-0 z-50 bg-yellow-300 px-4 py-2 text-center text-xs font-medium text-yellow-900">
          ⚠ Modo de desenvolvimento — Supabase não configurado. O logout e a
          verificação de sessão não estarão activos.
        </div>
      )}

      {/* ── Mobile menu overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      {/* ── Sidebar / Mobile drawer ─────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-purple-dark text-white transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <span className="bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text text-xl font-bold text-transparent">
            Presentei
          </span>
          <button
            className="text-white/60 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-pink text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={handleLogout}
            disabled={!supabase}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-lg">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl text-brand-purple-dark"
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <span className="bg-gradient-to-r from-brand-pink to-brand-orange bg-clip-text font-bold text-transparent">
            Presentei
          </span>
          <div className="w-8" /> {/* spacer */}
        </header>

        {/* Page content */}
        <main className={`flex-1 p-6 ${!isConfigured ? 'mt-8' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
