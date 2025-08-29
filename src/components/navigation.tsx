"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: "🏠"
    },
    {
      name: "Spaces",
      href: "/spaces",
      icon: "🏢"
    },
    {
      name: "Events",
      href: "/events",
      icon: "📅"
    },
    {
      name: "Blog",
      href: "/blog",
      icon: "📝"
    },
    {
      name: "Community",
      href: "/community",
      icon: "👥",
      comingSoon: true
    },
    {
      name: "Feedback",
      href: "/feedback",
      icon: "💬"
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-xl">Nomad Life</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {item.comingSoon && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {user.user_metadata?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors relative",
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
              {item.comingSoon && (
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </Link>
          ))}
          
          {/* Mobile Auth Section */}
          {!loading && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              {user ? (
                <div className="space-y-1">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
