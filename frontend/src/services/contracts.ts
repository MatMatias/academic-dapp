import { ethers } from "ethers";
import provider from "./provider";
const contractAddresses = require("../../../contractAddresses.json");
const academicContractArtifact = require("../../../artifacts/contracts/AcademicContract.sol/AcademicContract.json");
const aCTokenContractArtifact = require("../../../artifacts/contracts/ACToken.sol/ACToken.json");
const studentContractArtifact = require("../../../artifacts/contracts/StudentContract.sol/StudentContract.json");
const subjectContractArtifact = require("../../../artifacts/contracts/SubjectContract.sol/SubjectContract.json");

const academicContract = new ethers.Contract(
  contractAddresses.academicContract,
  academicContractArtifact.abi,
  provider
);

const aCTokenContract = new ethers.Contract(
  contractAddresses.aCTokenContract,
  aCTokenContractArtifact.abi,
  provider
);

const studentContract = new ethers.Contract(
  contractAddresses.studentContract,
  studentContractArtifact.abi,
  provider
);

const subjectContract = new ethers.Contract(
  contractAddresses.subjectContract,
  subjectContractArtifact.abi,
  provider
);

const contracts = {
  academic: academicContract,
  aCToken: aCTokenContract,
  student: studentContract,
  subject: subjectContract,
};

export default contracts;
