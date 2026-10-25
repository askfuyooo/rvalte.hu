type SkeletonBlockProps = {
    className?: string;
};

export const SkeletonBlock = ({ className = "" }: SkeletonBlockProps) => {
    return (
        <span
            aria-hidden="true"
            className={`skeleton-block ${className}`.trim()}
        />
    );
};
