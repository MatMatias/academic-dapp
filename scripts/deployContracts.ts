import { ethers } from "hardhat";

async function deployContracts() {
  const AcademicContractFactory = await ethers.getContractFactory(
    "AcademicContract"
  );
  const academicContract = await AcademicContractFactory.deploy();
  await academicContract.deployed();
  // console.log(`Academic contract deployed to ${academicContract.address}`);

  const StudentContractFactory = await ethers.getContractFactory(
    "StudentContract"
  );
  const studentContract = await StudentContractFactory.deploy(
    academicContract.address
  );
  await studentContract.deployed();
  // console.log(`Student contract deployed to ${studentContract.address}`);

  const SubjectContractFactory = await ethers.getContractFactory(
    "SubjectContract"
  );
  const subjectContract = await SubjectContractFactory.deploy(
    academicContract.address
  );
  await subjectContract.deployed();
  // console.log(`Subject contract deployed to ${subjectContract.address}`);

  return {
    academicContract,
    studentContract,
    subjectContract,
  };
}

export { deployContracts };
