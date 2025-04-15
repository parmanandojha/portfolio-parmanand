import React from "react";

import NewFooter from "./newFooter";

function Info() {
    return (
        <div className="pt-24 md:pt-32 overflow-hidden">
            {/* Top grid section */}
            <div className="grid grid-cols-1 md:grid-cols-4 mb-16 relative">
                <div className="col-span-1 hidden sm:block"></div>
                <div className="col-span-1 text-xs sm:text-sm md:text-base font-semibold mb-4 leading-[0.8]">
                    <span>scroll</span>
                </div>
                <div className="col-span-1 text-xs sm:text-sm md:text-base font-semibold mb-4 leading-[1]">
                    <span>Crafting Narrative <br></br>Through Design.</span>
                </div>
                <div className="col-span-1 hidden sm:block"></div>
            </div>

            {/* Name section with blurred text */}
            <div className="relative my-12 sm:my-16 md:my-24">
                <div className="relative flex flex-col text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold uppercase mb-4 leading-[1] blur-[1vh] px-4 opacity-72">
                    <div>Graphics &</div>
                    <div>UI/UX Designer,</div>
                    <div className="flex flex-row justify-between"><div>Based in</div><div>India</div></div>
                    <div>C2025</div>
                </div>    
                <div className="absolute top-1/4 text-center text-[17vwvw] sm:text-[20.2vw] md:text-[19.5vw] lg:text-[20vw] font-semibold mb-4 leading-[0.8] px-4 md:px-0">
                    <span>parmanand</span>
                </div>
            </div>

            {/* Main content section with multiple text elements */}
            <div className="relative my-12 sm:my-16 md:my-24">
                {/* Blurred background text */}
                <div className="relative flex flex-col text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold mb-4 leading-[1] blur-sm px-4 uppercase opacity-72">
                    <div>A lot of amazing </div>
                    <div>products are being</div>
                    <div>created in the world, but </div>
                    <div>often the way they are</div>
                    <div>presented in the digital </div>
                    <div>world spoils the overall</div>
                    <div>impression</div>
                </div> 

                {/* Top right text */}
                <div className="absolute top-0 right-0 text-lg sm:text-xl md:text-2xl lg:text-4xl flex flex-col font-semibold mb-4 leading-[1] px-4">
                    <div>i'm just doing</div>
                    <div>design as other</div>
                    <div>nothing too</div>
                    <div>fancy</div>
                </div>

                {/* Center text */}
                <div className="absolute top-1/2 inset-0 text-center text-lg sm:text-xl md:text-2xl lg:text-4xl flex flex-col justify-self-center font-semibold mb-4 gap-2 sm:gap-3 md:gap-5 leading-[1] w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto px-4">
                    <div>just turning ideas into 
                            functional designs, 
                            overthinking every detail, 
                            diving into frustration, 
                            obsessing over perfection, 
                            rethinking it all and...</div>
                    <div>finally — delivering.</div>
                </div>
            </div>

            {/* Footer */}
            <NewFooter />
        </div>
    );
}

export default Info;