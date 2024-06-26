import { useDvdScreensaver } from "react-dvd-screensaver";
import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import { useNavigate } from "react-router-dom";

export default function ComeOnMark() {
  const { containerRef, elementRef } = useDvdScreensaver({ speed: 2 });
  const { containerRef: __containerRef2, elementRef: elementRef2 } = useDvdScreensaver({ speed: 2 });
  const { containerRef: __containerRef3, elementRef: elementRef3 } = useDvdScreensaver({ speed: 2 });
  const navigate = useNavigate();
  return (
    <div ref={containerRef} className={"w-screen h-screen relative bg-white m-0"}>
      <div ref={containerRef} className={"w-screen h-screen relative bg-white m-0"}>
        <div ref={containerRef} className={"w-screen h-screen relative bg-white m-0"}>
          <div className={"z-20 prose absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}>
            <h1>Meta Being Meta (Again)</h1>
            <p className={"font-medium"}>
              As of late, our favourite Facebook CEO has decreed that developers must display registered business
              documentation in order to use Facebook for logins.
            </p>
            <p className={"font-medium"}>Sorry.</p>
            <FulcrumButton displayText={"Back to Login"} hoverShadow onClick={() => navigate("/login")} />
          </div>
          <div ref={elementRef} className={"-z-20 w-16 h-16"}>
            <img src="/static/assets-v2/auth-icons/facebook-icon-inverted.png" alt="Fulcrum icon" className={"w-48"} />
          </div>
          <div ref={elementRef2} className={"-z-20 w-16 h-16"}>
            <img src="/static/assets-v2/auth-icons/meta-logo.png" alt="Fulcrum icon" className={"w-48"} />
          </div>
          <div ref={elementRef3} className={"-z-20 w-24"}>
            <img src="/static/assets-v2/auth-icons/zuck.jpeg" alt="Fulcrum icon" className={"w-24 rounded-full"} />
          </div>
        </div>
      </div>
    </div>
  );
}
