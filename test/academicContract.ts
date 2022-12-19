import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { deployContracts } from "scripts/deployContracts";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Stage } from "./enums";

describe("AcademicContract", async function () {
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

  describe("Insert grade", function () {
    const studentId = 1;
    const studentName = "Jane Doe";
    const subjectId = 1;
    const grade = 1000;

    it("Should a professor from the specific subject be able to insert a grade on that specific subject", async function () {
      const { academicContract, studentContract, subjectContract } =
        await loadFixture(deployContracts);
      const [_, professor] = await ethers.getSigners();

      await studentContract.insertStudent(studentName);
      await subjectContract.insertSubject("Blockchain", professor.address);
      await subjectContract.setStudentBySubject(subjectId, studentId);
      await academicContract.setGradeLaunchStage();
      await expect(
        await academicContract
          .connect(professor)
          .insertGrade(studentId, subjectId, grade)
      )
        .to.emit(academicContract, "GradeInserted")
        .withArgs(studentId, subjectId, grade, "GradeInserted");
    });
  });

  describe("Excpetions", function () {
    const studentId = 1;
    const studentName = "Jane Doe";
    const subjectId = 1;
    const grade = 1000;

    it("Should revert when a professor from subject 'X' sets a grade on subject 'Y'", async function () {
      const { academicContract, studentContract, subjectContract } =
        await loadFixture(deployContracts);
      const [_, blockchainProfessor, mathematicsProfessor] =
        await ethers.getSigners();
      const blockchainSubjectId = 1;

      await studentContract.insertStudent(studentName);
      await subjectContract.insertSubject(
        "Blockchain",
        blockchainProfessor.address
      );
      await subjectContract.setStudentBySubject(subjectId, studentId);
      await subjectContract.insertSubject(
        "Mathematics",
        mathematicsProfessor.address
      );
      await academicContract.setGradeLaunchStage();
      await expect(
        academicContract
          .connect(mathematicsProfessor)
          .insertGrade(studentId, blockchainSubjectId, grade)
      ).to.be.revertedWith(
        "NotAuthorized: only professor from the specific subject can insert grades"
      );
    });

    it("Should revert when a professor from the specific subject sets a grade with more or less than four digits", async function () {
      const { academicContract, studentContract, subjectContract } =
        await loadFixture(deployContracts);
      const [_, professor] = await ethers.getSigners();
      const invalidGrade = 1001;

      await studentContract.insertStudent(studentName);
      await subjectContract.insertSubject("Blockchain", professor.address);
      await subjectContract.setStudentBySubject(subjectId, studentId);
      await academicContract.setGradeLaunchStage();
      await expect(
        academicContract
          .connect(professor)
          .insertGrade(studentId, subjectId, invalidGrade)
      ).to.be.revertedWith(
        "InvalidGradeDigits: grade must be smaller than 1000. The last two digits are the decimal part"
      );
    });

    it("Should revert when a professor sets a grade outside of the set grade launch stage", async function () {
      const { academicContract, studentContract, subjectContract } =
        await loadFixture(deployContracts);
      const [_, professor] = await ethers.getSigners();

      await studentContract.insertStudent(studentName);
      await subjectContract.insertSubject("Blockchain", professor.address);
      await subjectContract.setStudentBySubject(subjectId, studentId);
      await expect(
        academicContract
          .connect(professor)
          .insertGrade(studentId, subjectId, grade)
      ).to.be.revertedWith("InvalidStage: not on grade launch stage");
    });
  });

  describe("List grades by subject", function () {
    const firstStudentId = 1;
    const secondStudentId = 2;
    const subjectId = 1;
    const firstStudentName = "Jane Doe";
    const secondStudentName = "John Doe";
    const firstStudentGrade = 1000;
    const secondStudentGrade = 850;

    it("Should list grades by subject for a valid subject id", async function () {
      const { academicContract, studentContract, subjectContract } =
        await loadFixture(deployContracts);
      const [_, professor] = await ethers.getSigners();

      await studentContract.insertStudent(firstStudentName);
      await studentContract.insertStudent(secondStudentName);
      await subjectContract.insertSubject("Blockchain", professor.address);
      await subjectContract.setStudentBySubject(subjectId, firstStudentId);
      await subjectContract.setStudentBySubject(subjectId, secondStudentId);
      await academicContract.setGradeLaunchStage();
      await academicContract
        .connect(professor)
        .insertGrade(firstStudentId, subjectId, firstStudentGrade);
      await academicContract
        .connect(professor)
        .insertGrade(secondStudentId, subjectId, secondStudentGrade);

      const resp = await academicContract.listGradesBySubjectId(subjectId);
      expect(resp[0][0].name).to.equal(firstStudentName);
      expect(resp[1][0]).to.equal(1000);
      expect(resp[0][1].name).to.equal(secondStudentName);
      expect(resp[1][1]).to.equal(secondStudentGrade);
    });

    describe("Exceptions", async function () {
      it("Should revert when given an invalid subject id", async function () {
        const { academicContract, studentContract, subjectContract } =
          await loadFixture(deployContracts);
        const [_, professor] = await ethers.getSigners();
        const invalidSubjectId = 0;

        await studentContract.insertStudent(firstStudentName);
        await studentContract.insertStudent(secondStudentName);
        await subjectContract.insertSubject("Blockchain", professor.address);
        await subjectContract.setStudentBySubject(subjectId, firstStudentId);
        await subjectContract.setStudentBySubject(subjectId, secondStudentId);
        await academicContract.setGradeLaunchStage();
        await academicContract
          .connect(professor)
          .insertGrade(firstStudentId, subjectId, firstStudentGrade);
        await academicContract
          .connect(professor)
          .insertGrade(secondStudentId, subjectId, secondStudentGrade);

        await expect(
          academicContract.listGradesBySubjectId(invalidSubjectId)
        ).to.be.revertedWith(
          "InvalidSubjectId: subject id must be bigger than 0"
        );
      });

      it("Should revert when given an subject id that was not registered", async function () {
        const { academicContract, studentContract, subjectContract } =
          await loadFixture(deployContracts);
        const [_, professor] = await ethers.getSigners();
        const nonExistentSubjectId = 2;

        await studentContract.insertStudent(firstStudentName);
        await studentContract.insertStudent(secondStudentName);
        await subjectContract.insertSubject("Blockchain", professor.address);
        await subjectContract.setStudentBySubject(subjectId, firstStudentId);
        await subjectContract.setStudentBySubject(subjectId, secondStudentId);
        await academicContract.setGradeLaunchStage();
        await academicContract
          .connect(professor)
          .insertGrade(firstStudentId, subjectId, firstStudentGrade);
        await academicContract
          .connect(professor)
          .insertGrade(secondStudentId, subjectId, secondStudentGrade);

        await expect(
          academicContract.listGradesBySubjectId(nonExistentSubjectId)
        ).to.be.revertedWith(
          "InvalidSubjectId: there are no subjects created with that subject id"
        );
      });
    });
  });
});
