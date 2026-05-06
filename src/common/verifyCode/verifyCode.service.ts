import { prisma } from "../../config/prisma.connect.js"
import { generateAlphanumeric } from "../../utils/generateAlphanumericString.js"

export class VerifyCodeService {
	static generateRandomCode() {
		return generateAlphanumeric()
	}
	static async createNewVerifyCode(userId: string) {
		const generatedVerifyCode = this.generateRandomCode()
		await prisma.verifyCode.create({
			data: {
				code: generatedVerifyCode,
				userId: userId,
			},
		})
	}

	static async regenerateUserVerifyCode(userId: string) {
		const generatedVerifyCode = this.generateRandomCode()
		const verifyCode = await prisma.verifyCode.update({
			where: {
				userId: userId,
			},
			data: {
				code: generatedVerifyCode,
			},
		})
		return verifyCode.code
	}

	static async verifyCode(code?: string, verifyCodeId?: string) {
		if (code) {
			return await this.verifyCodeByCode(code)
		}
		if (verifyCodeId) {
			return await this.verifyCodeById(verifyCodeId)
		}
	}

	private static async verifyCodeByCode(code: string) {
		const [verifyCode] = await prisma.verifyCode.findMany({
			where: {
				code: code,
				deletedAt: null,
			},
		})

		if (verifyCode) {
			return await this.updateUserAfterCodeVerification(
				verifyCode.userId,
				verifyCode.id,
			)
		}
	}
	private static async verifyCodeById(codeId: string) {
		const verifyCode = await prisma.verifyCode.findUnique({
			where: {
				id: codeId,
				deletedAt: null,
			},
		})

		if (verifyCode) {
			return await this.updateUserAfterCodeVerification(
				verifyCode.userId,
				verifyCode.id,
			)
		}
	}
	private static async updateUserAfterCodeVerification(
		userId: string,
		verifyCodeId: string,
	) {
		const [, user] = await prisma.$transaction([
			prisma.verifyCode.update({
				where: {
					id: verifyCodeId,
					userId: userId,
				},
				data: {
					code: "verified",
					deletedAt: new Date(),
				},
			}),

			prisma.user.update({
				where: { id: userId },
				data: {
					isVerified: true,
				},
			}),
		])
		return user
	}
}
