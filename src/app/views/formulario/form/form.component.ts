import { ThisReceiver } from '@angular/compiler';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


import { Cidade } from 'src/app/models/Cidade';
import { Estatistica } from 'src/app/models/Estatistica';
import { Pessoa } from 'src/app/models/Pessoa';
import { CidadeService } from 'src/app/services/cidade-service/cidade.service';
import { PessoaService } from 'src/app/services/pessoa-service/pessoa.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class CidadesComponent implements OnInit {

  // carrega os comboboxes com os dados da api a partir da UF passada na requisição
  cidades: Cidade[] = [];
  estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  cidade !: Cidade;
  estado: string = ""
  nome: string = ""
  email: string = ""
  telefone: string = ""
  idSelecionado !: number

  // objeto para atualizar lista de quantidade de pessoas por estado
  estatistica !: Estatistica

  // Carrega a lista de pessoas salvas no json-server
  pessoa: Pessoa = new Pessoa();
  listaPessoas: Pessoa[] = [];

  // muda estado dos botões do crud
  editarCampos: boolean = false;

  // troca os dados do formulário em duas vias

  // valida o botão de submit caso o formulário seja válido
  submitted = false;

  estatisticas: Estatistica[] = [];

  constructor(
    private apiCidade: CidadeService,
    private apiPessoa: PessoaService,
  ) { }

  // Formulário para controle dos campos no HTML
  formulario = new FormGroup({

    cidade: new FormControl(this.cidade, [Validators.required]),
    estado: new FormControl(this.estado, [Validators.required]),
    nome: new FormControl(this.nome, [Validators.required, Validators.pattern("^[a-zA-Zà-úÀ-Ú ]*$")]),
    email: new FormControl(this.email, [Validators.required, Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]),
    telefone: new FormControl(this.telefone, [Validators.required, Validators.pattern("\\d+")]),

  })

  ngOnInit(): void {

    this.getAllPessoas();
  }

  // Aumenta um na contagem de pessoas por estado ou adiciona um card com a estatística do novo estado
  somarPessoaPorEstado(p: Pessoa) {
    for (let i = 0; i < this.estatisticas.length; i++) {
      if (this.estatisticas[i].estado == p.estado) {
        this.estatisticas[i].quantidade++
        return
      }
    }
    this.estatistica = {
      "estado": p.estado,
      "quantidade": 1
    }
    this.estatisticas.push(this.estatistica)
    return

  }

  // diminui um na contagem de pessoas por estado ou remove a estatística daquele estado caso a quantidade seja zero
  subtrairPessoaPorEstado(p: Pessoa) {
    for (let i = 0; i < this.estatisticas.length; i++) {
      if (this.estatisticas[i].quantidade == 1 && this.estatisticas[i].estado == p.estado) {
        this.estatisticas.splice(i, 1)
        return
      }
      if (this.estatisticas[i].estado == p.estado) {
        this.estatisticas[i].quantidade--
        return
      }
    }
  }

  // carrega a contagem de pessoas por estado no ngOnInit
  contarPessoasPorEstado() {
    let estado = "";
    let quantidade = 0;

    for (let i = 0; i < this.estados.length; i++) {
      estado = this.estados[i]

      for (let j = 0; j < this.listaPessoas.length; j++) {

        if (estado == this.listaPessoas[j].estado) {
          quantidade += 1;
        }
      }

      if (quantidade > 0) {
        this.estatisticas.push({
          "estado": estado,
          "quantidade": quantidade
        })
      }

      quantidade = 0;

    }

  }

  // retorna os controles do formulário para as validações dos inputs no html
  get f() {
    return this.formulario.controls;
  }


  // CRUD PESSOAS

  // executa a lógica válida para salvar um cadastro no json
  onSubmit() {

    // sinaliza no ngIf do html que o botão submit foi invocado e habilita as divs com informações sobre os valores aceitos nos campos do formulário
    this.submitted = true;
    return this.formulario.valid

  }

  criar() {

    if (this.onSubmit()) {
      this.pessoa = this.formulario.value
      for (let i = 0; i < this.listaPessoas.length; i++) {
        if (this.listaPessoas[i].nome === this.pessoa.nome) {
          alert("Nome ja cadastrado.")
          return
        }
      }

      // invoca a função post do serviço de pessoas e persiste os dados no json, atualiza a lista de pessoas cadastradas e soma a quantidade de pessoas por estado na lista de estatísticas
      this.apiPessoa.post(this.pessoa).subscribe(pessoa => {
        this.listaPessoas.push(pessoa)
        this.somarPessoaPorEstado(pessoa)
        this.limparFormulario()
      })


    }

  }

  deletar() {

    let aux: Pessoa[] = this.listaPessoas.splice(this.idSelecionado, 1)
    this.apiPessoa.delete(aux[0]).subscribe(pessoa => {
      this.subtrairPessoaPorEstado(this.pessoa),
        this.cancelar()
    });

  }

  editar() {

    let listaAuxiliar: Pessoa[] = this.listaPessoas
    if (this.onSubmit()) {

      let pessoaAntiga: Pessoa = this.pessoa
      let idPessoaAntiga = this.pessoa.id
      console.log("ID JSON" + idPessoaAntiga)
      this.pessoa = this.formulario.value

      if (this.pessoasIguais(pessoaAntiga, this.pessoa)) {
        console.log("IDENTICO")
        this.cancelar()
        return
      }

      listaAuxiliar.splice(this.idSelecionado, 1)
      this.pessoa.id = idPessoaAntiga
      console.log("ID JSON TROCADO" + this.pessoa.id)
      this.apiPessoa.put(this.pessoa).subscribe(pessoa => {

        if (pessoaAntiga.estado === this.pessoa.estado) {

          listaAuxiliar.push(pessoa)
          this.listaPessoas = listaAuxiliar
          this.cancelar()
          return
          // this.somarPessoaPorEstado(pessoa)
          // this.listaPessoas[this.idSelecionado] = pessoa
        } else {
          this.subtrairPessoaPorEstado(pessoaAntiga)
          this.somarPessoaPorEstado(pessoa)
          listaAuxiliar.push(pessoa)
          this.listaPessoas = listaAuxiliar
          this.cancelar()
          return
          // this.listaPessoas[this.idSelecionado] = pessoa
        }

      })
    }


  }

  // Cancela a edição dos dados e esconde as opções de atualização
  cancelar() {
    this.editarCampos = !this.editarCampos
    this.limparFormulario()
  }

  // Seleciona um id na lista e carrega na variavel pessoa para atualizações
  selecionar(i: number) {
    this.editarCampos = true
    this.pessoa = this.listaPessoas[i]
    this.idSelecionado = i
    this.apiCidade.getAllCidades(this.pessoa.estado).subscribe(retorno => {
      this.cidades = retorno;
      this.formulario.controls.nome.setValue(this.pessoa.nome)
      this.formulario.controls.cidade.setValue(this.pessoa.cidade)
      this.formulario.controls.estado.setValue(this.pessoa.estado)
      this.formulario.controls.email.setValue(this.pessoa.email)
      this.formulario.controls.telefone.setValue(this.pessoa.telefone)

    })

  }

  getAllPessoas() {
    this.apiPessoa.get().subscribe(pessoa => {
      this.listaPessoas = pessoa;
      this.contarPessoasPorEstado();
    })
  }

  getCidades() {
    this.formulario.controls.cidade.setValue("")
    if (this.formulario.value.estado !== null) {
      this.apiCidade.getAllCidades(this.formulario.value.estado).subscribe(cidades => this.cidades = cidades)
    }
  }

  limparFormulario() {
    this.formulario.reset()
    this.submitted = false
    this.pessoa = new Pessoa()
    this.idSelecionado = -1
  }

  pessoasIguais(p: Pessoa, p2: Pessoa) {
    return (p.cidade === p2.cidade &&
      p.email === p2.email &&
      p.estado === p2.estado &&
      p.nome === p2.nome &&
      p.telefone === p2.telefone)
  }



}
