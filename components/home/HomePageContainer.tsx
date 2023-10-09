import Router from "next/router";

import page from "./HomePageContainer.module.css";

const HomePageContainer = () => {
  const onLogIn = () => {
    Router.push("/login");
  };

  const onSignUp = () => {
    Router.push("/signup");
  };

  return (
    <div className={page.container}>
      <div className={page.header}>
        <h1 className={page.title + " fade-in"}>ScreenPlay.INK</h1>
        {/* <h2 className={page.desc + " fade-in"}>
          Minimalist tool for perfectionist screenwriters
        </h2> */}
      </div>
      <div className={page.btns + " fade-in"}>
        <button onClick={onSignUp} className={page.btn}>
          Sign up
        </button>
        <button onClick={onLogIn} className={page.btn}>
          Log in
        </button>
      </div>
    </div>
  );
};

export default HomePageContainer;
