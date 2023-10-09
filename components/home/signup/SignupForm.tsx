import { useState } from "react";
import { ERROR_PASSWORD_MATCH } from "@src/lib/messages";
import FormInfo, { FormInfoType } from "../../utils/FormInfo";
import { signup } from "@src/lib/utils/requests";

import form from "../../utils/Form.module.css";

const SignupForm = () => {
  const [formInfo, setFormInfo] = useState<FormInfoType | null>(null);

  const resetFromInfo = () => {
    setFormInfo(null);
  };

  async function onSubmit(e: any) {
    e.preventDefault();
    resetFromInfo();

    const email = e.target.email.value;
    const pwd1 = e.target.pwd1.value;
    const pwd2 = e.target.pwd2.value;

    if (pwd1 !== pwd2) {
      setFormInfo({ content: ERROR_PASSWORD_MATCH, isError: true });
      return;
    }

    const res = await signup(email, pwd1);
    const json = await res.json();

    setFormInfo({ content: json.message, isError: !res.ok });
  }

  return (
    <form className={form.home} onSubmit={onSubmit}>
      <div className={form.header}>
        <h1 className={form.heading + " text-5xl text-center"}>Sign up</h1>
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
            name="pwd1"
            type="password"
            onChange={resetFromInfo}
            required
          />
        </label>

      </div>

      <div className="form-control">
        <label className="input-group input-group-vertical">
          <span>Confirm Password</span>
          <input
            className="input input-bordered"
            name="pwd2"
            type="password"
            onChange={resetFromInfo}
            required
          />
        </label>
      </div>
      <div className={form.btn_flex}>
        <button className={form.btn} type="submit">
          Sign up
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
