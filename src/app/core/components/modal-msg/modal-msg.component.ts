import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-msg',
  templateUrl: './modal-msg.component.html',
  styleUrls: ['./modal-msg.component.css'],
})


export class ModalMsgComponent implements OnInit {
  @Input() message = '';
  @Input() redirectionUrl = '';
  public showMsg = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public switchModal() {
    this.showMsg = !this.showMsg
    this.router.navigate([this.redirectionUrl])
  }

}
