import dynamic from "next/dynamic";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { Fragment, useContext, useState } from "react";
import { UserContext } from "@src/context/UserContext";
import { convertFountainToJSON } from "@src/converters/import/fountain";
import PopupImportFile from "../popup/PopupImportFile";
import { Project } from "@prisma/client";
import { SaveStatus } from "@src/lib/utils/enums";
import { useDesktop, useUser } from "@src/lib/utils/hooks";
import NavbarButton from "./NavbarButton";
import {
  redirectExport,
  redirectLogin,
  redirectProjectInfo,
  redirectReports,
  redirectScreenplay,
  redirectSettings,
  redirectStatistics,
  redirectStory,
  redirectTitlePage,
} from "@src/lib/utils/redirects";

import SettingsSVG from "../../public/images/gear.svg";
import LogoutSVG from "../../public/images/logout.svg";
import SavingSVG from "../../public/images/saving.svg";

import settings from "../settings/SettingsPageContainer.module.css";
import navbar from "./Navbar.module.css";
import sidebar from "../editor/sidebar/EditorSidebar.module.css";

import Image from "next/image";
import Logo from "@public/images/logo.svg";
import BlankLogo from "@public/images/blank.svg";
import Add from "@public/images/add.svg";

import styledCom from "styled-components";
import { createSvgIcon } from "@mui/material/utils";

import { styled } from "@mui/material/styles";

