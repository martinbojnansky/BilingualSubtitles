import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { IconsModule } from './icons.module';

@NgModule({
  imports: [CommonModule, MaterialModule, IconsModule],
  declarations: [],
  exports: [MaterialModule, IconsModule],
})
export class ComponentsModule {}
