import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RequestResult } from 'src/app/core/models/RequestResults';

@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.component.html',
  styleUrls: ['./results-view.component.css']
})
export class ResultsViewComponent implements OnInit {

  @Input()
  result!: RequestResult;

  @Output() onClose = new EventEmitter<boolean>();

  resultJson: string = '';
  downloadFile: any = '';

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.result.id = this.result.id?.slice(0, 3) + '...' + this.result.id?.slice(this.result.id.length - 4, this.result.id.length)
    this.result.value = this.result.value?.slice(0, 6) + '...' + this.result.value?.slice(this.result.value.length - 6, this.result.value.length)
    this.downloadFile = this._sanitizer.bypassSecurityTrustResourceUrl(`data:text/json;charset=UTF-8, ${JSON.stringify(this.result.jsonValue.jsonFinal)}`)
    this.resultJson = JSON.stringify(this.result)
  }

  closeModal(value: boolean) {
    this.onClose.emit(value);
  }

}