import {
  Badge,
  Box,
  Button,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";

const NavbarTab = dynamic(() => import("./NavbarTab"));

// ------------------------------ //
//              DATA              //
// ------------------------------ //
enum PAGE {
  // /{page}
  INDEX = "index",
  SETTINGS = "settings",
  ABOUT = "about",
  LOGIN = "login",
  SIGNUP = "signup",
  RECOVER = "recover",

  // /projects/{id}/{page}
  SCREENPLAY = "screenplay",
  STATISTICS = "statistics",
  EDIT = "edit",
  EXPORT = "export",
}

export type NavbarTabData = {
  name: string;
  action: () => void;
  icon?: string;
};

type Props = {
  project?: Project;
};

type NavbarTabs = {
  [tabName: string]: NavbarTabData[];
};

// ------------------------------ //
//            FUNCTIONS           //
// ------------------------------ //
const getCurrentPage = (path: string) => {
  if (path === "/") return PAGE.INDEX;

  const route = path.split("/");
  switch (route[1]) {
    case "login":
      return PAGE.LOGIN;
    case "signup":
      return PAGE.SIGNUP;
    case "about":
      return PAGE.ABOUT;
    case "recover":
      return PAGE.RECOVER;
  }

  switch (route[3]) {
    case "screenplay":
      return PAGE.SCREENPLAY;
    case "statistics":
      return PAGE.STATISTICS;
    case "edit":
      return PAGE.EDIT;
    case "export":
      return PAGE.EXPORT;
  }
};

// ------------------------------ //
//           COMPONENTS           //
// ------------------------------ //
const NotLoggedNavbar = () => (
  <div className={navbar.notlogged_btns}>
    <Link className="notlogged-navbar-btn" href={"/about"}>
      About
    </Link>
    <Link className="notlogged-navbar-btn" href={"/contact"}>
      Contact
    </Link>
    <Link
      className="notlogged-navbar-btn"
      target={"_blank"}
      href={"https://paypal.me/lycoon"}
    >
      Donate
    </Link>
  </div>
);

const SaveStatusNavbar = () => {
  const { saveStatus } = useContext(UserContext);

  switch (saveStatus) {
    case SaveStatus.SAVING:
      return (
        <div className={navbar.saving_spin}>
          <SavingSVG className={settings.icon} />
        </div>
      );
    case SaveStatus.SAVED:
      return <p className={navbar.last_saved}>In sync</p>;
    case SaveStatus.NOT_SAVED:
      return <p className={navbar.last_saved}>Not saved</p>;
    case SaveStatus.ERROR:
      return <p className={navbar.last_saved}>Error</p>;
  }
};

const Navbar = () => {
  const { project, updateSaveStatus, editor, updatePopup } =
    useContext(UserContext);

  const { asPath } = useRouter();
  const page = getCurrentPage(asPath);

  const isDesktop = useDesktop();
  const { data: user } = useUser();

  const onLogOut = async () => {
    await fetch("/api/logout");
    Router.push("/");
  };

  const importFile = () => {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".fountain";

    input.onchange = async (e: any) => {
      const file: File = e.target!.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const confirmImport = () => {
          convertFountainToJSON(e.target.result, editor!);
          updateSaveStatus(SaveStatus.NOT_SAVED);
        };

        updatePopup(() => (
          <PopupImportFile
            closePopup={() => updatePopup(undefined)}
            confirmImport={confirmImport}
          />
        ));
      };
      reader.readAsText(file, "UTF-8");
    };

    input.click();
  };

  let tabs: NavbarTabs = {};
  if (project) {
    tabs = {
      File: [
        { name: "Import...", action: importFile, icon: "import.png" },
        {
          name: "Export",
          action: () => redirectExport(project.id),
          icon: "export.png",
        },
      ],
      Edit: [
        { name: "Project info", action: () => redirectProjectInfo(project.id) },
        { name: "Screenplay", action: () => redirectScreenplay(project.id) },
        { name: "Title page", action: () => redirectTitlePage(project.id) },
        { name: "Story", action: () => redirectStory(project.id) },
      ],
      Production: [
        { name: "Statistics", action: () => redirectStatistics(project.id) },
        { name: "Reports", action: () => redirectReports(project.id) },
      ],
    };
  }

  let NavbarButtons;
  if (user && user.isLoggedIn) {
    // Logged in on web OR desktop app
    NavbarButtons = () => (
      <div className={navbar.btns}>
        {page === PAGE.SCREENPLAY && <SaveStatusNavbar />}
        <SettingsSVG
          className={navbar.btn}
          onClick={redirectSettings}
          alt="Settings icon"
        />
        <LogoutSVG
          className={navbar.btn}
          onClick={onLogOut}
          alt="Logout icon"
        />
      </div>
    );
  } else if (isDesktop) {
    // Not logged in + on desktop app
    NavbarButtons = () => (
      <div className={navbar.btns}>
        <NavbarButton content="Log in" action={redirectLogin} />
      </div>
    );
  } else {
    // Not loggedin + on web
    NavbarButtons = () => <NotLoggedNavbar />;
  }

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  return (
    <Fragment>
      <Container>
        <HeaderWrapper>
          <Link href="/">
            {/* <Image src={Logo} alt="logo" width={65} height={65} /> */}
            <Logo alt="logo" className={navbar.logo} />
          </Link>
          <MenuList>
            <MenuWrapper>
              <Link href="/">
                <MenuLink>My Dashboard</MenuLink>
              </Link>
              <Link href="/">
                <MenuLink>Opportunities</MenuLink>
              </Link>
              <Link href="/">
                <BlankWrapper>
                  <MenuLink>Pitches</MenuLink>
                  {/* <Image src={BlankLogo} alt="blank" width={20} height={20} /> */}
                  <BlankLogo alt="blank" />
                </BlankWrapper>
              </Link>
              <Link href="/">
                <MenuLink>Inbox</MenuLink>
              </Link>
              <Link href="/">
                <MenuLink>Connections</MenuLink>
              </Link>
              <Link href="/">
                <MenuLink>Discuss</MenuLink>
              </Link>
            </MenuWrapper>
          </MenuList>
          <ProfileMenu>
            <ButtonWrapper>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "auto",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Searchs"
                  inputProps={{ "aria-label": "search google maps" }}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                sx={{
                  bgcolor: "#999287",
                  color: "#fff",
                  ":hover": {
                    bgcolor: "#1D1D1D",
                  },
                }}
                startIcon={<PlusIcon />}
              >
                Add New
              </Button>
            </ButtonWrapper>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar alt="Remy Sharp" src="/images/avatar.svg" />
                  </StyledBadge>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </ProfileMenu>
        </HeaderWrapper>
      </Container>
      {/* {showMenu && (
          <div className="md:hidden absolute top-16  bg-black bg-opacity-85 text-white p-4 border-2 border-white">
            <div className="flex justify-center items-center">
              <ul className="text-xs md:flex md:flex-row md:justify-center md:rounded-lg md:text-s md:font-medium gap-[54px] w-auto px-[51px]">
                <li className="py-2">
                  <Link href="/">
                    <span className="md:text-black md:p-0 md:text-lg hover:underline underline-offset-1">
                      My Dashboard
                    </span>
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/">
                    <span className="md:text-black md:p-0 md:text-lg hover:underline underline-offset-1">
                      Opportunities
                    </span>
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/">
                    <span className="md:text-black md:p-0 md:text-lg hover:underline underline-offset-1">
                      Pitches
                    </span>
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/">
                    <span className="md:text-black md:p-0 md:text-lg hover:underline underline-offset-1">
                      Inbox
                    </span>
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/">
                    <span className="md:text-black md:p-0 md:text-lg hover:underline underline-offset-1">
                      Connections
                    </span>
                  </Link>
                </li>
                <li className="py-2">
                  <Link href="/">
                    <span className="md:text-black md:p-0 md:text-lg hover:underline underline-offset-1">
                      Discuss
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )} */}
      <nav
        className={navbar.container + " " + sidebar.shadow}
        style={{ marginTop: "40px" }}
      >
        <div className={navbar.logo_and_tabs}>
          <Link legacyBehavior href="/">
            <a className={navbar.logo}>
              <p className={navbar.logo_text}>Scriptio</p>
            </a>
          </Link>
          {project && (
            <>
              {Object.keys(tabs).map((tabName) => (
                <NavbarTab
                  key={tabName}
                  title={tabName}
                  dropdown={tabs[tabName]}
                />
              ))}
            </>
          )}
        </div>
        <NavbarButtons />
      </nav>
    </Fragment>
  );
};

const Container = styledCom.div`
  position: fixed;
  width: 100%;
  z-index: 50;
  box-shadow: 10px;
  background-color: #fbf6ee;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const HeaderWrapper = styledCom.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 60px;
  margin-right: 60px;
`;

const MenuList = styledCom.div`
  display: flex;
`;

const ProfileMenu = styledCom.div`
  display: flex;
  gap: 20px;
`;

const MenuWrapper = styledCom.div`
  display: flex;
  font-size: 18px;
  flex-flow: row;
  justify-content: center;
  width: auto;
  padding-left: 30px;
  padding-right: 30px;
  gap: 40px;
`;

const MenuLink = styledCom.div`
  color: #000;
  padding: 0px;
  font-size: large;
`;

const BlankWrapper = styledCom.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styledCom.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default Navbar;
