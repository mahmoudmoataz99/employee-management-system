import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
    collapsed?: boolean;
}

export function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
                disabled
            >
                <Sun className="h-5 w-5" />
            </button>
        );
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${collapsed ? 'w-8 h-8 justify-center p-0' : 'w-full'
                }`}
            title={collapsed ? (theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode") : undefined}
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 shrink-0" />
            ) : (
                <Moon className="h-5 w-5 shrink-0" />
            )}
            {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>
    );
}
