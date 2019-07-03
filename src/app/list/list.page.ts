import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private places: any;
  private lat: any;
  private long: any;
  private place: any;
  public items: Array<{ title: string; cat: string; nota: string; dist: string; }> = [];


  distancia(lat1, lon1, lat2, lon2) {
  const R = 6378.137; // Radio de la tierra en km
  const dLat = ( lat2 - lat1 ) * Math.PI / 180;
  console.log(dLat);
  const dLong = ( lon2 - lon1 ) * Math.PI / 180;
  console.log(dLong);
    // tslint:disable-next-line:max-line-length
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos((lat2) * Math.PI / 180) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  console.log(a);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log(c);
  const d = R * c;
  console.log(R);
  return d.toFixed(3); // Retorna tres decimales
  }

  constructor(private http: HTTP, private geolocation: Geolocation) {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.long = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    this.http.get('http://127.0.0.1:8000/api/places', {}, {})
          .then(data => {
            this.places = data.data;
            this.place = this.places.slice(1, -1);

            this.place = JSON.parse(this.place);
            this.items.push({
              title: String(this.place.name),
              nota:  String(this.place.nota),
              dist: String(this.distancia(this.place.lat, this.place.long, this.lat, this.long) + 'KM'),
              cat: String(this.place.category)
            });


          })
          .catch(error => {
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
          });



  }




  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
