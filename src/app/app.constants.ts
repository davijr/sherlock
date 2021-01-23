
export class AppConstants {
    // static readonly URL_BASE_FIREBASE = '/sherlock'; // producao
    static readonly URL_BASE_FIREBASE = '/sherlock-dev'; // desenvolvimento

    // autenticação
    static readonly URL_USUARIO = AppConstants.URL_BASE_FIREBASE + '/usuario';
    static readonly URL_USUARIO_ONLINE = AppConstants.URL_BASE_FIREBASE + '/usuario-online';
    static readonly URL_PERMISSAO = AppConstants.URL_BASE_FIREBASE + '/permissao';
    static readonly URL_HISTORICO_LOGIN = AppConstants.URL_BASE_FIREBASE + '/historico-login';

    // configuracao
    static readonly URL_CONFIGURACAO = AppConstants.URL_BASE_FIREBASE + '/configuracao';
    static readonly URL_CONVERSA = AppConstants.URL_BASE_FIREBASE + '/conversa';

    // game
    static readonly URL_PISTA = AppConstants.URL_BASE_FIREBASE + '/pista';
    static readonly URL_PISTA_EQUIPE = AppConstants.URL_BASE_FIREBASE + '/pista-equipe';
    static readonly URL_HISTORICO_PISTA_EQUIPE = AppConstants.URL_BASE_FIREBASE + '/historico-pista-equipe';

    // anotação
    static readonly URL_ANOTACAO = AppConstants.URL_BASE_FIREBASE + '/anotacao';
}