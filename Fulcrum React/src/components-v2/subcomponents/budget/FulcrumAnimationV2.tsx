import useAnimationDataV2 from "@/hooks/queries/useAnimationDataV2.ts";

interface FulcrumAnimationV2Props {
  navMenuOpen: boolean;
  totalIncome: number;
  totalBudget: number;
}

export default function FulcrumAnimationV2({ navMenuOpen, totalIncome, totalBudget }: FulcrumAnimationV2Props) {
  const { bowlWidth, containerRef, lineAngle, leverRef, bowlRef, leftOffset, rightOffset, shadowOpacity } =
    useAnimationDataV2({
      navMenuOpen,
      totalIncome,
      totalBudget,
    });

  const activeTriangleFulcrum = `/static/assets-v2/fulcrum-animation/fulcrum-tri-${lineAngle === 0 ? "green" : "red"}.webp`;
  const baseShadowWidth = bowlWidth * 0.85;

  return (
    <div className={"z-10 px-32 py-40 bg-slate-200 rounded-xl transition-opacity enableFadeIn"} ref={containerRef}>
      <div
        className={
          "absolute flex flex-row justify-center z-20 bottom-[7.4rem] left-1/2 w-[90%] origin-top transition-transform ease-out duration-300"
        }
        style={{ transform: `translateX(-50%) rotate(${lineAngle}deg)` }}
      >
        <img
          src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
          alt="Fulcrum bowl"
          className="w-20 -mr-10 z-20 transition-transform origin-top duration-1000"
          style={{ transform: `rotate(${-lineAngle}deg` }}
        />
        <div ref={leverRef} className={"w-[68%] lg:w-[70%] xl:w-[75%] z-10 h-3 rounded-md bg-black"}></div>
        <img
          ref={bowlRef}
          src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
          alt="Fulcrum bowl"
          className="w-20 -ml-10 z-20 transition-transform origin-top duration-700"
          style={{ transform: `rotate(${-lineAngle}deg` }}
        />
      </div>
      <div className={"absolute z-10 bottom-12 left-1/2 -translate-x-1/2 "}>
        <img src={activeTriangleFulcrum} className={"w-32"} alt="Triangle fulcrum" />
      </div>
      {/*<div*/}
      {/*  className={"absolute top-0 w-1 h-full -translate-x-1/2 bg-blue-950 transition-all ease-out"}*/}
      {/*  style={{ left: leftOffset }}*/}
      {/*></div>*/}
      <div
        className={
          "absolute bottom-[12%] bg-black rounded-[50%] transition-all ease-[cubic-bezier(0.0, 0.85, 0.95, 1.0)] duration-200"
        }
        style={{
          left: leftOffset,
          width: baseShadowWidth + lineAngle * 1.5,
          height: (baseShadowWidth + lineAngle * 1.5) / 10,
          transform: `translate(-50%, 50%) scale(${100 + lineAngle}%)`,
          opacity: shadowOpacity,
        }}
      ></div>
      {/*<div*/}
      {/*  className={"absolute top-0 w-1 h-full -translate-x-1/2 bg-blue-950 transition-all ease-out"}*/}
      {/*  style={{ left: rightOffset }}*/}
      {/*></div>*/}
      <div
        className={
          "absolute bottom-[12%] bg-black rounded-[50%] transition-all ease-[cubic-bezier(0.0, 0.85, 0.95, 1.0)] duration-200 -translate-x-1/2"
        }
        style={{
          left: rightOffset,
          width: baseShadowWidth - lineAngle * 1.5,
          height: (baseShadowWidth + lineAngle * 1.5) / 10,
          transform: `translate(-50%, 50%) scale(${100 - lineAngle}%)`,
          opacity: shadowOpacity,
        }}
      ></div>
      <div className={"absolute bottom-[10.8%] bg-black rounded-[50%] left-1/2 w-6 h-2 -translate-x-1/2"}></div>
    </div>
  );
}
