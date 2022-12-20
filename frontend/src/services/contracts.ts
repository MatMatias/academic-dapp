import { ethers } from "ethers";
import * as contractAddresses from "../contractAddresses.json";
import * as academicContractArtifact from "../../../artifacts/contracts/AcademicContract.sol/AcademicContract.json";
import * as aCTokenContractArtifact from "../../../artifacts/contracts/ACToken.sol/ACToken.json";
import * as studentContractArtifact from "../../../artifacts/contracts/StudentContract.sol/StudentContract.json";
import * as subjectContractArtifact from "../../../artifacts/contracts/SubjectContract.sol/SubjectContract.json";

const academicContract = new ethers.Contract(
  contractAddresses.academicContract,
  academicContractArtifact.abi
);

const aCTokenContract = new ethers.Contract(
  contractAddresses.aCTokenContract,
  aCTokenContractArtifact.abi
);

const studentContract = new ethers.Contract(
  contractAddresses.studentContract,
  studentContractArtifact.abi
);

const subjectContract = new ethers.Contract(
  contractAddresses.subjectContract,
  subjectContractArtifact.abi
);

const contracts = {
  academic: academicContract,
  aCToken: aCTokenContract,
  student: studentContract,
  subject: subjectContract,
};

export default contracts;
