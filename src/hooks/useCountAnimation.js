import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating number counting
 * @param {number} end - The final number to count to
 * @param {number} duration - Duration of animation in milliseconds (default: 2000)
 * @param {boolean} shouldStart - Whether to start the animation (default: true)
 * @returns {number} - The current animated value
 */
export const useCountAnimation = (end, duration = 2000, shouldStart = true) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    const startTimeRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!shouldStart) return;

        // Reset
        countRef.current = 0;
        setCount(0);
        startTimeRef.current = null;

        const animate = (timestamp) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            countRef.current = currentCount;
            setCount(currentCount);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                // Ensure we end exactly at the target
                setCount(end);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [end, duration, shouldStart]);

    return count;
};
