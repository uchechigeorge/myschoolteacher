import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideHeaderDirective } from './hide-header.directive';
import { CurrencyInputDirective } from './currency-input.directive';



@NgModule({
  declarations: [
    HideHeaderDirective,
    CurrencyInputDirective,
  ],
  exports: [
    HideHeaderDirective,
    CurrencyInputDirective,
  ],
  imports: [
    CommonModule
  ]
})
export class SharedDirectivesModule { }
