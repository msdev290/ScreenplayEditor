import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@src/context/UserContext";
import FormInfo, { FormInfoType } from "../../utils/FormInfo";
import { VerificationStatus } from "@src/lib/utils/enums";
import { login } from "@src/lib/utils/requests";

import form from "../../utils/Form.module.css";

type Props = {
  verificationStatus: VerificationStatus;
};

const LoginForm = ({ verificationStatus }: Props) => {
  const { updateUser } = useContext(UserContext);
  const [formInfo, setFormInfo] = useState<FormInfoType | null>(null);

  useEffect(() => {
    switch (verificationStatus) {
      case VerificationStatus.FAILED:
        setFormInfo({
          content: "An error occurred while verifying your account",
          isError: true,
        });
        break;
      case VerificationStatus.SUCCESS:
        setFormInfo({
          content: "Your account has been successfully verified",
        });
        break;
      case VerificationStatus.USED:
        setFormInfo({
          content: "This email has already been registered",
          isError: true,
        });
        break;
    }
  }, []);

  const resetFromInfo = () => {
    setFormInfo(null);
  };

  async function onSubmit(e: any) {
    e.preventDefault();
    resetFromInfo();

    const res = await login(e.target.email.value, e.target.password.value);
    const json = (await res.json()) as any;
    const resBody = json.body;

    if (res.ok) {
      updateUser(resBody);
      Router.push("/");
    } else {
      setFormInfo({ content: json.message, isError: true });
    }
  }

  return (
    <form className={form.home} onSubmit={onSubmit}>
      <div className={form.header}>
        <h1 className={form.heading + " text-5xl text-center"}>Log in</h1>
        <hr />
        {formInfo && <FormInfo info={formInfo} />}
      </div>

      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span>Email</span>
          <input
            className="input input-bordered"
            name="email"
            type="email"
            onChange={resetFromInfo}
            required
          />
        </label>
      </div>

      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span>Password</span>
          <input
            className="input input-bordered"
            name="password"
            type="password"
            onChange={resetFromInfo}
            required
          />
        </label>
      </div>

      <Link href="/recovery">Forgot password?</Link>


      <div className={form.btn_flex}>
        <button className={form.btn} type="submit">
          Log in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
