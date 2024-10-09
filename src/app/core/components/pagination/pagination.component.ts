import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input('totalItems') totalItems!: number;
  @Input('currentPage') currentPage!: number;
  @Input('pageSize') pageSize!: number;

  @Output() pageChangeEvent = new EventEmitter<number>();
  @Output() pageSizeChangeEvent = new EventEmitter<number>();

  numberOfPages!: number;

  hasPrev: boolean = false
  hasNext: boolean = false

  constructor() { }

  ngOnInit(): void {
    this.numberOfPages =  Math.ceil(this.totalItems / this.pageSize)
    this.checkPages('');
  }

  counter(i: number) {
    return new Array(i);
  }

  checkPages(side: string) {
    if (side == 'next') this.currentPage++
    else if (side == 'prev') this.currentPage--

    this.hasPrev = this.currentPage > 0
    this.hasNext = (this.currentPage + 1) < this.numberOfPages

    this.pageChangeEvent.emit(this.currentPage)
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.pageSizeChangeEvent.emit(event.target.value)
    this.ngOnInit()
  }

}
