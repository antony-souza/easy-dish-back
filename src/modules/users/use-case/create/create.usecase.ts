import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { CreateUserDto } from "./schema/create.schema.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { hash } from "bcrypt";

interface ICreateUserUseCaseResponse {
    id: string;
}

export class CreateUserUseCase implements IUseCase<CreateUserDto, ICreateUserUseCaseResponse> {

    async handle(dto: CreateUserDto): Promise<IApiResponse<ICreateUserUseCaseResponse>> {

        const existsUser = await prisma.user.count({
            where: {
                email: dto.email,
                deletedAt: null,
            },
        });

        if (existsUser > 0) {
            return {
                data: [],
                message: "Usuário já cadastrado",
                statusCode: 400,
                errors: ["Usuário já cadastrado"],
            }
        }

        if (dto.cnpj) {
            const existsCompany = await prisma.company.count({
                where: {
                    cnpj: dto.cnpj,
                    deletedAt: null,
                },
            });

            if (existsCompany > 0) {
                return {
                    data: [],
                    message: "Empresa já cadastrada",
                    statusCode: 409,
                    errors: ["Empresa já cadastrada"],
                }
            }
        }

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    fullName: dto.fullName,
                    email: dto.email,
                    phone: dto.phone || null,
                    cpf: dto.cpf || null,
                    password: await hash(dto.password, 10),
                    roleId: dto.roleId,
                    companyId: dto.companyId || null,
                },
                select: {
                    id: true,
                }
            });

            if (dto.cnpj) {
                await tx.company.create({
                    data: {
                        cnpj: dto.cnpj,
                        tradeName: dto.fullName,
                        legalName: dto.fullName,
                        users: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                });
            }

            return;
        });

        return {
            data: [],
            message: "Usuário cadastrado com sucesso",
            statusCode: 201,
            errors: [],
        }
    }
}