import { Outlet } from "react-router-dom";
import NavbarUpper from "../child/navbar/NavbarUpper.tsx";
import NavbarLower from "../child/navbar/NavbarLower.tsx";
import Loader from "../child/other/Loader.tsx";
import { ErrorBoundary } from "../child/other/ErrorBoundary.tsx";
import { PublicUserData } from "@/utility/types.ts";
import { useContext, useEffect } from "react";
import { getSessionEmailOrNull } from "@/utility/api.ts";
import { LocationContext } from "@/utility/util.ts";

interface FulcrumProps {
  publicUserData: PublicUserData;
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function Fulcrum({ publicUserData, isAnyLoading }: FulcrumProps) {
  const routerLocation = useContext(LocationContext);
  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={publicUserData.darkModeEnabled} />;
  }

  useEffect(() => {
    getSessionEmailOrNull()
      .then((result) => result === null && (window.location.href = "/login"))
      .catch(() => (window.location.href = "/login"));
  }, [routerLocation]);

  return (
    <div
      className={`transition-filter duration-500 ease-in-out min-h-screen ${publicUserData.accessibilityEnabled && "accessibility-enabled"}`}
    >
      <NavbarUpper publicUserData={publicUserData} />
      <NavbarLower darkModeEnabled={publicUserData.darkModeEnabled} />
      {!window.location.href.includes("tools") && (
        <div id="background" className={`${publicUserData.darkModeEnabled ? "bg-dark-2" : "bg-light"}`}></div>
      )}

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
