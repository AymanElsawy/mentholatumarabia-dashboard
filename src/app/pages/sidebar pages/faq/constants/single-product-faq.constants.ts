import { Validators } from '@angular/forms';

export const FAQ_EDITOR_CONFIG = {
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],
            [{ list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            ['clean']
        ]
    },
    placeholder: 'Enter your text here...',
    theme: 'snow'
};

export const getFaqFormConfig = (productId: string) => ({
    product_id: [productId],
    question_en: ['', Validators.required],
    question_ar: ['', Validators.required],
    answer_en: ['', Validators.required],
    answer_ar: ['', Validators.required]
});
