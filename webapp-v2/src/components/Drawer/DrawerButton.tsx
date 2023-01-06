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
  const active = window.location.pathname === path;

  return (
    <ListItemButton onClick={() => navigate(path)} style={{ backgroundColor: active ? "rgba(0, 0, 0, 0.2)" : "transparent" }}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
}

export default DrawerButton;