import Link from "next/link";
import { useState } from "react";
import { sendRecover } from "@src/lib/utils/requests";
import { join } from "@src/lib/utils/misc";

import form from "../../utils/Form.module.css";
import recovery from "./RecoveryForm.module.css";

const RecoveryForm = () => {
    const [sentEmail, setSetSentEmail] = useState(false);

    const onSubmit = async (e: any) => {
        e.preventDefault();

        const email: string = e.target.email.value;
        sendRecover(email);
        setSetSentEmail(true);
    };

    return (
        <form className={form.home} onSubmit={onSubmit}>
            <div className={form.header}>
                <h1 className={"text-center text-5xl " + form.heading}>Recover</h1>
                <hr />
                <div className="alert alert-info rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>
                        If the provided email is linked to an existing account, an email will be sent with a link to recover
                        your password.
                    </span>
                </div>
                {sentEmail && (
                    <p className={join(recovery.info, "segoe")}>
                        The email can take few minutes to arrive. Please check your junk folder if you do not receive
                        it.
                    </p>
                )}
            </div>

            {!sentEmail && (
                <label className="form-control">
                    <span>Email</span>
                    <input className="input input-bordered" name="email" type="email" required />
                </label>
            )}

            <div className={form.btn_flex}>
                {!sentEmail ? (
                    <button className={form.btn} type="submit">
                        Send
                    </button>
                ) : (
                    <Link legacyBehavior href={"/login"}>
                        <a className={form.btn}>Back</a>
                    </Link>
                )}
            </div>
        </form>
    );
};

export default RecoveryForm;
