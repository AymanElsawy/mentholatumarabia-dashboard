import { Component, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { FAQ_EDITOR_CONFIG } from '../../constants/single-product-faq.constants';

@Component({
  selector: 'app-faq-form',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, InputTextModule, EditorModule, ButtonModule],
  templateUrl: './faq-form.component.html'
})
export class FaqFormComponent {
  visible = model<boolean>(false);
  mode = input<'add' | 'edit'>('add');
  submitting = input<boolean>(false);
  faqForm = input.required<FormGroup>();
  save = output<void>();
  

  editorConfig = FAQ_EDITOR_CONFIG;

  isInvalid(controlName: string): boolean {
    const control = this.faqForm().get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  submit() {
    this.save.emit();
  }
}
