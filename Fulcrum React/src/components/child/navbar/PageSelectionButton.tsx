import { Dispatch, SetStateAction, useMemo } from "react";
import { capitaliseFirstLetter } from "../../../utility/util.ts";
import PageSelectionButtonIcon from "./PageSelectionButtonIcon.tsx";
import { useNavigate } from "react-router-dom";

interface PageSelectionButtonProps {
  darkModeEnabled: boolean;
  hoveredNavButton: string;
  setHoveredNavButton: Dispatch<SetStateAction<string>>;
  fulcrumPage: string;
  windowLocation: string;
}

export default function PageSelectionButton({
  darkModeEnabled,
  hoveredNavButton,
  setHoveredNavButton,
  fulcrumPage,
  windowLocation,
}: PageSelectionButtonProps) {
  const isCurrentWindowLocation = useMemo(() => windowLocation === fulcrumPage, [windowLocation, fulcrumPage]);
  const isHoveredWindowLocation = useMemo(() => hoveredNavButton === fulcrumPage, [hoveredNavButton, fulcrumPage]);
  const navigate = useNavigate();

  function handleMouseEnter() {
    setHoveredNavButton(fulcrumPage);
  }

  function handleMouseLeave() {
    setHoveredNavButton("");
  }

  return (
    <button
      id={fulcrumPage}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`lower-navbar-button ${isCurrentWindowLocation ? "bg-[#17423F]" : "bg-black"} hover:text-black ${darkModeEnabled ? "hover:bg-gray-400" : "hover:bg-white"} 
      focus:outline-none border-y-2 border-x-4`}
      onClick={() => navigate(`/app/${fulcrumPage}`)}
    >
      <PageSelectionButtonIcon
        fulcrumPage={fulcrumPage}
        isCurrentWindowLocation={isCurrentWindowLocation}
        isHoveredWindowLocation={isHoveredWindowLocation}
      />
      <p className="mx-4">{capitaliseFirstLetter(fulcrumPage)}</p>
      <PageSelectionButtonIcon
        fulcrumPage={fulcrumPage}
        isCurrentWindowLocation={isCurrentWindowLocation}
        isHoveredWindowLocation={isHoveredWindowLocation}
      />
    </button>
  );
}
