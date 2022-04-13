import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cidade } from 'src/app/models/Cidade';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  url : string = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/distritos";

  constructor(private http : HttpClient) { }
  
  getAllCidades(uf : string) : Observable<Cidade[]>{
    return this.http.get<Cidade[]>(this.url.replace("{UF}", uf))
  }
  



}
