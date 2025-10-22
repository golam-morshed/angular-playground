import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-directives',
  templateUrl: './custom-directives.component.html',
  styleUrls: ['./custom-directives.component.scss']
})
export class CustomDirectivesComponent {
  // Example colors for demonstration
  colors = [
    { name: 'Yellow', value: 'yellow' },
    { name: 'Light Blue', value: 'lightblue' },
    { name: 'Light Green', value: 'lightgreen' },
    { name: 'Pink', value: 'pink' },
    { name: 'Lavender', value: 'lavender' },
    { name: 'Light Coral', value: 'lightcoral' }
  ];

  customColor: string = '#ff6b6b';
}

