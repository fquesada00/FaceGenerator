import { Typography } from "@mui/material";

type ContentHeaderProps = {
  title: string;
  subtitle: React.ReactNode;
}

const ContentHeader = (props: ContentHeaderProps) => {
  const { title, subtitle } = props;

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <Typography component={'span'} variant="h4" sx={{ fontWeight: '700' }}>
        {title}
      </Typography>
      <Typography component={'span'} variant="body1" sx={{ fontWeight: '500' }}>
        {subtitle}
      </Typography>
    </div>
  );
}

export default ContentHeader;