import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

type DrawerButtonProps = {
  icon: React.ReactNode;
  text: string;
  path: string;
};

const DrawerButton = (props: DrawerButtonProps) => {
  const { icon, text, path } = props;

  const navigate = useNavigate();

  return (
    <ListItemButton onClick={() => navigate(path)}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}

export default DrawerButton;