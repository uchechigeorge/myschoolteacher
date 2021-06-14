import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-class-course-popover',
  templateUrl: './class-course-popover.component.html',
  styleUrls: ['./class-course-popover.component.scss'],
})
export class ClassCoursePopoverComponent implements OnInit {

  @Input() options: { text: string, handler: () => void }[] = [];

  constructor() { }

  ngOnInit() {}

}
