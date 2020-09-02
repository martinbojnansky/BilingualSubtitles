import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [],
  exports: [MaterialModule],
})
export class ComponentsModule {}
