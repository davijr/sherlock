import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BancoDadosPage } from './banco-dados.page';

describe('BancoDadosPage', () => {
  let component: BancoDadosPage;
  let fixture: ComponentFixture<BancoDadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BancoDadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BancoDadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
