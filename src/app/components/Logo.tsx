import Image from 'next/image';

const Logo = ({
  height = 40,
  width = 40,
}: {
  height?: number,
  width?: number,
}) => {
  return (
    <Image src="/marque.png" height={height} width={width} alt="IntelFox logo" />
  );
};

export default Logo;
