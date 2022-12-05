import { expect } from "chai";
import { deployContracts } from "scripts/deployContracts";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Stage } from "./enums";

describe("AcademicContract", function () {
  it("Should be on student registration stage when deployed", async function () {
    const { academicContract } = await loadFixture(deployContracts);

    expect(await academicContract.stage()).to.equal(Stage.STUDENT_REGISTRATION);
  });

  it("Should emit event on grades launch stage", async function () {
    const { academicContract } = await loadFixture(deployContracts);

    await expect(academicContract.setGradeLaunchStage())
      .to.emit(academicContract, "SpecificStageSet")
      .withArgs(Stage.GRADE_LAUNCH, "grade registration stage set");
  });

  it("Should emit event on student registration stage", async function () {
    const { academicContract } = await loadFixture(deployContracts);

    await expect(academicContract.setStudentRegistrationStage())
      .to.emit(academicContract, "SpecificStageSet")
      .withArgs(Stage.STUDENT_REGISTRATION, "student registration stage set");
  });

  it("Should set student contract address", async function () {
    const { academicContract, studentContract } = await loadFixture(
      deployContracts
    );

    await expect(
      academicContract.setStudentContractAddress(studentContract.address)
    )
      .to.emit(academicContract, "ContractAddressSet")
      .withArgs(studentContract.address, "child contract address set");
  });

  it("Should set subject contract address", async function () {
    const { academicContract, subjectContract } = await loadFixture(
      deployContracts
    );

    await expect(
      academicContract.setSubjectContractAddress(subjectContract.address)
    )
      .to.emit(academicContract, "ContractAddressSet")
      .withArgs(subjectContract.address, "child contract address set");
  });
});
