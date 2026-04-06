export interface IFindAllUsersUseCaseResponse {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    role:{
        name: string;
    };
    company: {
        tradeName: string;
        cnpj: string;
    } | null;
}