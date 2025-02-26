import React from "react";

// import { Home } from "./Home";
// import { NavigationFooter } from "./NavigationFooter";
// import chartAltFill from "./chart-alt-fill.svg";
// import compass from "./compass.png";
// import ellipse78 from "./ellipse-78.png";
// import estelleDarcy51 from "./estelle-darcy-5-1.png";
// import eventAccepted from "./event-accepted.png";
// import fileDockFill from "./file-dock-fill.svg";
// import iconBell from "./icon-bell.png";
// import maskGroup from "./mask-group.png";
// import paperFill from "./paper-fill.svg";
// import rectangle243 from "./rectangle-243.svg";
// import "./style.css";
// import trophy from "./trophy.svg";
// import userCircle from "./user-circle.svg";

interface NavigationFooterProps {
  className: string;
  divider: string;
  icon: string;
  icon1: string;
  icon2: string;
  img: string;
}

interface AvatarProps {
  className: string;
  onlineIndicator: string;
  size: string;
  type: string;
}

export const ManageProfile: React.FC = () => {
  return (
    <div className="manage-profile">
      <div className="div-2">
        <div className="group">
          <div className="overlap">
            {/* <img className="rectangle" alt="Rectangle" src={rectangle243} /> */}

            <div className="group-2">
              <div className="text-wrapper-4">Edit Profile</div>
              <div className="text-wrapper-5">Preferences</div>
              <div className="text-wrapper-6">Security</div>
              <div className="rectangle-2" />
              <div className="rectangle-3" />
            </div>

            {/* <img className="mask-group" alt="Mask group" src={maskGroup} /> */}

            {/* Input fields */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={`input${index ? `-${index + 1}` : ''}`}>
                <div className="text-wrapper-7">Your Name</div>
                <div className="overlap-group">
                  <div className="text-wrapper-8">Charlene Reed</div>
                </div>
              </div>
            ))}

            <div className="overlap-wrapper">
              <div className="overlap-2">
                <div className="rectangle-4" />
                <div className="text-wrapper-9">Save</div>
              </div>
            </div>
          </div>
        </div>

        

        {/* <NavigationFooter
          className="navigation-footer-instance"
          divider="divider-2.svg"
          icon="icon-4.svg"
          icon1="icon-7.svg"
          icon2="icon-6.svg"
          img="icon-5.svg"
        /> */}

        <header className="header">
          <div className="navigation-new">
            {/* <img className="estelle-darcy" alt="Estelle darcy" src={estelleDarcy51} /> */}
            <div className="navbar">
              <div className="text-wrapper-20">Home</div>
              <div className="text-wrapper-20">FAQ</div>
              <div className="text-wrapper-21">Services</div>
              <div className="text-wrapper-21">Find a Counsellor</div>
              <div className="text-wrapper-21">Join as a Counsellor</div>
            </div>

            {/* <Avatar
              className="avatar-instance"
              onlineIndicator="none"
              size="XL"
              type="image"
            /> */}
            {/* <img className="icon-bell" alt="Icon bell" src={iconBell} /> */}
          </div>
        </header>
      </div>
    </div>
  );
}