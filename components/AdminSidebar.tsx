'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function AdminSidebar() {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()

  return (
    <>
      <aside className={`glass-sidebar ${open ? 'open' : 'closed'}`} aria-label="Admin navigation">
        <button
          className="toggle-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-nav"
        >
          {open ? '⟨' : '⟩'}
        </button>

        <nav id="admin-nav" className="sidebar-nav">
          <h2 className="sidebar-title">Admin</h2>
          <ul>
            <li>
              <Link className={`nav-item ${pathname === '/admin' ? 'active' : ''}`} href="/admin" aria-label="Dashboard">
                <span className="item-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M9 22V12h6v10"/></svg>
                </span>
                <span className="item-label">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link className={`nav-item ${pathname?.startsWith('/admin/cards') ? 'active' : ''}`} href="/admin/cards" aria-label="Cards">
                <span className="item-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6"/><path d="M7 13h10"/></svg>
                </span>
                <span className="item-label">Cards</span>
              </Link>
            </li>
            <li>
              <Link className={`nav-item ${pathname?.startsWith('/admin/companies') ? 'active' : ''}`} href="/admin/companies" aria-label="Companies">
                <span className="item-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V7a2 2 0 0 1 2-2h4l2-3 2 3h4a2 2 0 0 1 2 2v14"/><path d="M16 11h.01"/><path d="M12 11h.01"/><path d="M8 11h.01"/><path d="M20 21H4"/><path d="M20 17H4"/><path d="M10 21v-4"/></svg>
                </span>
                <span className="item-label">Companies</span>
              </Link>
            </li>
            <li>
              <Link className={`nav-item ${pathname?.startsWith('/admin/questions') ? 'active' : ''}`} href="/admin/questions" aria-label="Questions">
                <span className="item-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>
                </span>
                <span className="item-label">Questions</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <button
        type="button"
        className={`mobile-sidebar-trigger ${open ? 'hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="เปิดเมนูผู้ดูแล"
      >
        ☰
      </button>
    </>
  )
}


