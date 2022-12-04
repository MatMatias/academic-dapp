import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

async function deployContracts() {
  const AcademicContractFactory = await hre.ethers.getContractFactory(
    "AcademicContract"
  );
  const academicContract = await AcademicContractFactory.deploy();
  await academicContract.deployed();
  console.log(`Academic contract deployed to ${academicContract.address}`);

  const StudentContractFactory = await hre.ethers.getContractFactory(
    "StudentContract"
  );
  const studentContract = await StudentContractFactory.deploy(
    academicContract.address
  );
  await studentContract.deployed();
  console.log(`Student contract deployed to ${studentContract.address}`);

  const ProfessorContractFactory = await hre.ethers.getContractFactory(
    "ProfessorContract"
  );
  const professorContract = await ProfessorContractFactory.deploy(
    academicContract.address
  );
  await professorContract.deployed();
  console.log(`Professor contract deployed to ${professorContract.address}`);

  const SubjectContractFacotory = await hre.ethers.getContractFactory(
    "SubjectContract"
  );
  const subjectContract = await SubjectContractFacotory.deploy(
    academicContract.address
  );
  await subjectContract.deployed();
  console.log(`Subject contract deployed to ${subjectContract.address}`);

  return {
    academicContract,
    studentContract,
    professorContract,
    subjectContract,
  };
}

describe("AcademicContract", function () {
  it("Should be on student registration stage when deployed", async function () {
    const { academicContract } = await loadFixture(deployContracts);

    expect(academicContract.etapa).to.equal("STUDENT_REGISTRATION");
  });

  it("Should open grades launch stage", async function () {
    const { academicContract } = await loadFixture(deployContracts);

    await expect(academicContract.setGradeLaunchStage()).to.emit(
      "GRADE_LAUNCH",
      "grades launch stage openned"
    );
  });

  it("Should open student registration stage", async function () {
    const { academicContract } = await loadFixture(deployContracts);

    await expect(academicContract.setStudentRegistrationStage()).to.emit(
      "STUDENT_REGISTRATION",
      "student registration stage openned"
    );
  });

  it("Should set student contract address", async function () {
    const { academicContract, studentContract } = await loadFixture(
      deployContracts
    );

    await expect(
      academicContract.setStudentContractAddress(studentContract.address)
    ).to.emit(studentContract.address, "student contract address set");
  });

  it("Should set professor contract address", async function () {
    const { academicContract, professorContract } = await loadFixture(
      deployContracts
    );

    await expect(
      academicContract.setProfessorContractAddress(professorContract.address)
    ).to.emit(professorContract.address, "professor contract address set");
  });

  it("Should set subject contract address", async function () {
    const { academicContract, subjectContract } = await loadFixture(
      deployContracts
    );

    await expect(
      academicContract.setSubjectContractAddress(subjectContract.address)
    ).to.emit(subjectContract.address, "subject contract address set");
  });
});
