import contracts from "./contracts";
import { Roles } from "../enums";
import type { BigNumber } from "ethers";

async function checkIfSignerIsProfessor(
  signerAddress: string
): Promise<boolean> {
  const lastSubjectId: BigNumber = await contracts.subject.lastSubjectId();

  for (let subjectId = lastSubjectId.toNumber(); subjectId > 0; --subjectId) {
    const searchedProfessorAddress: string =
      await contracts.subject.getSubjectById(subjectId);
    if (searchedProfessorAddress === signerAddress) {
      return true;
    }
  }

  return false;
}

async function checkIfSignerIsStudent(signerAddress: string): Promise<boolean> {
  const lastStudentId: BigNumber = await contracts.student.lastStudentId();

  for (let studentId = lastStudentId.toNumber(); studentId > 0; --studentId) {
    const searchedStudentAddress: string =
      await contracts.student.getStudentById(studentId);
    if (searchedStudentAddress === signerAddress) {
      return true;
    }
  }

  return false;
}

async function checkIfSignerIsAdmin(signerAddress: string): Promise<boolean> {
  const owner: string = await contracts.academic.owner();
  if (signerAddress === owner) {
    return true;
  }

  return false;
}

export default async function getSignerRole(
  signerAddress: string | undefined
): Promise<number | undefined> {
  if (signerAddress === undefined) {
    return undefined;
  }

  if ((await checkIfSignerIsAdmin(signerAddress)) === true) {
    return Roles.Admin;
  }
  if ((await checkIfSignerIsProfessor(signerAddress)) === true) {
    return Roles.Professor;
  }
  if ((await checkIfSignerIsStudent(signerAddress)) === true) {
    return Roles.Student;
  }
}
