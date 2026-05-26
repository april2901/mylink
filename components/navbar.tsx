"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  BarChart3,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react";

interface NavbarProps {
  user?: {
    avatar_url: string;
    display_name: string;
    username: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={user ? "/manage" : "/"}
          className="flex items-center gap-2 text-xl font-bold transition-all hover:scale-105"
        >
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            mylink
          </span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-3">
            {/* My Page button */}
            <Link href={`/${user.username}`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">내 페이지</span>
              </Button>
            </Link>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="rounded-full ring-2 ring-white/10 transition-all hover:ring-violet-400/50 focus:outline-none" />
                }
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatar_url}
                    alt={user.display_name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-500 text-white text-sm">
                    {user.display_name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-card/95 backdrop-blur-xl border-white/10"
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.display_name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <Link href="/manage">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Manage
                  </DropdownMenuItem>
                </Link>
                <Link href={`/${user.username}`}>
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <User className="h-4 w-4" />
                    내 페이지
                  </DropdownMenuItem>
                </Link>
                <Link href="/stats">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <BarChart3 className="h-4 w-4" />
                    통계 보기
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-red-400 focus:text-red-400"
                  onClick={async () => {
                    await signOut();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
