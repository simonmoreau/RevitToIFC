import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {

  public client_id: string;
  public client_secret: string;
  public submitted: boolean;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log("submitted");
    this.submitted = true;
  }

}
