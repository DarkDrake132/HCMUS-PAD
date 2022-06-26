import Image from "next/image";

function Logo({ name = "DLFullNameLogo", width = "350px", height = "100px" }) {
  return (
    <Image
      className="LogoSVG"
      src={`/${name}.svg`}
      alt="logo"
      width={width}
      height={height}
    ></Image>
  );
}

export default Logo;
