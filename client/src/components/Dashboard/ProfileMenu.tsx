import Avatar from "../ui/Avatar";
import { useAuth } from "../../context/auth";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import { Dropdown, MenuDivider, MenuItem } from "../ui/Dropdown";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Dropdown
      trigger={
        <button className="flex h-11 items-center gap-2.5 rounded-2xl pl-1.5 pr-2.5 transition-colors hover:bg-surface-2">
          <Avatar
            name={user?.name ?? ""}
            color={user?.avatarColor ?? ""}
            size="sm"
          />
          <div className="hidden min-w-0 text-left sm:block">
            <p className="max-w-36 truncate text-sm font-semibold leading-tight text-fg">
              {user?.name}
            </p>
            <p className="max-w-36 truncate text-[11px] text-muted">
              {user?.email}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted" />
        </button>
      }
    >
      <div className="px-2.5 py-2 sm:hidden">
        <p className="truncate text-sm font-semibold text-fg">{user?.name}</p>
        <p className="truncate text-xs text-muted">{user?.email}</p>
      </div>
      <MenuItem icon={Settings} onClick={() => navigate("/settings")}>
        Settings
      </MenuItem>
      <MenuDivider />
      <MenuItem icon={LogOut} danger onClick={logout}>
        Log out
      </MenuItem>
    </Dropdown>
  );
};

export default ProfileMenu;
