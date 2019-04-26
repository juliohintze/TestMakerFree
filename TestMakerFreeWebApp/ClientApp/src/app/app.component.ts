import { Component, HostListener, OnInit } from '@angular/core';
import { faHome, faSignInAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveService } from './services/responsive-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ClientApp';

  // Icons
  faHome = faHome;
  faLogin = faSignInAlt;
  faInfo = faInfoCircle;

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width >= 900) {
      this.responsiveService.size = 'big';
    } else {
      this.responsiveService.size = 'small';
    }
  }

  ngOnInit() {
    this.onResize(window.innerWidth);
  }

  constructor(private responsiveService: ResponsiveService) {  }
}