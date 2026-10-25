import { motion, useScroll, useSpring } from "framer-motion";

export const PageProgress = () => {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, {
        stiffness: 180,
        damping: 34,
        mass: 0.18,
        restDelta: 0.001,
    });

    return (
        <div className="page-progress" aria-hidden="true">
            <motion.div style={{ scaleX: progress }} />
        </div>
    );
};
