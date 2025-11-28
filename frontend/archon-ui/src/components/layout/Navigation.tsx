import {
  LayoutDashboard,
  Bot,
  Calendar,
  Phone,
  Mail,
  FileText,
  Zap,
  Settings,
  MessageSquare,
  Palette,
  BookOpen
} from "lucide-react";
import type React from "react";
import { Link, useLocation } from "react-router-dom";
// TEMPORARY: Use old SettingsContext until settings are migrated
import { useSettings } from "../../contexts/SettingsContext";
import { glassmorphism } from "../../features/ui/primitives/styles";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../features/ui/primitives/tooltip";
import { cn } from "../../lib/utils";

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  enabled?: boolean;
}

interface NavigationProps {
  className?: string;
}

/**
 * Modern navigation component using Radix UI patterns
 * No fixed positioning - parent controls layout
 */
export function Navigation({ className }: NavigationProps) {
  const location = useLocation();
  const { projectsEnabled, styleGuideEnabled, agentWorkOrdersEnabled } = useSettings();

  // Navigation items configuration - IA Factory PRO
  const navigationItems: NavigationItem[] = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      enabled: true,
    },
    {
      path: "/",
      icon: <Bot className="h-5 w-5" />,
      label: "Chat IA (6 agents)",
      enabled: true,
    },
    {
      path: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      label: "Rendez-vous",
      enabled: true,
    },
    {
      path: "/voice",
      icon: <Phone className="h-5 w-5" />,
      label: "Agent Vocal",
      enabled: true,
    },
    {
      path: "/integrations",
      icon: <Mail className="h-5 w-5" />,
      label: "Emails",
      enabled: true,
    },
    {
      path: "/knowledge",
      icon: <FileText className="h-5 w-5" />,
      label: "Documents",
      enabled: true,
    },
    {
      path: "/messaging",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Messagerie SMS",
      enabled: true,
    },
    {
      path: "/automations",
      icon: <Zap className="h-5 w-5" />,
      label: "Automatisations",
      enabled: true,
    },
    {
      path: "/agent-work-orders",
      icon: <BookOpen className="h-5 w-5" />,
      label: "Agent Work Orders",
      enabled: agentWorkOrdersEnabled,
    },
    {
      path: "/style-guide",
      icon: <Palette className="h-5 w-5" />,
      label: "Style Guide",
      enabled: styleGuideEnabled,
    },
    {
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Paramètres",
      enabled: true,
    },
  ];

  // Filter out disabled navigation items
  const enabledNavigationItems = navigationItems.filter((item) => item.enabled);

  const isProjectsActive = location.pathname.startsWith("/projects");

  return (
    <nav
      className={cn(
        "flex flex-col items-center gap-6 py-6 px-3",
        "rounded-xl w-[72px]",
        // Using glassmorphism from primitives
        glassmorphism.background.subtle,
        "border border-gray-200 dark:border-zinc-800/50",
        "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]",
        className,
      )}
    >
      {/* Logo - Always visible, conditionally clickable for Projects */}
      <Tooltip>
        <TooltipTrigger asChild>
          {projectsEnabled ? (
            <Link
              to="/projects"
              className={cn(
                "relative p-2 rounded-lg transition-all duration-300",
                "flex items-center justify-center",
                "hover:bg-white/10 dark:hover:bg-white/5",
                isProjectsActive && [
                  "bg-gradient-to-b from-white/20 to-white/5 dark:from-white/10 dark:to-black/20",
                  "shadow-[0_5px_15px_-5px_rgba(59,130,246,0.3)] dark:shadow-[0_5px_15px_-5px_rgba(59,130,246,0.5)]",
                  "transform scale-110",
                ],
              )}
            >
              <img
                src="/logo-neon.png"
                alt="IAFactory Hub"
                className={cn(
                  "w-8 h-8 transition-all duration-300",
                  isProjectsActive && "filter drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]",
                )}
              />
              {/* Active state decorations */}
              {isProjectsActive && (
                <>
                  <span className="absolute inset-0 rounded-lg border border-blue-300 dark:border-blue-500/30" />
                  <span className="absolute bottom-0 left-[15%] right-[15%] w-[70%] mx-auto h-[2px] bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.4)] dark:shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]" />
                </>
              )}
            </Link>
          ) : (
            <div className="p-2 rounded-lg opacity-50 cursor-not-allowed">
              <img src="/logo-neon.png" alt="Archon" className="w-8 h-8 grayscale" />
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{projectsEnabled ? "IAFactory Hub" : "Projects Disabled"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Separator */}
      <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      {/* Navigation Items */}
      <nav className="flex flex-col gap-4">
        {enabledNavigationItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    "relative p-3 rounded-lg transition-all duration-300",
                    "flex items-center justify-center",
                    isActive
                      ? [
                          "bg-gradient-to-b from-white/20 to-white/5 dark:from-white/10 dark:to-black/20",
                          "text-blue-600 dark:text-blue-400",
                          "shadow-[0_5px_15px_-5px_rgba(59,130,246,0.3)] dark:shadow-[0_5px_15px_-5px_rgba(59,130,246,0.5)]",
                        ]
                      : [
                          "text-gray-500 dark:text-zinc-500",
                          "hover:text-blue-600 dark:hover:text-blue-400",
                          "hover:bg-white/10 dark:hover:bg-white/5",
                        ],
                  )}
                >
                  {item.icon}
                  {/* Active state decorations with neon line */}
                  {isActive && (
                    <>
                      <span className="absolute inset-0 rounded-lg border border-blue-300 dark:border-blue-500/30" />
                      <span className="absolute bottom-0 left-[15%] right-[15%] w-[70%] mx-auto h-[2px] bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.4)] dark:shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]" />
                    </>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </nav>
  );
}
