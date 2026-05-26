import { Component, forwardRef, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';

export interface FileData {
  file?: File;
  url?: string;
  name: string;
  sizeFormatted: string;
  isImage: boolean;
  previewUrl?: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NgClass],
  templateUrl: './file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() accept: string = '*/*';
  @Input() maxFileSizeMB: number = 10;
  @Input() multiple: boolean = false;
  @Input() label: string = 'Upload Files';

  isDragging = signal(false);
  files = signal<FileData[]>([]);
  error = signal<string | null>(null);
  isDisabled = signal(false);

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // CVA
  writeValue(value: any): void {
    if (!value) {
      this.files.set([]);
      return;
    }

    if (Array.isArray(value)) {
      const newFiles = value.map(v => this.parseInitialValue(v)).filter(v => v !== null) as FileData[];
      this.files.set(newFiles);
    } else {
      const parsed = this.parseInitialValue(value);
      this.files.set(parsed ? [parsed] : []);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private parseInitialValue(val: any): FileData | null {
    if (typeof val === 'string') {
      const isImage = val.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) !== null;
      let name = val.split('/').pop() || 'Existing File';
      // remove query params if any
      name = name.split('?')[0];

      return {
        url: val,
        name: name,
        sizeFormatted: 'Unknown Size',
        isImage: isImage,
        previewUrl: val
      };
    } else if (val instanceof File) {
      return this.createFileData(val);
    }
    return null;
  }

  private createFileData(file: File): FileData {
    const isImage = file.type.startsWith('image/');
    return {
      file: file,
      name: file.name,
      sizeFormatted: this.formatBytes(file.size),
      isImage: isImage,
      previewUrl: isImage ? URL.createObjectURL(file) : undefined
    };
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDisabled()) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    if (this.isDisabled()) return;

    if (event.dataTransfer && event.dataTransfer.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
    input.value = '';
  }

  private handleFiles(newFiles: File[]) {
    this.error.set(null);
    const validFiles: File[] = [];
    
    for (const file of newFiles) {
      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        this.error.set(`File ${file.name} exceeds ${this.maxFileSizeMB}MB limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (!this.multiple) {
      this.files.set([this.createFileData(validFiles[0])]);
    } else {
      this.files.update(current => [...current, ...validFiles.map(f => this.createFileData(f))]);
    }

    this.emitChange();
  }

  removeFile(index: number) {
    if (this.isDisabled()) return;
    this.files.update(current => current.filter((_, i) => i !== index));
    this.emitChange();
  }

  removeAll() {
    if (this.isDisabled()) return;
    this.files.set([]);
    this.emitChange();
  }

  private emitChange() {
    this.onTouched();
    const currentFiles = this.files();
    if (currentFiles.length === 0) {
      this.onChange(null);
      return;
    }

    if (this.multiple) {
      this.onChange(currentFiles.map(f => f.file ? f.file : f.url));
    } else {
      this.onChange(currentFiles[0].file ? currentFiles[0].file : currentFiles[0].url);
    }
  }
  
  downloadFile(fileData: FileData) {
     if (fileData.url) {
        window.open(fileData.url, '_blank');
     } else if (fileData.file) {
        const url = URL.createObjectURL(fileData.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileData.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
     }
  }
}
