import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public users: Users[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer' + localStorage.getItem('token')
    });

    console.log(headers);

    http.get<Users[]>(baseUrl + 'api/users', { headers: headers }).subscribe(result => {
      this.users = result;
      this.users.forEach(user => user.dob = this.getAge(user.dob));
    }, error => console.error(error));
  }

  getAge(dob):string {
    var date = Date.parse(dob);
    var today = new Date();
    var mili_dif = Math.abs(today.getTime() - date);
    var age = (mili_dif / (1000 * 3600 * 24 * 365.25));
    return Math.floor(age).toString();
  }
}

interface Users {
  firstName: string;
  lastName: number;
  userName: number;
  dob: string;
}
