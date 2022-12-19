import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { deployContracts } from "scripts/deployContracts";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("StudentContract", function () {
  const studentName = "Jane Doe";

  it("Should insert new student if owner", async function () {
    const { studentContract } = await loadFixture(deployContracts);
    const [_, student] = await ethers.getSigners();
    await expect(studentContract.insertStudent(studentName, student.address))
      .to.emit(studentContract, "StudentInserted")
      .withArgs(anyValue, "success");
  });

  it("Should revert with 'NotAuthorized: not owner of the contract' when inserting a new student if not owner", async function () {
    const { studentContract } = await loadFixture(deployContracts);
    const [_, otherSigner, student] = await ethers.getSigners();

    await expect(
      studentContract
        .connect(otherSigner)
        .insertStudent(studentName, student.address)
    ).to.be.revertedWith("NotAuthorized: not owner of the contract");
  });

  it("Should return student by id", async function () {
    const { studentContract } = await loadFixture(deployContracts);
    const [_, studentSigner] = await ethers.getSigners();
    await studentContract.insertStudent(studentName, studentSigner.address);
    const student = await studentContract.getStudentById(1);
    expect(student.id).to.equal(1);
    expect(student.name).to.equal(studentName);
  });

  it("Should revert with 'StudentNotFound when using a studentId that does not exist'", async function () {
    const { studentContract } = await loadFixture(deployContracts);

    const nonExistentStudentId = 1;

    await expect(
      studentContract.getStudentById(nonExistentStudentId)
    ).to.be.revertedWith("StudentNotFound");
  });

  it("Should revert with 'InvalidStudentId: student id must be bigger than 0'", async function () {
    const { studentContract } = await loadFixture(deployContracts);

    await expect(studentContract.getStudentById(0)).to.be.revertedWith(
      "InvalidStudentId: student id must be bigger than 0"
    );
  });
});
