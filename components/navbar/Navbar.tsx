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

import SavingSVG from "../../public/images/saving.svg";

import settings from "../settings/SettingsPageContainer.module.css";
import navbar from "./Navbar.module.css";
import sidebar from "../editor/sidebar/EditorSidebar.module.css";
import { createSvgIcon } from "@mui/material/utils";

import { styled } from "@mui/material/styles";

import { Badge } from "@mui/material";

import { MdOutlineSettingsSuggest, MdLogout } from "react-icons/md";

import Logo from "@public/images/logo.svg";

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
      return <p className="text-lg text-white uppercase px-3">In sync</p>;
    case SaveStatus.NOT_SAVED:
      return <p className="text-lg text-white uppercase px-3">Not saved</p>;
    case SaveStatus.ERROR:
      return <p className="text-lg text-white uppercase px-3">Error</p>;
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
        <MdOutlineSettingsSuggest
          className="text-3xl text-[#919191]"
          onClick={redirectSettings}
        />
        <MdLogout className="text-3xl text-[#919191]" onClick={onLogOut} />
      </div>
    );
  } else if (isDesktop) {
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

  return (
    <Fragment>
      <nav className={navbar.container + " " + sidebar.shadow + " py-8"}>
        <div className={navbar.logo_and_tabs}>
          <Link href="/">
            {/* <Image src={Logo} alt="logo" width={65} height={65} /> */}
            <Logo alt="logo" className={navbar.logo} />
          </Link>
          {/* {project && (
            <>
              {Object.keys(tabs).map((tabName) => (
                <NavbarTab
                  key={tabName}
                  title={tabName}
                  dropdown={tabs[tabName]}
                />
              ))}
            </>
          )} */}
        </div>
        <NavbarButtons />
      </nav>
    </Fragment>
  );
};
export default Navbar;
