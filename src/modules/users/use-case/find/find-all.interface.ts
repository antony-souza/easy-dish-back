export interface IFindAllUsersUseCaseResponse {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    company: {
        id: string;
        tradeName: string;
        cnpj: string;
    } | null;
}