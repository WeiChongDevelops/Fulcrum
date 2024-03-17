import FulcrumButton from "../../other/FulcrumButton.tsx";

export default function HomeFooter() {
    return (
        <div className={"relative w-screen h-44 -mt-[14vw] mb-24 sm:mb-12 z-30 text-black sm:px-8"}>
            <div className={"homepage-footer grid grid-cols-3 grid-rows-8 justify-items-start items-end gap-y-1"}>
                <img className={"row-start-1 row-end-5 col-start-1 w-20 ml-[10vw]"} src={"/src/assets/fulcrum-logos/fulcrum-icon.png"} alt={"icon"}></img>
                <FulcrumButton displayText={"Register for Free"} optionalTailwind={"row-start-5 row-end-7 col-start-1 ml-[8.5vw] mt-5"} onClick={() => window.location.href = "/register"} backgroundColour={"green"} hoverShadow={true}/>
                <div className={"row-start-[8] col-start-1 pl-[9vw] text-[0.55rem] text-left"}>Copyright © {(new Date()).getFullYear()}, Fulcrum. All Rights Reserved.</div>

                <b className={"row-start-5 col-start-2 pl-[10vw] pb-1"}>Navigation</b>
                <p className={"row-start-6 col-start-2 pl-[10vw] font-medium text-xs"} onClick={() => window.location.href = "/home/about"}>About</p>
                <p className={"row-start-7 col-start-2 pl-[10vw] font-medium text-xs"} onClick={() => window.location.href = "/home/pricing"}>Pricing</p>
                <p className={"row-start-[8] col-start-2 pl-[10vw] font-medium text-xs"} onClick={() => window.location.href = "/home/contact"}>Contact</p>

                <b className={"row-start-5 col-start-3 pl-[10vw] pb-1"}>Additional</b>
                <p className={"row-start-6 col-start-3 pl-[10vw] font-medium text-xs"} onClick={() => window.location.href = "https://github.com/WeiChongDevelops/Fulcrum"}>GitHub</p>
                <p className={"row-start-7 col-start-3 pl-[10vw] font-medium text-xs"} onClick={() => window.location.href = "https://github.com/WeiChongDevelops/Fulcrum/blob/main/LICENSE"}>License</p>
                <p className={"row-start-[8] col-start-3 pl-[10vw] font-medium text-xs"} onClick={() => window.location.href = "https://weichong.dev/"}>More from Developer</p>
            </div>
        </div>
    );
}