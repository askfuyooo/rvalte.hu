import { useContext } from "react";
import { SiteDataContext } from "../context/SiteDataContext";

export const useSiteData = () => {
    const context = useContext(SiteDataContext);
    if (!context)
        throw new Error("useSiteData must be used within SiteDataProvider.");
    return context;
};
