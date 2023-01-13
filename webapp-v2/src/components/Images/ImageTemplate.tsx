import clsx from "clsx";

type ImageTemplateProps = {
  src: string;
  alt: string;
  className?: string;
};

const ImageTemplate = (props: ImageTemplateProps) => {
  const { src, alt, className } = props;

  return (
    <img src={src} alt={alt} className={clsx('w-44', 'h-44', className)} loading="lazy"/>
  );
};

export default ImageTemplate;