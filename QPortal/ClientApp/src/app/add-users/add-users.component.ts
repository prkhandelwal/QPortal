import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'add-users',
  templateUrl: './add-users.component.html',
})
export class AddUsersComponent {

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router) {
    this._http = http;
    this._baseUrl = baseUrl;
  }

  private _http: HttpClient;
  private _baseUrl: string;
  public userDetails: UserDetails = new UserDetails();
  public fileList: FileList;
  public errorMessage: string;

  onSubmit() {
    var isUsernameValid = this.validateUsername(this.userDetails.userName);
    if (isUsernameValid) {
      this.userDetails.dob = this.formatdate(this.userDetails.dob);
      console.log(this.userDetails);
      this._http.post<Users>(this._baseUrl + "api/users", this.userDetails).subscribe(result => {
        console.log(result);
        this.router.navigate(['/fetch-data']);
      }, error => {
        console.log(error);
        this.errorMessage = "Invalid form details";
      })
    }
  }

  onUpload() {
    console.log("Upload clicked");
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);

      const headers = new HttpHeaders({
        'Authorization': 'Bearer' + localStorage.getItem('token')
      });
      console.log("Posting");
      console.log(this._baseUrl + "api/users/uploadcsv");
      this._http.post(this._baseUrl + "api/users/uploadcsv", formData, { headers: headers }).subscribe(result => {
        console.log("Uploaded");
        this.router.navigate(['/fetch-data']);
      }, error => {
          console.log("Error");
          this.errorMessage = "Some error in uploading";
      });
    }
  }

  fileChange(event) {
    this.fileList = event.target.files;
    console.log(this.fileList.length);
  }

  formatdate(dateString): string {
    var date = new Date(dateString);
    var res = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
    console.log(res);
    return res;
  }

  validateUsername(username): boolean {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(username) == false) {
      this.errorMessage += " Invalid username";
      return false;
    }

    return true;
  }
}

interface Users {
  firstName: string;
  lastName: number;
  userName: number;
  dob: string;
}

class UserDetails{
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  addeess: string;
  dob: string;
  isAdmin: boolean = false;
}
