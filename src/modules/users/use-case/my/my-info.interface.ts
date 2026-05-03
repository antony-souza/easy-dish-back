export interface IMyInfoUseCaseResponse {
    id: string;
    fullName: string; 
    avatarUrl: string | null;
    email: string;
    isVerified: boolean | null
    phone: string | null;
    cpf: string | null;
    role: {
        name: string;
    };
    company: {
        id: string;
        tradeName: string;
        cnpj: string;
    } | null;
}