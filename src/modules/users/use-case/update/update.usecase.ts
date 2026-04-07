import type { IUseCase } from "../../../../contracts/use-case.contract.js";
import type { UpdateUserDto } from "./schema/update.schema.js";
import type { IApiResponse } from "../../../../utils/api-response.js";
import { prisma } from "../../../../config/prisma.connect.js";
import { uploadService } from "../../../../common/upload/upload.service.js";
import { cacheKeysUtils } from "../../../../common/cache/utils/cache-keys.utils.js";
import { CacheService } from "../../../../common/cache/cache.service.js";

interface IUpdateUserUseCaseResponse {
    id: string;
}

export class UpdateUserUseCase implements IUseCase<UpdateUserDto, IUpdateUserUseCaseResponse> {
    private cacheKey = cacheKeysUtils.myInfo;

    async handle(dto: UpdateUserDto): Promise<IApiResponse<IUpdateUserUseCaseResponse>> {
        const cache = new CacheService();

        const existsUser = await prisma.user.findUnique({
            where: {
                id: dto.userId,
                deletedAt: null,
            },
            select: {
                id: true,
                avatarUrl: true,
            }
        });

        if (!existsUser) {
            return {
                data: [],
                message: "Usuário não encontrado",
                statusCode: 404,
                errors: ["Usuário não encontrado"],
            }
        }

        if (dto.companyId) {
            const existsCompany = await prisma.company.count({
                where: {
                    id: dto.companyId,
                    deletedAt: null,
                },
            });

            if (!existsCompany) {
                return {
                    data: [],
                    message: "Empresa não encontrada",
                    statusCode: 404,
                    errors: ["Empresa não encontrada"],
                }
            }
        }

        let avatarUrl: string | null = existsUser.avatarUrl;

        if (dto.avatar) {
            avatarUrl = (await uploadService.uploadFile(dto.avatar, "avatars")).url;
        }

        await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: {
                    id: dto.userId,
                },
                data: {
                    fullName: dto.fullName,
                    email: dto.email,
                    phone: dto.phone || null,
                    cpf: dto.cpf || null,
                    companyId: dto.companyId || null,
                    avatarUrl: avatarUrl,
                },
                select: {
                    id: true,
                }
            });

            if (dto.companyId) {
                await tx.company.update({
                    where: {
                        id: dto.companyId,
                    },
                    data: {
                        ...(dto.cnpj !== undefined && { cnpj: dto.cnpj }),
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

        await cache.del(`${this.cacheKey}-${dto.userId}`);

        return {
            data: [],
            message: "Usuário atualizado com sucesso",
            statusCode: 200,
            errors: [],
        }
    }
}