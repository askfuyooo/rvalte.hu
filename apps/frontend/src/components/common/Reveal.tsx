import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
    children: ReactNode;
    className?: string;
    delay?: number;
};

const easing = [0.22, 1, 0.36, 1] as const;

export const Reveal = ({
    children,
    className = "",
    delay = 0,
}: RevealProps) => {
    const prefersReducedMotion = useReducedMotion();
    const elementRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [exitY, setExitY] = useState(22);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        if (prefersReducedMotion) return setIsInView(true);

        if (typeof IntersectionObserver === "undefined")
            return setIsInView(true);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;

                if (entry.isIntersecting) return setIsInView(true);

                const rect = entry.boundingClientRect;
                const viewportMidpoint = window.innerHeight / 2;
                setExitY(
                    rect.top + rect.height / 2 < viewportMidpoint ? -22 : 22,
                );
                setIsInView(false);
            },
            {
                threshold: 0.12,
                rootMargin: "-6% 0px -6% 0px",
            },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    return (
        <motion.div
            ref={elementRef}
            className={className}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
            animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : exitY,
            }}
            transition={{
                duration: prefersReducedMotion ? 0 : 0.56,
                delay: isInView && !prefersReducedMotion ? delay : 0,
                ease: easing,
            }}
        >
            {children}
        </motion.div>
    );
};
