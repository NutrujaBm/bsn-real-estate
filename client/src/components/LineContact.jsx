import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";

function LineContact() {
  const lineID = "boom1640_";
  return (
    <a
      href={`https://line.me/ti/p/${lineID}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <IoLogoWhatsapp size={50} color="#25d366" />
    </a>
  );
}

export default LineContact;
