import { useState, useEffect } from "react";
import provider from "../services/provider";
import contracts from "../services/contracts";
import $ from 'jquery';
import {Fragment} from 'react';

const Home = () => {
  useEffect(() => {
    async function connect() {
      await provider.send("eth_requestAccounts", []);
      console.log(await provider.getNetwork());

      const signer = provider.getSigner();
      console.log(await signer.getAddress());

      console.log(await contracts.academic.owner()); 
    }
    
    connect();
  }, []);

        //Funções
        async function inserirAluno() {
          const signer = provider.getSigner();
          var nomeAluno = document.getElementById('nomeAluno') as HTMLInputElement;
          var adressAluno = document.getElementById('adressAluno') as HTMLInputElement;
          await contracts.student
          .connect(signer)
          .insertStudent(nomeAluno.value, adressAluno.value);
        }
    
    
        async function inserirDisciplina() {
          const signer = provider.getSigner();
          var disciplina = document.getElementById('disciplina') as HTMLInputElement;
          var adressProfessor = document.getElementById('adressProfessor') as HTMLInputElement;
          var price = document.getElementById('price') as HTMLInputElement;
          await contracts.subject
          .connect(signer)
          .insertSubject(disciplina.value, adressProfessor.value, price.value);
        }
    
        async function inserirAlunoDisciplina() {
          const signer = provider.getSigner();
          var idDisciplina = document.getElementById('idDisciplina') as HTMLInputElement;
          var idAluno = document.getElementById('idAluno') as HTMLInputElement;
          await contracts.subject
          .connect(signer)
          .setStudentBySubject(idDisciplina.value, idAluno.value);
        }
    
        async function lancarNotas() {
          const signer = provider.getSigner();
          var idAlunoNota = document.getElementById('idAlunoNota') as HTMLInputElement;
          var idDisciplinaNota = document.getElementById('idDisciplinaNota') as HTMLInputElement;
          var nota = document.getElementById('nota') as HTMLInputElement;
          await contracts.academic
          .connect(signer)
          .insertGrade(idAlunoNota.value, idDisciplinaNota.value, nota.value);
        }
    
        async function emitirCertificado() {
          const signer = provider.getSigner();
          var idAlunoCert = document.getElementById('idAlunoCert') as HTMLInputElement;
          var token = document.getElementById('token') as HTMLInputElement;
          await contracts.academic
          .connect(signer)
          .awardCertificate(idAlunoCert.value);
        }

  return <Fragment>

    <h1 className="page-header">DApp para um sistema acadêmico descentralizado - Nicholas Capone e Matheus Matias</h1>

    <div className="row">
      <div>
        <h3 className="sub-header">Cadastrar Aluno</h3>
        <form className="form-inline" role="form">
          <div className="form-group">
            <table>
            <tbody>
              <tr>
                <td><label htmlFor="nomeAluno">Nome:</label> </td>
                <td>
                  <input className="form-control" id="nomeAluno"/>
                </td>
                <td><label htmlFor="adressAluno">Adress:</label> </td>
                <td>
                  <input className="form-control" id="adressAluno"/>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <a href="#" onClick={() => inserirAluno()} className="btn btn-primary">Enviar</a>
        </form>
      </div>
    </div>

    <div className="row">
        <div>
          <h3 className="sub-header">Cadastrar Disciplina</h3>
          <form className="form-inline" role="form">
            <div className="form-group">
              <table>
                <tbody>
                <tr>
                  <td><label htmlFor="disciplina">Disciplina:</label> </td>
                  <td>
                    <input className="form-control" id="disciplina"/>
                  </td>
                  <td><label htmlFor="adressProfessor">Adress Professor:</label> </td>
                  <td>
                    <input className="form-control" id="adressProfessor"/>
                  </td>
                  <td><label htmlFor="price">Preço:</label> </td>
                  <td>
                    <input className="form-control" id="price"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <a href="#" onClick={() => inserirDisciplina()} className="btn btn-primary">Enviar</a>
          </form>
        </div>
      </div>

      <div className="row">
        <div>
          <h3 className="sub-header">Inscrever Aluno na Disciplina</h3>
          <form className="form-inline" role="form">
            <div className="form-group">
              <table>
                <tbody>
                <tr>
                  <td><label htmlFor="idDisciplina">idDisciplina:</label> </td>
                  <td>
                    <input className="form-control" id="idDisciplina"/>
                  </td>
                  <td><label htmlFor="idAluno">idAluno:</label> </td>
                  <td>
                    <input className="form-control" id="idAluno"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <a href="#" onClick={() => inserirAlunoDisciplina()} className="btn btn-primary">Enviar</a>
          </form>
        </div>
      </div>

      <div className="row">
        <div>
          <h3 className="sub-header">Lançar Notas</h3>
          <form className="form-inline" role="form">
            <div className="form-group">
              <table>
                <tbody>
                <tr>
                  <td><label htmlFor="idAlunoNota">idAluno:</label> </td>
                  <td>
                    <input className="form-control" id="idAlunoNota"/>
                  </td>
                  <td><label htmlFor="idDisciplinaNota">idDisciplina:</label> </td>
                  <td>
                    <input className="form-control" id="idDisciplinaNota"/>
                  </td>
                  <td><label htmlFor="nota">Nota:</label> </td>
                  <td>
                    <input className="form-control" id="nota"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <a href="#" onClick={() => lancarNotas()} className="btn btn-primary">Enviar</a>
          </form>
        </div>
      </div>

      <div className="row">
        <div>
          <h3 className="sub-header">Emitir Certificado</h3>
          <form className="form-inline" role="form">
            <div className="form-group">
              <table>
                <tbody>
                <tr>
                  <td><label htmlFor="idAlunoCert">ID Aluno:</label> </td>
                  <td>
                    <input className="form-control" id="idAlunoCert"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <a href="#" onClick={() => emitirCertificado()} className="btn btn-primary">Enviar</a>
          </form>
        </div>
      </div>

    <div id="root"></div>
  </Fragment>;
};

export default Home;
