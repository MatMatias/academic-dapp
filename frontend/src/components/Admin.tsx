import type { JsonRpcSigner } from "@ethersproject/providers";
import { useEffect, useState, Fragment, SyntheticEvent } from "react";
import contracts from "../services/contracts";
import { AcademicPhases } from "../enums";

const Admin = ({ signer }: { signer: JsonRpcSigner }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [studentName, setStudentName] = useState<string>("");
  const [studentPublicKey, setStudentPublicKey] = useState<string>("");

  const [subjectName, setSubjectName] = useState<string>("");
  const [professorPublicKey, setProfessorPublicKey] = useState<string>("");
  const [subjectPrice, setSubjectPrice] = useState<number | undefined>();

  const [studentId, setStudentId] = useState<number | undefined>();
  const [subjectId, setSubjectId] = useState<number | undefined>();

  const [academicPhase, setAcademicPhase] = useState<AcademicPhases>(
    AcademicPhases.STUDENT_REGISTRATION
  );

  const [subjectToBeCheckedId, setSubjectToBeCheckedId] = useState<
    number | undefined
  >();
  const [gradesBySubject, setGradesBySubject] = useState<any>();

  const formattedGrades: {
    studentName: string;
    studentAddress: string;
    grade: number;
  }[] = [];

  if (gradesBySubject) {
    for (let i = 0; i < gradesBySubject[0].length; ++i) {
      const studentName = gradesBySubject[0][i][1];
      const studentAddress = gradesBySubject[0][i][2];
      const grade = gradesBySubject[1][i];
      const formattedGrade: {
        studentName: string;
        studentAddress: string;
        grade: number;
      } = {
        studentName: studentName,
        studentAddress: studentAddress,
        grade: grade,
      };
      formattedGrades.push(formattedGrade);
    }
  }

  useEffect(() => {
    (async () => {
      const _academicPhase = await contracts.academic.stage();

      if (_academicPhase === AcademicPhases.STUDENT_REGISTRATION) {
        setAcademicPhase(AcademicPhases.STUDENT_REGISTRATION);
      }

      if (_academicPhase === AcademicPhases.GRADE_LAUNCH) {
        setAcademicPhase(AcademicPhases.GRADE_LAUNCH);
      }

      setIsLoading(false);
    })();
  }, []);

  if (!isLoading) {
    return (
      <Fragment>
        <header>
          <h1>Admin panel</h1>
        </header>
        <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <section
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.25rem" }}
            >
              <h3>Change Academic Phase</h3>
              <select
                value={academicPhase}
                onChange={(evt) => {
                  setAcademicPhase(Number.parseInt(evt.target.value));
                }}
              >
                <option value={AcademicPhases.STUDENT_REGISTRATION}>
                  Student Registration
                </option>
                <option value={AcademicPhases.GRADE_LAUNCH}>
                  Grades Launch
                </option>
              </select>
              <button
                onClick={async () => {
                  if (academicPhase === AcademicPhases.STUDENT_REGISTRATION) {
                    await contracts.academic
                      .connect(signer)
                      .setStudentRegistrationStage();
                  }

                  if (academicPhase === AcademicPhases.GRADE_LAUNCH) {
                    await contracts.academic
                      .connect(signer)
                      .setGradeLaunchStage();
                  }

                  alert("Academic Stage Changed!");
                }}
              >
                Change
              </button>
            </div>
          </section>

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
          <section>
            <h3>Set Student on Subject</h3>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
              onSubmit={async (evt: SyntheticEvent) => {
                evt.preventDefault();
                await contracts.subject
                  .connect(signer)
                  .setStudentBySubject(subjectId, studentId);
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <label>Student Id</label>
                <input
                  type="text"
                  onChange={(evt) =>
                    setStudentId(Number.parseInt(evt.target.value))
                  }
                />
              </div>
              <button>Set Student on Subject</button>
            </form>
          </section>

          <section
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <h2>Consultations</h2>
            {formattedGrades.length > 0 && (
              <ul>
                {formattedGrades.map((formattedGrade, index) => {
                  return (
                    <li key={index}>
                      <p>Student address: {formattedGrade.studentAddress}</p>
                      <p>Student name: {formattedGrade.studentName}</p>
                      <p>Grade: {formattedGrade.grade}</p>
                    </li>
                  );
                })}
              </ul>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
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
  } else {
    return <h1>LOADING</h1>;
  }
};

export default Admin;
