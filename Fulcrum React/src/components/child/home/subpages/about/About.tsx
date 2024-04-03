import UpperCopy from "./UpperCopy.tsx";
import MidCopy from "./MidCopy.tsx";
import LowerCopy from "./LowerCopy.tsx";
import { useEffect, useRef, useState } from "react";

/**
 * The About section of the Fulcrum homepage.
 */
export default function About() {
  const [showArrow, setShowArrow] = useState(true);
  const scrollHideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setShowArrow(!entry.isIntersecting);
        console.log("test");
      });
    });
    if (scrollHideRef.current) {
      observer.observe(scrollHideRef.current);
    }

    return () => {
      if (scrollHideRef.current) {
        observer.unobserve(scrollHideRef.current);
      }
    };
  }, []);

  return (
    <div className={"about-container bg-[#e0eddf] relative"}>
      <img
        src="/src/assets/homepage-assets/scroll-arrow.svg"
        className={`fixed top-[90vh] animate-bounce left-[48vw] w-[2vw] h-[2vw] z-50 opacity-75 ${showArrow ? "block" : "hidden"}`}
      ></img>
      <UpperCopy />
      <MidCopy />
      <LowerCopy />
      <div ref={scrollHideRef}></div>
    </div>
  );
}