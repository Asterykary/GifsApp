import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root' // Añadido versión 4, Este servicio va a hacer único y de manera global
})
export class GifsService {


  private apikey     : string = 'HQtWymh3r6jxJIbFaAztaavtUfx2XVow';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  private _historial : string[] = [];

  public resultados  : Gif[] = [];

  get historial(){
    
    return [...this._historial];
  }

  constructor(private http: HttpClient) { 
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  buscarGifs(query: string){

    query = query.trim().toLowerCase();
    
    // solo tener únicos
    if(!this._historial.includes(query)){
      // Se inserta si no se incluye
      this._historial.unshift(query);
      
      // limitar la cantidad de inserciones a 10
      this._historial = this._historial.splice(0,10);

      // Guardar información en el localStorage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams().set('api_key', this.apikey).set('limit', '10').set('q', query);


    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params: params})
    .subscribe((response) => {
      this.resultados = response.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    })
    


  }
}
