import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';


@Component({
  selector: 'app-private-example',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './private-example.component.html',
  styleUrl: './private-example.component.css'
})
export class PrivateExampleComponent {

}
