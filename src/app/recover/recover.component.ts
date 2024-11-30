import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css'
})
export class RecoverComponent {
  email: string = '';

  constructor(private route: ActivatedRoute,
    private router: Router
  ) { }

  recoverPassword() {
    if (this.email) {
      console.log('Solicitação de recuperação de senha enviada para:', this.email);
      this.router.navigate(['/confirmacao']);
    } else {
      alert('Por favor, insira um e-mail válido.');
    }
  }


}
