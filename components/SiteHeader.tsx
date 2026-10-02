import Link from "next/link";
import { Logo } from "./Logo";
import { DesktopNav, MobileMenu } from "./SiteNav";

export function SiteHeader() {
  return (
    <header className="sticky z-30 border-b border-line bg-paper" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6 xl:px-8">
        <Logo />
        <DesktopNav />
        <div className="flex items-center gap-2">
          <Link href="/free-profile-check/" className="btn btn-primary hidden whitespace-nowrap md:inline-flex">
            Free profile check
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function SkipLink() {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-paper focus:px-4 focus:py-3 focus:font-semibold focus:text-blue focus:shadow-lg">
      Skip to main content
    </a>
  );
}
