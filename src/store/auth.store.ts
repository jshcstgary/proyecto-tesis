// Constants
import { DefaultValues, ErrorMessages } from "@/constants";

// Firebase
import { firebaseSignInDoctor, firebaseSignOutDoctor, firebaseSignUpDoctor } from "@/firebase/services/auth";
import { firebaseGetDoctor } from "@/firebase/services/database";

// Enums & Types
import { LocalStorageKeys } from "@/enums";
import { ApiResponse, AuthForm, Doctor } from "@/types";
import { AuthStore } from "@/types/store";

// Zustand
import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Zustand store for authentication state.
 * Utilizes the devtools middleware for debugging.
 *
 * @type {*}
 * @returns {AuthStore} The authentication store.
 */
export const authStore = create<AuthStore>()(
	devtools((set) => ({
		isAuthenticated: Boolean(localStorage.getItem(LocalStorageKeys.Id)) && Boolean(localStorage.getItem(LocalStorageKeys.Role)),
		currentDoctor: DefaultValues.Doctor,
		clearIsAuthenticated: (): void => {
			set(
				{
					isAuthenticated: false,
					currentDoctor: DefaultValues.Doctor
				},
				false,
				"CLEAR_ERROR_MESSAGE"
			);
		},
		getCurrentDoctor: async (id: string): Promise<string> => {
			const apiResponse: ApiResponse<Doctor> = await firebaseGetDoctor(id);

			if (!apiResponse.success) {
				localStorage.removeItem(LocalStorageKeys.Id);
				localStorage.removeItem(LocalStorageKeys.Role);

				set(
					{
						currentDoctor: DefaultValues.Doctor,
						isAuthenticated: false
					},
					false,
					"CLEAR_CURRENT_DOCTOR"
				);

				return apiResponse.message;
			}

			const { data } = apiResponse.data!;

			localStorage.setItem(LocalStorageKeys.Id, id);
			localStorage.setItem(LocalStorageKeys.Role, data.role);

			set(
				{
					currentDoctor: {
						id,
						data
					},
					isAuthenticated: true
				},
				false,
				"SET_CURRENT_USER"
			);

			return "";
		},
		setIsAuthenticated: (doctor: Doctor): void => {
			set(
				{
					isAuthenticated: true,
					currentDoctor: doctor
				},
				false,
				"SET_AUTHENTICATED_USER"
			);
		},
		signInDoctor: async (authData: AuthForm): Promise<string> => {
			const apiResponse: ApiResponse<string> = await firebaseSignInDoctor(authData);

			if (!apiResponse.success) {
				if (apiResponse.message === ErrorMessages.InvalidCredentials) {
					return ErrorMessages.InvalidCredentials;
				} else {
					return ErrorMessages.CouldNotCompleteTask;
				}
			}

			return apiResponse.data!;
		},
		signOutDoctor: async (): Promise<string> => {
			const apiResponse: ApiResponse<null> = await firebaseSignOutDoctor();

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return "";
		},
		signUpDoctor: async ({ email, password }: AuthForm): Promise<string> => {
			const apiResponse: ApiResponse<string> = await firebaseSignUpDoctor({
				email,
				password
			});

			if (!apiResponse.success) {
				return ErrorMessages.CouldNotCompleteTask;
			}

			return apiResponse.data!;
		}
	}))
);
