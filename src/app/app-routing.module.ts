import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'boas-vindas', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login/:logout',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/scanner/scanner.module').then( m => m.ScannerPageModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./pages/configuracao/configuracao.module').then( m => m.ConfiguracaoPageModule)
  },
  {
    path: 'mensagem/:tipoMensagem',
    loadChildren: () => import('./pages/mensagem/mensagem.module').then( m => m.MensagemPageModule)
  },
  {
    path: 'pista/:pistaKey',
    loadChildren: () => import('./pages/pista/pista.module').then( m => m.PistaPageModule)
  },
  {
    path: 'boas-vindas',
    loadChildren: () => import('./pages/boas-vindas/boas-vindas.module').then( m => m.BoasVindasPageModule)
  },
  {
    path: 'conversas',
    loadChildren: () => import('./pages/conversas/conversas.module').then( m => m.ConversasPageModule)
  },
  {
    path: 'banco-dados',
    loadChildren: () => import('./pages/banco-dados/banco-dados.module').then( m => m.BancoDadosPageModule)
  },
  {
    path: 'painel-pistas',
    loadChildren: () => import('./pages/painel-pistas/painel-pistas.module').then( m => m.PainelPistasPageModule)
  },
  {
    path: 'painel-equipes',
    loadChildren: () => import('./pages/painel-equipes/painel-equipes.module').then( m => m.PainelEquipesPageModule)
  },
  {
    path: 'painel-sombras',
    loadChildren: () => import('./pages/painel-sombras/painel-sombras.module').then( m => m.PainelSombrasPageModule)
  },
  {
    path: 'anotacao',
    loadChildren: () => import('./pages/anotacao/anotacao.module').then( m => m.AnotacaoPageModule)
  },
  {
    path: 'anotacao-equipe/:equipe',
    loadChildren: () => import('./pages/anotacao-equipe/anotacao-equipe.module').then( m => m.AnotacaoEquipePageModule)
  },
  {
    path: 'usuarios-online/:tipo',
    loadChildren: () => import('./pages/usuarios-online/usuarios-online.module').then( m => m.UsuariosOnlinePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
