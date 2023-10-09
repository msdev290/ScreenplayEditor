import { useState } from "react";
import { getBase64, join } from "@src/lib/utils/misc";
import { ProjectCreation } from "@src/lib/utils/types";
import { FormInfoType } from "../utils/FormInfo";
import { redirectScreenplay } from "@src/lib/utils/redirects";
import { createProject } from "@src/lib/utils/requests";
import { SaveMode } from "@src/lib/utils/enums";
import { useDesktop, useUser } from "@src/lib/utils/hooks";
import UploadButton from "./UploadButton";
import FormHeader from "./FormHeader";
import FormEnd from "./FormEnd";

import form from "../utils/Form.module.css";
import layout from "../utils/Layout.module.css";

type Props = {
    setIsCreating: (isCreating: boolean) => void;
};

const CreateProjectPage = ({ setIsCreating }: Props) => {
    const { data: user } = useUser();
    const isDesktop = useDesktop();

    const [formInfo, setFormInfo] = useState<FormInfoType | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(
        undefined
    );

    const exitCreating = () => {
        setIsCreating(false);
    };

    const resetFormInfo = () => {
        setFormInfo(null);
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        resetFormInfo();

        const body: ProjectCreation = {
            title: e.target.title.value,
            writtenBy: e.target.writtenBy.value,
            description: e.target.description.value,
            saveMode: SaveMode.CLOUD, //TODO: Add save mode to form
        };

        if (selectedFile) {
            body.poster = await getBase64(selectedFile, 686, 1016);
        }

        const res = await createProject(body, isDesktop, user);
        if (res.isError) {
            setFormInfo({ content: res.message!, isError: true });
            return;
        }

        const projectId = res.data!.id;
        setIsCreating(false);
        redirectScreenplay(projectId);
    };

    return (
        <div className={layout.center_row}>
            <form className={form.container} onSubmit={onSubmit}>
                <FormHeader title={"Create project"} formInfo={formInfo} />

                <div className={form.elements}>
                    <label className="input-group input-group-vertical">
                        <span className="text-xl">Title</span>
                        <input
                            name="title"
                            className={" input input-bordered"}
                            onChange={resetFormInfo}
                            required
                        />
                    </label>
                    <label className="input-group input-group-vertical">
                        <span className="text-xl">Written By</span>
                        <input
                            name="writtenBy"
                            className={" input input-bordered"}
                            onChange={resetFormInfo}
                            required
                        />
                    </label>

                    <label className="input-group input-group-vertical">
                        <span className="text-xl">
                            Description-<i> optional</i>
                        </span>
                        <textarea
                            name="description"
                            className="input input-bordered h-40"
                            onChange={resetFormInfo}
                        />
                    </label>
                    <div className={form.element}>
                        <p className="text-xl">
                            Poster - <i>optional</i>
                        </p>
                        <UploadButton
                            setSelectedFile={setSelectedFile}
                            selectedFile={selectedFile}
                        />
                    </div>
                </div>

                <FormEnd submitText={"Create"} onBack={() => exitCreating()} />
            </form>
        </div>
    );
};

export default CreateProjectPage;
