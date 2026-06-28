"use client";



import {

  Box,

  Home,

  Layers,

  LayoutDashboard,

  MessageCircle,

  Settings,

  Shirt,

  Sparkles,

  Wand2,

} from "lucide-react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { APP_ROUTES, NAV_ITEMS } from "@/shared/constants";

import { useAppStore } from "@/stores";

import { useIsMobile } from "@/hooks";



const iconMap = {

  Home,

  LayoutDashboard,

  Shirt,

  Sparkles,

  Wand2,

  Layers,

  MessageCircle,

  Box,

  Settings,

} as const;



export function AppSidebar() {

  const pathname = usePathname();

  const isMobile = useIsMobile();

  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);



  if (isMobile && !sidebarOpen) {

    return null;

  }



  return (

    <>

      {isMobile && sidebarOpen && (

        <button

          type="button"

          aria-label="Close sidebar"

          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"

          onClick={() => setSidebarOpen(false)}

        />

      )}



      <aside

        className={cn(

          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",

          isMobile && !sidebarOpen && "-translate-x-full",

        )}

      >

        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">

          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">

            <Sparkles className="size-4" />

          </div>

          <div>

            <p className="text-sm font-semibold tracking-tight">AI Wardrobe</p>

            <p className="text-xs text-muted-foreground">Style intelligence</p>

          </div>

        </div>



        <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">

          {NAV_ITEMS.map((item) => {

            const Icon = iconMap[item.icon];

            const isActive =
              pathname === item.href ||
              (item.href === APP_ROUTES.studio &&
                pathname.startsWith("/studio"));

            return (

              <Link

                key={item.href}

                href={item.href}

                onClick={() => {

                  if (isMobile) setSidebarOpen(false);

                }}

                className={cn(

                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",

                  isActive

                    ? "bg-sidebar-accent text-sidebar-accent-foreground"

                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",

                )}

              >

                <Icon className="size-4 shrink-0" />

                {item.title}

              </Link>

            );

          })}

        </nav>
      </aside>

    </>

  );

}


