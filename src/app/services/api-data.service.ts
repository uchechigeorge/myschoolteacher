import { Injectable } from '@angular/core';
import { ICardDetail } from '../models/list-models';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

 
  public studentCards: ICardDetail[] = [
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Name': 'Abraham Great',
        'Class': 'SS2 A',
        'Offering': 'Physics'
      },
    },
    {
      altImage: "icon",
      showImage: true,
      details: {
        'Name': 'Ade Moses',
        'Class': 'SS2 C',
        'Offering': 'Physics'
      },
    },
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Name': 'Agatha Mercy',
        'Class': 'SS2 C',
        'Offering': 'Maths'
      },
    },
  ]

  public teachersCards: ICardDetail[] = [
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Name': 'Lai Mohammed',
        'Class': 'JS2 A',
        'Subjects': 'Physics'
      },
    },
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Name': 'Obi Laycon',
        'Class': 'Nil',
        'Subjects': 'English +(1 other)'
      },
    },
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Name': 'Ejemba Friday',
        'Class': 'SS2 C',
        'Subjects': 'History  '
      },
    },
  ]

  public classCards: ICardDetail[] = [
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Class': 'JS2 A',
        'Teacher': 'Jitsu Khan',
        'No of Students': '30'
      },
    },
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Class': 'JS3 A',
        'Teacher': 'Obi Kate',
        'No of Students': '50'
      },
    },
    {
      altImage: "icon",
      showImage: true,
      details: { 
        'Class': 'SS2 B',
        'Teacher': 'Ade Oluwa',
        'No of Students': '34'
      },
    },
  ]

  public courseCards: ICardDetail[] = [
    {
      altImage: "text",
      imageText: 'SS2',
      showImage: true,
      details: {
        'Name': 'Physics',
        'Class': 'SS2',
        'Students Offering': '39'
      },
    },
    {
      altImage: "text",
      showImage: true,
      imageText: 'SS2',
      details: { 
        'Name': 'Physics',
        'Class': 'SS1',
        'Students Offering': '33',
      },
    },
    {
      altImage: "text",
      showImage: true,
      imageText: 'SS1',
      details: {
        'Name': 'Math',
        'Class': 'SS1',
        'Students Offering': '54'
      },
    },
  ]

  public teachers: string[] = [
    'Ali Baba',
    'Thierry Henry',
    'N\'golo Kanté',
    'Anayo Harry'
  ]

  public students: string[] = [
    'Abraham Great',
    'Agatha Mercy',
    'Ade Moses',
    'Linus Okere',
  ]

  public classes: { class: string, children?: string[] }[] = [
    {
      class: 'JS 1',
      children: ['JS 1A', 'JS 1B', 'JS 1C']
    },
    {
      class:'JS 2',
      children: ['JS 2A', 'JS 2B', 'JS 2C'],
    },
    {
      class: 'JS 3',
      children: ['JS 3A', 'JS 3B', 'JS 3C'],
    },
    {
      class: 'SS 1',
      children: ['SS 1A', 'SS 1B', 'SS 1C'],
    },
    {
      class: 'SS 2',
      children: ['SS 2A', 'SS 2B', 'SS 2C'],
    },
    {
      class: 'SS 3',
      children: ['SS 3A', 'SS 3B', 'SS 3C'],
    }
  ]

  public courses: { name?: string, class?: string }[] = [
    { name: 'Physics', class: 'SS1' },
    { name: 'Physics', class: 'SS2' },
    { name: 'Physics', class: 'SS3' },
    { name: 'Biology', class: 'SS1' },
    { name: 'Biology', class: 'SS2' },
    { name: 'Biology', class: 'SS3' },
    { name: 'Chemistry', class: 'SS1' },
    { name: 'Chemistry', class: 'SS2' },
    { name: 'Chemistry', class: 'SS3' },
  ]

  constructor() { }

  getTeacherCards() {
    return this.teachersCards;
  }

  getStudentCards() {
    return this.studentCards;
  }

  getCourseCards() {
    return this.courseCards;
  }

  getClassCards() {
    return this.classCards;
  }

  getTeachers() {
    return this.teachers;
  }

  getClasses() {
    return this.classes;
  }

  getCourses() {
    return this.courses;
  }

  getStudents() {
    return this.students;
  }
}
