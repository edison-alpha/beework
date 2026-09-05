export const referralsApi = {
  async applyCode(code: string) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (code.trim().length < 4) throw new Error("Enter a valid referral code.");
    return { accepted: true };
  },
};
