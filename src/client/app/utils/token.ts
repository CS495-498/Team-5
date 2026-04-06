/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Frontend no longer stores authentication tokens.
 * Authentication is handled via HttpOnly cookies set by the backend.
 */


/**
 * Throws an error because frontend-accessible authentication tokens are disabled.
 * Authentication is handled exclusively via HttpOnly cookies.
 * @throws Error Always thrown to prevent JavaScript access to session tokens.
 */
export function getToken(): never {
	throw new Error('Frontend token access is disabled; authentication is cookie-based');
}


/**
 * @returns false because tokens are no longer stored client-side
 */
export function hasToken(): boolean {
	return false;
}

/**
 * No-op: frontend no longer deletes tokens
 */
export function deleteToken(): void {
	// intentionally empty
}

/**
 * No-op: frontend no longer stores tokens
 */
export function setToken(): void {
	// intentionally empty
}
