
import MorphingShape from "@app/components/generativeart/MorphingShape";

export const Main = () => {
    return (
        <>
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