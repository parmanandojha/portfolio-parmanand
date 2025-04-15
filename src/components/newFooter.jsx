import React from "react";

function NewFooter() {
  return (
    <div className="w-full opacity-100">
      {/* Footer background image with error handling */}
      <div>
        <img 
          src="project images/footer-bg.png" 
          alt="Footer background" 
          className="w-full" 
          onError={(e) => {
            console.log("Footer background image failed to load");
            e.target.style.display = "none"; // Hide the img element if it fails to load
          }}
        />
      </div>
      <div className="grid grid-cols-4 pt-32">
        <div className="col-span-2">
          <span className="text-[4vh] md:text-[10vh] font-semibold mb-4 leading-[0.8]">
            Lets work <br></br>together 
          </span>
        </div>
        <div className="col-span-2">
          <div className="text-[2vh] sm:text-[6vh] font-semibold mb-4 loader-text">
            <a href="mailto:ojha96p@gmail.com" className="hover:underline">
              ojha96p@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 pt-24 mb-8">
        <div className="col-span-2">
          <span className="text-[1.55vh] font-semibold mb-4 leading-[0.3]">
            Designed & Developed by - Parmanand Ojha
          </span>
        </div>
        <div className="col-span-2">
          <div className="text-[1.55vh] font-semibold mb-4">
            <div className="flex flex-row justify-between">
              <span>
                <a 
                  href="https://www.behance.net/ojhap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Behance
                </a>
              </span>
              <span>
                <a 
                  href="https://www.linkedin.com/in/parmanand-ojha-81900a167/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              </span>
              <span>
                <a 
                  href="https://drive.google.com/file/d/1NMRz_xv-QCCv50Iw_-3dX3_N_KDoQ529/view?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline"
                >
                  Resume
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewFooter;