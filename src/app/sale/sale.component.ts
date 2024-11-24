import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

  constructor(private route: ActivatedRoute,
    private router: Router 
  ) { }
  
  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }
  
  navigateToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

}
