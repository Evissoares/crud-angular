import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pessoa } from 'src/app/models/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  url:string = "http://localhost:3000/funcionario"
  constructor(private http:HttpClient) { }

  post(p : Pessoa) : Observable<Pessoa>{
    return this.http.post<Pessoa>(this.url, p)
  }

  get() : Observable<Pessoa[]>{
    return this.http.get<Pessoa[]>(this.url)
  }

  put(p : Pessoa) : Observable<Pessoa>{
    return this.http.put<Pessoa>(this.url + "/" + p.id, p)
  }


  delete(p : Pessoa) : Observable<Pessoa>{
    return this.http.delete<Pessoa>(this.url + "/" + p.id)
  }



}
