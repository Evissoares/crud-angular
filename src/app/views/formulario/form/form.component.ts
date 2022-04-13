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


  cidade : string = ""
  estado : string = ""
  nome : string = ""
  email : string = ""
  telefone : string = ""

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

  // 
  existe = false;


  estatisticas: any[] = [];

  constructor(
    private apiCidade: CidadeService,
    private apiPessoa: PessoaService,
    private formBuilder: FormBuilder
  ) { }

  formulario = new FormGroup({

      cidade: new FormControl(this.cidade, [Validators.required]),
      estado: new FormControl(this.estado, [Validators.required, Validators.pattern("[a-zA-Z]*")]),
      nome: new FormControl(this.nome),
      email: new FormControl(this.email, [Validators.required, Validators.email]),
      telefone: new FormControl(this.telefone, [Validators.required, Validators.pattern("\\d+")]),

    })

  ngOnInit(): void {

    

    this.getAllPessoas();

  }


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

    // caso os campos do formulário estejam inválidos, finaliza a execução da chamada do método
    if (this.formulario.invalid) {
      return;
    }

    // retorna o indice da lista a partir de uma expressão booleana passada na arrow function ou -1 caso a condição seja falsa
    let indice = this.listaPessoas.findIndex(linhaJson => {
      linhaJson.nome == this.pessoa.nome
    });

    // caso a condição do findIndex seja falsa, o -1 garante que não existe o nome na lista de pessoas, permitindo que seja persistido uma nova pessoa na lista com nome único
    if (indice == -1) {

      // atribui os valores do formulário para a variável pessoa
      this.pessoa = this.formulario.value

      // invoca a função post do serviço de pessoas e persiste os dados no json, atualiza a lista de pessoas cadastradas e soma a quantidade de pessoas por estado na lista de estatísticas 
      this.apiPessoa.post(this.pessoa).subscribe(pessoa => {
        this.listaPessoas.push(pessoa)
        this.somarPessoaPorEstado(pessoa)
      });

    }

  }

  atualizar(i: number) {
    this.pessoa = this.formulario.value
    return this.apiPessoa.put(this.pessoa).subscribe()
  }

  deletar() {

    this.apiPessoa.delete(new Pessoa()).subscribe()

  }

  editar() {
    console.log("Editando campos")
  }

  cancelar() {
    this.editarCampos = !this.editarCampos
  }


  selecionar(i: number) {
    this.editarCampos = true
    this.pessoa = this.listaPessoas[i]
    console.table(this.pessoa)
    this.apiCidade.getAllCidades(this.pessoa.estado).subscribe()
    this.formulario = new FormGroup({
      
      cidade : new FormControl(this.pessoa.cidade),
      estado : new FormControl(this.pessoa.estado),
      nome : new FormControl(this.pessoa.nome),
      email : new FormControl(this.pessoa.email),
      telefone : new FormControl(this.pessoa.telefone)

    })
   
  }

  getAllPessoas() {
    this.apiPessoa.get().subscribe(pessoa => {
      this.listaPessoas = pessoa;
      this.contarPessoasPorEstado();
    })
  }

  getCidades() {
    if (this.formulario.value.estado !== null) {
      this.apiCidade.getAllCidades(this.formulario.value.estado).subscribe(cidades => this.cidades = cidades)
    }
  }






}
