import { ethers } from "hardhat";
import fs from "fs";

async function deployContracts() {
  const AcademicCertificateFactory = await ethers.getContractFactory(
    "AcademicCertificate"
  );
  const academicCertificateContract = await AcademicCertificateFactory.deploy();
  await academicCertificateContract.deployed();
  console.log(
    `Academic certificate contract deployed to ${academicCertificateContract.address}`
  );

  const AcademicContractFactory = await ethers.getContractFactory(
    "AcademicContract"
  );
  const academicContract = await AcademicContractFactory.deploy(
    academicCertificateContract.address
  );
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

  const contractAddresses = {
    academicContract: academicContract.address,
    aCTokenContract: ACToken.address,
    studentContract: studentContract.address,
    subjectContract: subjectContract.address,
  };

  fs.writeFile(
    "./contractAddresses.json",
    JSON.stringify(contractAddresses, null, 4),
    function (err) {
      if (err) {
        throw err;
      }
      console.log(
        "Contract Addresses written to contractAddresses.json on the root directory."
      );
    }
  );

  return {
    academicContract,
    ACToken,
    studentContract,
    subjectContract,
  };
}

deployContracts();

export { deployContracts };
