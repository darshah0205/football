"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/players", label: "Players" },
  { href: "/admin/matches", label: "Matches" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <Link href="/" className="text-xl font-bold text-green-400 block mb-8">
        ⚽ Admin Panel
      </Link>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 pt-4 border-t border-gray-700">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  );
}
