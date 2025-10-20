
import { ShopLink } from "@app/components/home/ShopLink";
import MorphingShape from "@app/components/generativeart/MorphingShape";
import { Logo } from "@app/components/home/Logo";
import { Description } from "@app/components/home/Description";
import { LogoProps } from "@libs/types";

export const Main = ({ onLetterClick, onMouseEnterLetter, onMouseLeaveLogo }: LogoProps) => {
    return (
        <>
            <div className="flex relative flex-col items-center gap-4">
                <ShopLink className="z-10" />
                <Logo
                    className="z-10 mix-blend-exclusion"
                    onLetterClick={onLetterClick}
                    onMouseEnterLetter={onMouseEnterLetter}
                    onMouseLeaveLogo={onMouseLeaveLogo}
                />
                <Description className="z-10 mt-16" />
            </div>
            <div>
                <MorphingShape blur={20} zoom={0.6} id="1"
                    classNameWrapper="items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] -rotate-[62deg]" />

                <MorphingShape blur={40} zoom={0.25} colorStart="#FCF099" colorEnd="#E5DC95" classNameWrapper="items-center justify-center -rotate-[28deg]"
                    className="absolute top-[20%] left-[259px]" id="3" offsetStart={58} offsetEnd={100} />
                <MorphingShape blur={58} zoom={0.45} colorStart="#F5DDDD" colorEnd="#EC98BA" id="2" classNameWrapper="items-center justify-center -rotate-[42deg]"
                    className="absolute top-[154px] right-[15%]" offsetStart={9} offsetEnd={79} />
            </div>
        </>
    )
}