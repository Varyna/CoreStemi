import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer pt-1">
      <div class="row">
        <div class="container info col-auto mt-5">
          <h5 class="text-capitalize fw-bold">
            Частное образовательное учреждение профессионального образования
            «Саянский техникум СТЭМИ»
          </h5>
          <hr class="bg-white d-inline-block mb-4" style="width: 60px; height: 2px;">
          <p class="lh-1"><strong>Юридический адрес:</strong></p>
          <p class="lh-1">Россия, Республика Хакасия, г. Саяногорск, Ленинградский микрорайон, 19, 39Н</p>
          <p class="mb-5 lh-1">Телефон <strong>8 800 222 49 06</strong>, электронная почта: stemi&#64;stemi24.ru</p>
          <p style="font-size: 12px;">© ЧОУ ПО «Саянский техникум СТЭМИ» 2024. Все права защищены.</p>
          <p style="font-size: 12px;">
            Изготовление сайта: 
            <a href="http://our-link.ru" target="_blank" class="text-white">«Записать нас»</a>
          </p>
        </div>
        <div class="container payment col-auto mt-5">
          <p>QR-КОД ДЛЯ ОПЛАТЫ</p>
          <img src="/img/kode.png" alt="QR код" style="max-width: 150px;">
          <p class="mt-2">
            <a href="https://technicum.info/images/doc/instrukcia.pdf" target="_blank" class="text-white">ИНСТРУКЦИЯ ПО ОПЛАТЕ</a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      display: flex;
      justify-content: space-evenly;
      background-color: #0064b4;
      color: #f3f3f3;
    }

    .payment {
      text-align: center;
      margin-left: 1.5em;
    }

    .payment a {
      color: #f3f3f3;
    }

    .info {
      margin-left: .5em;
    }

    @media (max-width: 768px) {
      .footer {
        flex-direction: column;
        text-align: center;
      }
      
      .payment, .info {
        margin: 1rem 0;
      }
    }
  `]
})
export class FooterComponent { }
