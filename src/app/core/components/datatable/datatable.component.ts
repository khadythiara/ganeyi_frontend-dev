import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
})
export class DatatableComponent implements OnInit {
  headers = [
    'Logo', 'Nom', 'Description', 'Statut', 'Actions'
  ];

  data = [
    {
      logo: '<img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />',
      nom: 'Ganeyi OCR',
      description: 'Curabitur luctus tortor sed porttitor hendrerit. Aenean tincidunt nunc risus, ac sodales arcu convallis varius. Nullam blandit purus faucibus libero varius tempor. Proin porta sapien eu augue porttitor, sit amet volutpat nisi interdum. Nulla aliquam pretium velit, at dignissim sapien viverra vitae. Sed at nisi vulputate, bibendum neque sed, cursus augue. Nulla risus augue, pulvinar non euismod id, interdum eu sem.',
      statut: '<span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>',
      actions: ''
    },
    {
      logo: '<img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />',
      nom: 'Ganeyi OCR',
      description: 'Curabitur luctus tortor sed porttitor hendrerit. Aenean tincidunt nunc risus, ac sodales arcu convallis varius. Nullam blandit purus faucibus libero varius tempor. Proin porta sapien eu augue porttitor, sit amet volutpat nisi interdum. Nulla aliquam pretium velit, at dignissim sapien viverra vitae. Sed at nisi vulputate, bibendum neque sed, cursus augue. Nulla risus augue, pulvinar non euismod id, interdum eu sem.',
      statut: '<span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>',
      actions: ''
    },
    {
      logo: '<img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />',
      nom: 'Ganeyi OCR',
      description: 'Curabitur luctus tortor sed porttitor hendrerit. Aenean tincidunt nunc risus, ac sodales arcu convallis varius. Nullam blandit purus faucibus libero varius tempor. Proin porta sapien eu augue porttitor, sit amet volutpat nisi interdum. Nulla aliquam pretium velit, at dignissim sapien viverra vitae. Sed at nisi vulputate, bibendum neque sed, cursus augue. Nulla risus augue, pulvinar non euismod id, interdum eu sem.',
      statut: '<span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Active</span>',
      actions: ''
    }
  ]

  constructor() {}

  ngOnInit(): void {}
}
