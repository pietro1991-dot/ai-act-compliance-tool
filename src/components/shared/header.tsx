import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/questionnaire", label: "Valutazione" },
  { href: "/pricing", label: "Consulenza" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg">
          <img src="/icon.svg" alt="AI Act Check" className="size-8" width={32} height={32} />
          <span>AI Act Check</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
