import { SkeletonBlock } from "../common/SkeletonBlock";

const SKELETON_ROW_COUNT = 4;

export const TimelineSkeleton = () => {
    return (
        <div
            className="timeline-list timeline-list--loading"
            role="status"
            aria-label="Kiadványok betöltése"
            aria-busy="true"
        >
            {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <div
                    className="release-row release-row--skeleton"
                    key={index}
                    aria-hidden="true"
                >
                    <div className="release-date release-date--skeleton">
                        <SkeletonBlock className="skeleton-release-year" />
                        <SkeletonBlock className="skeleton-release-date" />
                    </div>
                    <div className="release-node">
                        <span />
                    </div>
                    <div className="release-skeleton-card">
                        <div className="release-cover-wrap">
                            <SkeletonBlock className="skeleton-release-cover" />
                        </div>
                        <div className="release-card-content release-skeleton-content">
                            <div className="release-card-meta">
                                <SkeletonBlock className="skeleton-release-index" />
                                <SkeletonBlock className="skeleton-release-tag" />
                            </div>
                            <SkeletonBlock
                                className={`skeleton-release-title skeleton-release-title--${index + 1}`}
                            />
                            <SkeletonBlock className="skeleton-release-artists" />
                            <div className="release-card-hint">
                                <SkeletonBlock className="skeleton-release-hint" />
                                <SkeletonBlock className="skeleton-release-dash" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
