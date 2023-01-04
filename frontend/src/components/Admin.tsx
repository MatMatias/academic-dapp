import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, Fragment, SyntheticEvent } from "react";
import contracts from "../services/contracts";

const Admin = ({ signer }: { signer: JsonRpcSigner }) => {
  const [studentName, setStudentName] = useState<string>("");
  const [studentPublicKey, setStudentPublicKey] = useState<string>("");

  const [subjectName, setSubjectName] = useState<string>("");
  const [professorPublicKey, setProfessorPublicKey] = useState<string>("");
  const [subjectPrice, setSubjectPrice] = useState<number | undefined>();

  const [subjectToBeCheckedId, setSubjectToBeCheckedId] = useState<
    number | undefined
  >();
  const [gradesBySubject, setGradesBySubject] = useState<unknown | undefined>();

  /* work in progress */
  if (gradesBySubject) {
    console.log("Grades by Subject", gradesBySubject);
  }

  return (
    <Fragment>
      <header>
        <h1>Admin panel</h1>
      </header>
      <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <section>
          <h2>Operations</h2>
          <h3>Register Student</h3>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onSubmit={async (evt: SyntheticEvent) => {
              evt.preventDefault();
              await contracts.student
                .connect(signer)
                .insertStudent(studentName, studentPublicKey);
              alert(`Student created!`);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
              }}
            >
              <label>Name: </label>
              <input
                type="text"
                onChange={(evt) => setStudentName(evt.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
              }}
            >
              <label>Public Key:</label>
              <input
                type="text"
                onChange={(evt) => setStudentPublicKey(evt.target.value)}
              />
            </div>
            <button>Register Student</button>
          </form>

          <h3>Register Academic Subject</h3>
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onSubmit={async (evt: SyntheticEvent) => {
              evt.preventDefault();
              await contracts.subject
                .connect(signer)
                .insertSubject(subjectName, professorPublicKey, subjectPrice);
              alert(`Subject created!`);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
              }}
            >
              <label>Name: </label>
              <input
                type="text"
                onChange={(evt) => setSubjectName(evt.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
              }}
            >
              <label>Professor Public Key:</label>
              <input
                type="text"
                onChange={(evt) => setProfessorPublicKey(evt.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "0.25rem",
              }}
            >
              <label>Price in Academic Tokens (ACT):</label>
              <input
                type="text"
                onChange={(evt) =>
                  setSubjectPrice(Number.parseInt(evt.target.value))
                }
              />
            </div>
            <button>Register Academic Subject</button>
          </form>
        </section>

        <section
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h2>Consultations</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <label>Grades per Subject</label>
            <input
              type="text"
              onChange={(evt) =>
                setSubjectToBeCheckedId(Number.parseInt(evt.target.value))
              }
            />
            <button
              onClick={async () => {
                setGradesBySubject(
                  await contracts.academic.listGradesBySubjectId(
                    subjectToBeCheckedId
                  )
                );
              }}
            >
              Consult
            </button>
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default Admin;
