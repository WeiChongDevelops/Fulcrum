import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import "../../../../css/Home.css";

/**
 * The header of the Fulcrum homepage.
 */
export default function HomeNavbar() {
  return (
    <div className={"flex flex-row justify-between items-center py-4 bg-white border-b-black border-2"}>
      <div className={"flex flex-1 justify-start item-center ml-4 sm:ml-16"}>
        <div className={"flex flex-row justify-start w-40 transition-all cursor-pointer hover:-rotate-3 hover:scale-110"}>
          <img
            src={`/static/assets/fulcrum-logos/fulcrum-long-black.webp`}
            alt="Fulcrum logo in navbar"
            className="w-full h-auto"
            onClick={() => (window.location.href = window.location.origin + "/home/about")}
          />
        </div>
      </div>
      <div className={"flex flex-row flex-1 justify-center items-center text-black font-semibold text-lg gap-8"}>
        <p
          className={"homepage-navbar-link"}
          onClick={() => (window.location.href = window.location.origin + "/home/about")}
        >
          About
        </p>
        <p
          className={"homepage-navbar-link"}
          onClick={() => (window.location.href = window.location.origin + "/home/pricing")}
        >
          Pricing
        </p>
        <p
          className={"homepage-navbar-link"}
          onClick={() => (window.location.href = window.location.origin + "/home/contact")}
        >
          Contact
        </p>
        <p className={"homepage-navbar-link"} onClick={() => (window.location.href = window.location.origin + "/home/faq")}>
          FAQ
        </p>
      </div>
      <div className={"flex-1 flex flex-row justify-end mr-4 sm:mr-16"}>
        <FulcrumButton
          displayText={"Sign Up for Free"}
          backgroundColour={"green"}
          onClick={() => (window.location.href = window.location.origin + "/register")}
          hoverShadow={true}
        />
      </div>
    </div>
  );
}
