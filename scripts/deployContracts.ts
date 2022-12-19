import { ethers } from "hardhat";

async function deployContracts() {
  const AcademicContractFactory = await ethers.getContractFactory(
    "AcademicContract"
  );
  const academicContract = await AcademicContractFactory.deploy();
  await academicContract.deployed();
  console.log(`Academic contract deployed to ${academicContract.address}`);

  const StudentContractFactory = await ethers.getContractFactory(
    "StudentContract"
  );

  const ACTokenFactory = await ethers.getContractFactory("ACToken");
  const ACToken = await ACTokenFactory.deploy();
  await ACToken.deployed();
  console.log(`ACToken contract deployed to ${ACToken.address}`);

  const studentContract = await StudentContractFactory.deploy(
    academicContract.address,
    ACToken.address
  );

  await studentContract.deployed();
  console.log(`Student contract deployed to ${studentContract.address}`);

  const SubjectContractFactory = await ethers.getContractFactory(
    "SubjectContract"
  );
  const subjectContract = await SubjectContractFactory.deploy(
    academicContract.address,
    studentContract.address,
    ACToken.address
  );
  await subjectContract.deployed();
  console.log(`Subject contract deployed to ${subjectContract.address}`);

  await academicContract.setStudentContractAddress(studentContract.address);
  console.log(
    `Student contract address ${studentContract.address} set on academic contract`
  );
  await academicContract.setSubjectContractAddress(subjectContract.address);
  console.log(
    `Subject contract address ${subjectContract.address} set on academic contract`
  );

  return {
    academicContract,
    ACToken,
    studentContract,
    subjectContract,
  };
}

export { deployContracts };
