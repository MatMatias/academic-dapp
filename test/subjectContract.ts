import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { deployContracts } from "scripts/deployContracts";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("SubjectContract", async function () {
  const subjectName: string = "Blockchain";
  const subjectPrice = 20;

  it("Should insert subject if owner", async function () {
    const { subjectContract } = await loadFixture(deployContracts);
    const [_, professor] = await ethers.getSigners();
    await expect(
      subjectContract.insertSubject(
        subjectName,
        professor.address,
        subjectPrice
      )
    )
      .to.emit(subjectContract, "SubjectInserted")
      .withArgs(anyValue, "success");
  });

  it("Should revert with 'NotAuthorized: not owner of the contract' when inserting a new subject if not owner", async function () {
    const [_, professor, otherSigner] = await ethers.getSigners();
    const { subjectContract } = await loadFixture(deployContracts);

    await expect(
      subjectContract
        .connect(otherSigner)
        .insertSubject(subjectName, professor.address, subjectPrice)
    ).to.be.revertedWith("NotAuthorized: not owner of the contract");
  });

  it("Should return subject by id", async function () {
    const { subjectContract } = await loadFixture(deployContracts);
    const [_, professor] = await ethers.getSigners();

    await subjectContract.insertSubject(
      subjectName,
      professor.address,
      subjectPrice
    );
    const subject = await subjectContract.getSubjectById(1);
    expect(subject.id).to.equal(1);
    expect(subject.name).to.equal(subjectName);
    expect(subject.professorAddress).to.equal(professor.address);
  });

  it("Should revert when using a subjectId that does not exist'", async function () {
    const { subjectContract } = await loadFixture(deployContracts);

    const nonExistentSubjectId = 1;

    await expect(
      subjectContract.getSubjectById(nonExistentSubjectId)
    ).to.be.revertedWith(
      "InvalidSubjectId: there are no subjects created with that subject id"
    );
  });

  it("Should revert with 'InvalidSubjectId: subject id must be bigger than 0'", async function () {
    const { subjectContract } = await loadFixture(deployContracts);

    await expect(subjectContract.getSubjectById(0)).to.be.revertedWith(
      "InvalidSubjectId: subject id must be bigger than 0"
    );
  });
});
