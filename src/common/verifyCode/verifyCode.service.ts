import { prisma } from "../../config/prisma.connect.js";
import { generateAlphanumeric } from "../../utils/generateAlphanumericString.js";
import { getCacheService } from "../cache/cache.service.js";
import { cacheKeysUtils } from "../cache/utils/cache-keys.utils.js";

export class VerifyCodeService {
	static generateRandomCode() {
		return generateAlphanumeric();
	}
	static async createNewVerifyCode(userId: string) {
		const cache = getCacheService();
		const generatedVerifyCode = this.generateRandomCode();
		await cache.set(
			`${cacheKeysUtils.verifyEmail}${userId}`,
			generatedVerifyCode,
			300,
		);
	}

	static async regenerateUserVerifyCode(userId: string) {
		const cache = getCacheService();
		const generatedVerifyCode = this.generateRandomCode();
		await cache.set(
			`${cacheKeysUtils.verifyEmail}${userId}`,
			generatedVerifyCode,
			300,
		);
		return generatedVerifyCode;
	}

	static async verifyCode(code: string, userId: string) {
		return await this.verifyCodeOnCache(code, userId);
	}

	private static async verifyCodeOnCache(code: string, userId: string) {
		const cache = getCacheService();
		const storedCode = await cache.get<string>(
			`${cacheKeysUtils.verifyEmail}${userId}`,
		);
		if (storedCode !== code) {
			return;
		}
		await this.updateUserAfterCodeVerification(userId);
		await cache.del(`${cacheKeysUtils.verifyEmail}${userId}`);

		return { success: true };
	}
	private static async updateUserAfterCodeVerification(userId: string) {
		await prisma.user.update({
			where: { id: userId },
			data: {
				isVerified: true,
			},
		});
	}
}
