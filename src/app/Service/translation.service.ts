import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private translate: TranslateService) {}

  init() {
    // Set the default language
    this.translate.setDefaultLang('en');

    // Use the browser's language or fallback to 'en' if not available
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|fr|ta/) ? browserLang : 'en');
  }

  setLanguage(language: string) {
    this.translate.use(language);
  }
}