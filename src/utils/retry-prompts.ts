export const MAX_RETRIES = 3;

export function buildRetryPrompt(
	originalRequest: string,
	invalidResponse: string,
): string {
	return `
The previous response was invalid.

ORIGINAL USER REQUEST:
${originalRequest}

PREVIOUS INVALID RESPONSE:
${invalidResponse}

Return valid JSON matching the required schema.

Return JSON only.

Do not include explanations.
`;
}
