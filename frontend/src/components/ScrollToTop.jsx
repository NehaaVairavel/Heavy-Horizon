import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Skip auto-scroll for pages that handle their own scrolling
        if (pathname === '/sales' || pathname === '/services') {
            return;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return null;
}
