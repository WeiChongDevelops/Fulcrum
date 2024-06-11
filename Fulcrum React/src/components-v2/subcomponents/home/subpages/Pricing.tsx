import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";

/**
 * The Pricing section of the Fulcrum homepage.
 */
export default function Pricing() {
  return (
    <div className={"pricing-container w-screen h-[calc(100vh-170px)] flex flex-row p-[8vw] relative -mb-[3vw]"}>
      <img
        src="/static/assets-v2/homepage-assets/pricing-background-2.png"
        className={"absolute top-0 left-0 -z-10 w-full h-[84vh]"}
        alt="Pricing background"
      />
      <div className={"pricing-copy"}>
        <p className={"text-5xl text-left font-bold text-black ml-2 mb-8"}>It's free, what are you doing here?</p>
        <a href="/register">
          <FulcrumButton
            displayText={"Get Started"}
            hoverShadow={true}
            backgroundColour={"green"}
            optionalTailwind={"homepage-button"}
          />
        </a>
      </div>
      <div className={"pricing-badge-container"}>
        <img
          src="/static/assets-v2/fulcrum-logos/inside.png"
          alt="Fulcrum icon"
          className={"animated-pricing-icon-inside"}
        />
        <img
          src="/static/assets-v2/fulcrum-logos/outside.png"
          alt="Fulcrum icon"
          className={"animated-pricing-icon-outside"}
        />
      </div>
    </div>
  );
}