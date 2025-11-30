import Image from "next/image";

export function TwoFourteenLogo() {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/214-logo.png"
        alt="TwoFourteen SolarSync Logo"
        width={160}
        height={60}
        className="object-contain"
        priority
      />
    </div>
  );
}
