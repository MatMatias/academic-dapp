import type { JsonRpcSigner } from "@ethersproject/providers";
import { Fragment, SyntheticEvent, useState } from "react";
import contracts from "../services/contracts";

const Professor = ({ signer }: { signer: JsonRpcSigner }) => {
  const [studentId, setStudentId] = useState<number | undefined>();
  const [subjectId, setSubjectId] = useState<number | undefined>();

  return (
    <Fragment>
      <header>
        <h1>Professor panel</h1>
      </header>
      <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <h3>Set Student on Subject</h3>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          onSubmit={async (evt: SyntheticEvent) => {
            evt.preventDefault();
            await contracts.subject
              .connect(signer)
              .setStudentBySubjectId(studentId, subjectId);
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <label>Subject Id</label>
            <input
              type="text"
              onChange={(evt) =>
                setSubjectId(Number.parseInt(evt.target.value))
              }
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label>Student Id</label>
            <input
              type="text"
              onChange={(evt) =>
                setStudentId(Number.parseInt(evt.target.value))
              }
            />
          </div>
          <button>Insert grade</button>
        </form>
      </main>
    </Fragment>
  );
};

export default Professor;
